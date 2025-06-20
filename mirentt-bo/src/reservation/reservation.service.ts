import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, Not, In } from 'typeorm';
import { Reservation } from '../entities/reservation.entity'; // Assurez-vous que votre entité Reservation utilise 'ReservationStatus'
import { CreateReservationDto } from '../reservation/create_reservation.dto';
import { VehiclesService } from '../vehicles/vehicles.service';
import { RegionService } from '../regions/regions.service';
import * as dayjs from 'dayjs';
import * as isBetween from 'dayjs/plugin/isBetween';
import { Status } from '../entities/status.entity'; // Ceci est pour le statut du VEHICULE
import { UpdateReservationDto } from './update_reservation.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { ReservationStatus } from './Enum/reservation-status.enum'; // Import de l'énumération des statuts de réservation
import { Cron, CronExpression } from '@nestjs/schedule'; // Import pour les tâches planifiées

dayjs.extend(isBetween);

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    private vehicleService: VehiclesService,
    private regionService: RegionService,
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>, // Pour les statuts de VEHICULE (Disponible, Réservé)
    private notificationService: NotificationsService,
  ) {}

  /**
   * Crée une nouvelle réservation.
   * Valide les dates, la disponibilité du véhicule, la région et les chevauchements.
   * Met à jour le statut du véhicule à 'Réservé' et initialise le statut de la réservation à 'À venir'.
   * Envoie une notification de nouvelle réservation.
   * @param createReservationDto Les données de la nouvelle réservation.
   * @returns La réservation créée.
   */
  async create(
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    const {
      startDate,
      endDate,
      vehicleId,
      regionName,
      fullName,
      email,
      phone, // Assurez-vous que phone est aussi dans votre DTO si vous l'utilisez
    } = createReservationDto;

    const start = dayjs(startDate);
    const end = dayjs(endDate);

    // Valide les dates de réservation
    if (start.isBefore(dayjs(), 'day')) {
      throw new BadRequestException(
        'La date de début ne peut pas être dans le passé.',
      );
    }
    if (start.isAfter(end)) {
      throw new BadRequestException(
        'La date de fin doit être après la date de début.',
      );
    }

    // Vérifie la disponibilité du véhicule
    const vehicle = await this.vehicleService.findOne(vehicleId);
    if (!vehicle) {
      throw new NotFoundException(
        `Véhicule avec l'ID ${vehicleId} non trouvé.`,
      );
    }

    // Le statut du véhicule doit être 'Disponible' pour créer une réservation
    if (vehicle.status.status !== 'Disponible') {
      throw new BadRequestException(
        `Le véhicule n'est pas disponible pour la réservation. Statut actuel : ${vehicle.status.status}.`,
      );
    }

    // Vérifie l'existence de la région de prise en charge
    const region = await this.regionService.findByName(regionName);
    if (!region) {
      throw new NotFoundException(`Région '${regionName}' non trouvée.`);
    }

    // Vérifie si les informations de prix sont disponibles pour la région
    if (!region.prix || typeof region.prix.prix === 'undefined') {
      throw new BadRequestException(
        `Les informations de prix pour la région '${regionName}' sont manquantes.`,
      );
    }

    // Vérifie les chevauchements de réservation pour le même véhicule
    const overlappingReservations = await this.reservationRepository.find({
      where: {
        vehicle: { id: vehicleId },
        startDate: LessThanOrEqual(end.toDate()),
        endDate: MoreThanOrEqual(start.toDate()),
        // Exclure les réservations annulées ou terminées si elles ne doivent pas être considérées comme des chevauchements
        // status: Not(In([ReservationStatus.CANCELLED, ReservationStatus.COMPLETED])),
      },
    });

    if (overlappingReservations.length > 0) {
      throw new BadRequestException(
        'Le véhicule est déjà réservé pendant les dates demandées.',
      );
    }

    // Calcule le prix total de la réservation
    const numberOfDays = end.diff(start, 'day') + 1;
    const totalPriceCalculated = Number(region.prix.prix) * numberOfDays;

    // Crée l'entité de réservation avec le statut initial 'À venir'
    const reservation = this.reservationRepository.create({
      ...createReservationDto,
      startDate: start.toDate(),
      endDate: end.toDate(),
      vehicle: vehicle,
      pickupRegion: region,
      totalPrice: totalPriceCalculated,
      status: ReservationStatus.UPCOMING, // Statut initial pour une nouvelle réservation
    });

    const savedReservation = await this.reservationRepository.save(reservation);

    // Met à jour le statut du véhicule à 'Réservé'
    const reservedStatusEntity = await this.statusRepository.findOne({
      where: { status: 'Réservé' },
    });
    if (!reservedStatusEntity) {
      throw new NotFoundException(
        "L'entité de statut 'Réservé' pour le véhicule non trouvée.",
      );
    }
    await this.vehicleService.updateStatus(vehicle.id, reservedStatusEntity.id);

    // Envoie une notification après la création réussie de la réservation
    try {
      await this.notificationService.createNotification({
        type: 'nouvelle_reservation',
        message: `Nouvelle réservation de ${fullName || 'un client'} pour le véhicule ${vehicle.modele} (${vehicle.nombrePlace}) du ${dayjs(startDate).format('DD/MM/YYYY')} au ${dayjs(endDate).format('DD/MM/YYYY')}.`,
        payload: {
          reservationId: savedReservation.id,
          clientName: fullName,
          clientEmail: email,
          clientPhone: phone,
          vehicleId: vehicle.id,
        },
      });
      console.log(
        `Notification créée pour la réservation ID: ${savedReservation.id}`,
      );
    } catch (notificationError) {
      console.error(
        'Erreur lors de la création de la notification de nouvelle réservation:',
        notificationError,
      );
      // La réservation est créée même si la notification échoue.
    }

    return savedReservation;
  }

  /**
   * Met à jour le statut d'une réservation et déclenche les actions associées (notifications, statut véhicule).
   * @param id L'ID de la réservation.
   * @param newStatus Le nouveau statut de la réservation (utilisant l'énumération ReservationStatus).
   * @returns La réservation mise à jour.
   */
  async updateReservationStatus(
    id: number,
    newStatus: ReservationStatus,
  ): Promise<Reservation> {
    const reservation = await this.findOne(id);
    const oldStatus = reservation.status;

    // Règles de transition de statut (exemple, adaptez selon vos besoins)
    if (
      oldStatus === ReservationStatus.COMPLETED &&
      newStatus !== ReservationStatus.COMPLETED
    ) {
      throw new BadRequestException(
        "Impossible de modifier le statut d'une réservation déjà terminée.",
      );
    }
    if (
      oldStatus === ReservationStatus.CANCELLED &&
      newStatus !== ReservationStatus.CANCELLED
    ) {
      throw new BadRequestException(
        "Impossible de modifier le statut d'une réservation déjà annulée.",
      );
    }
    if (oldStatus === newStatus) {
      return reservation; // Pas de changement, pas besoin de traiter
    }

    reservation.status = newStatus;
    const updatedReservation =
      await this.reservationRepository.save(reservation);

    let notificationMessage = '';
    let notificationType = '';
    let vehicleStatusToUpdate: string | null = null; // Statut du véhicule à mettre à jour

    switch (newStatus) {
      case ReservationStatus.CONFIRMED:
        notificationMessage = `La réservation #${updatedReservation.id} du véhicule ${updatedReservation.vehicle.modele} a été confirmée.`;
        notificationType = 'reservation_confirmee';
        // Si le véhicule était 'Réservé', il reste 'Réservé'
        break;
      case ReservationStatus.IN_PROGRESS:
        notificationMessage = `La réservation #${updatedReservation.id} du véhicule ${updatedReservation.vehicle.modele} est maintenant 'En cours'.`;
        notificationType = 'reservation_en_cours';
        // Le véhicule est déjà 'Réservé', il reste 'Réservé'
        break;
      case ReservationStatus.COMPLETED:
        notificationMessage = `La réservation #${updatedReservation.id} du véhicule ${updatedReservation.vehicle.modele} a été terminée.`;
        notificationType = 'reservation_terminee';
        vehicleStatusToUpdate = 'Disponible'; // Le véhicule redevient disponible
        break;
      case ReservationStatus.CANCELLED:
        notificationMessage = `La réservation #${updatedReservation.id} du véhicule ${updatedReservation.vehicle.modele} a été annulée.`;
        notificationType = 'reservation_annulee';
        vehicleStatusToUpdate = 'Disponible'; // Le véhicule redevient disponible
        break;
      case ReservationStatus.PENDING_PAYMENT:
        notificationMessage = `La réservation #${updatedReservation.id} du véhicule ${updatedReservation.vehicle.modele} est en attente de paiement.`;
        notificationType = 'reservation_attente_paiement';
        break;
      case ReservationStatus.UPCOMING:
        // Généralement, on ne revient pas à 'UPCOMING' après avoir avancé.
        // Cette transition pourrait être pour une réinitialisation manuelle si nécessaire.
        notificationMessage = `La réservation #${updatedReservation.id} du véhicule ${updatedReservation.vehicle.modele} est à nouveau 'À venir'.`;
        notificationType = 'reservation_reinitialisee';
        break;
    }

    // Met à jour le statut du véhicule si nécessaire
    if (vehicleStatusToUpdate) {
      const vehicleNewStatusEntity = await this.statusRepository.findOne({
        where: { status: vehicleStatusToUpdate },
      });
      if (!vehicleNewStatusEntity) {
        console.warn(
          `Statut de véhicule '${vehicleStatusToUpdate}' non trouvé. Impossible de mettre à jour le véhicule.`,
        );
      } else {
        await this.vehicleService.updateStatus(
          updatedReservation.vehicle.id,
          vehicleNewStatusEntity.id,
        );
      }
    }

    // Envoie une notification si un message est défini
    if (notificationMessage) {
      try {
        await this.notificationService.createNotification({
          type: notificationType,
          message: notificationMessage,
          payload: {
            reservationId: updatedReservation.id,
            oldStatus: oldStatus,
            newStatus: newStatus,
            vehicleId: updatedReservation.vehicle.id,
            clientName: updatedReservation.fullName, // Ajout des infos client pour la notif
            clientEmail: updatedReservation.email,
          },
        });
        console.log(
          `Notification créée pour la mise à jour de statut de réservation ID: ${updatedReservation.id} vers ${newStatus}`,
        );
      } catch (notificationError) {
        console.error(
          'Erreur lors de la création de la notification de statut:',
          notificationError,
        );
      }
    }

    return updatedReservation;
  }

  /**
   * Annule une réservation spécifique.
   * Change le statut de la réservation à 'Annulée' et rend le véhicule 'Disponible'.
   * @param id L'ID de la réservation à annuler.
   * @returns La réservation mise à jour.
   */
  async cancelReservation(id: number): Promise<Reservation> {
    const reservation = await this.findOne(id);

    // Empêche l'annulation si déjà terminée ou annulée
    if (
      reservation.status === ReservationStatus.COMPLETED ||
      reservation.status === ReservationStatus.CANCELLED
    ) {
      throw new BadRequestException(
        "Impossible d'annuler une réservation terminée ou déjà annulée.",
      );
    }

    // Appelle la méthode générique de mise à jour de statut pour gérer la transition
    return this.updateReservationStatus(id, ReservationStatus.CANCELLED);
  }

  /**
   * Tâche planifiée quotidienne pour mettre à jour les statuts des réservations.
   * Vérifie les réservations dont la date de début est aujourd'hui (pour 'En cours').
   * Vérifie les réservations dont la date de fin est passée (pour 'Terminée').
   * S'exécute chaque jour à 00:00.
   */
  @Cron(CronExpression.EVERY_MINUTE) // S'exécute toutes les minutes
  handleTestCron() {
    console.log('--- TEST CRON EXECUTED ---', new Date());
  }
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleReservationStatusUpdates() {
    console.log(
      '*** DEBUT TACHE CRON : handleReservationStatusUpdates ***',
      new Date(),
    );
    const today = dayjs().startOf('day');
    console.log(
      `Date actuelle pour la tâche cron: ${today.format('YYYY-MM-DD')}`,
    );

    // 1. Mettre à jour les réservations 'À venir' en 'En cours'
    console.log(
      'Recherche des réservations UPCOMING à passer en IN_PROGRESS...',
    );
    const upcomingReservations = await this.reservationRepository.find({
      where: {
        status: ReservationStatus.UPCOMING,
        startDate: LessThanOrEqual(today.toDate()),
      },
      relations: ['vehicle'],
    });
    console.log(
      `Trouvé ${upcomingReservations.length} réservations UPCOMING à traiter.`,
    );

    for (const reservation of upcomingReservations) {
      console.log(
        `Traitement réservation ${reservation.id} (UPCOMING). StartDate: ${dayjs(reservation.startDate).format('YYYY-MM-DD')}`,
      );
      // ... (votre logique existante)
      await this.updateReservationStatus(
        reservation.id,
        ReservationStatus.IN_PROGRESS,
      );
      console.log(`Réservation ${reservation.id} passée à 'En cours'.`);
    }
    console.log('Fin du traitement des réservations UPCOMING.');

    // 2. Mettre à jour les réservations 'En cours' en 'Terminée'
    console.log(
      'Recherche des réservations IN_PROGRESS à passer en COMPLETED...',
    );
    const inProgressReservations = await this.reservationRepository.find({
      where: {
        status: ReservationStatus.IN_PROGRESS,
        endDate: LessThanOrEqual(today.toDate()),
      },
      relations: ['vehicle'],
    });
    console.log(
      `Trouvé ${inProgressReservations.length} réservations IN_PROGRESS à traiter.`,
    );

    for (const reservation of inProgressReservations) {
      console.log(
        `Traitement réservation ${reservation.id} (IN_PROGRESS). EndDate: ${dayjs(reservation.endDate).format('YYYY-MM-DD')}`,
      );
      // ... (votre logique existante)
      await this.updateReservationStatus(
        reservation.id,
        ReservationStatus.COMPLETED,
      );
      console.log(`Réservation ${reservation.id} passée à 'Terminée'.`);
    }
    console.log('*** FIN TACHE CRON ***');
  }

  /**
   * Récupère toutes les réservations avec les relations nécessaires.
   * @returns Une liste de réservations.
   */
  async findAll(): Promise<Reservation[]> {
    return this.reservationRepository.find({
      relations: [
        'vehicle',
        'pickupRegion',
        'vehicle.type',
        'vehicle.status',
        'pickupRegion.prix',
      ],
      order: {
        startDate: 'DESC',
      },
    });
  }

  /**
   * Récupère une seule réservation par son ID.
   * @param id L'ID de la réservation.
   * @returns La réservation trouvée.
   * @throws NotFoundException Si la réservation n'est pas trouvée.
   */
  async findOne(id: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: [
        'vehicle',
        'pickupRegion',
        'vehicle.type',
        'vehicle.status',
        'pickupRegion.prix',
      ],
    });
    if (!reservation) {
      throw new NotFoundException(`Réservation avec l'ID ${id} non trouvée.`);
    }
    return reservation;
  }

  /**
   * Met à jour une réservation existante.
   * Gère la mise à jour des dates, du prix, des informations du client et du statut.
   * @param id L'ID de la réservation à mettre à jour.
   * @param updateReservationDto Les données de mise à jour.
   * @returns La réservation mise à jour.
   */
  async update(
    id: number,
    updateReservationDto: UpdateReservationDto,
  ): Promise<Reservation> {
    const reservation = await this.findOne(id); // Récupère la réservation existante

    // Gère la mise à jour des dates et le recalcul du prix
    if (updateReservationDto.startDate || updateReservationDto.endDate) {
      const newStartDate = dayjs(
        updateReservationDto.startDate || reservation.startDate,
      );
      const newEndDate = dayjs(
        updateReservationDto.endDate || reservation.endDate,
      );

      if (newStartDate.isAfter(newEndDate)) {
        throw new BadRequestException(
          'La date de fin doit être après la date de début pour la mise à jour.',
        );
      }

      // Vérifie les chevauchements pour les nouvelles dates (exclut la réservation actuelle)
      const overlappingReservations = await this.reservationRepository.find({
        where: {
          vehicle: { id: reservation.vehicle.id },
          startDate: LessThanOrEqual(newEndDate.toDate()),
          endDate: MoreThanOrEqual(newStartDate.toDate()),
          // Exclure les réservations annulées ou terminées si elles ne doivent pas être considérées comme des chevauchements
          status: Not(
            In([ReservationStatus.CANCELLED, ReservationStatus.COMPLETED]),
          ),
        },
      });

      const conflicts = overlappingReservations.filter(
        (res) => res.id !== reservation.id,
      );
      if (conflicts.length > 0) {
        throw new BadRequestException(
          'Le véhicule est déjà réservé pendant les dates demandées pour la mise à jour.',
        );
      }

      // Recalcule le prix total
      const numberOfDays = newEndDate.diff(newStartDate, 'day') + 1;
      const region = reservation.pickupRegion;
      if (!region.prix || typeof region.prix.prix === 'undefined') {
        throw new BadRequestException(
          `Les informations de prix pour la région '${region.nom_region}' sont manquantes pour la mise à jour.`,
        );
      }
      reservation.totalPrice = Number(region.prix.prix) * numberOfDays;
      reservation.startDate = newStartDate.toDate();
      reservation.endDate = newEndDate.toDate();
    }

    // Met à jour les autres champs de la réservation
    if (updateReservationDto.fullName)
      reservation.fullName = updateReservationDto.fullName;
    if (updateReservationDto.phone)
      reservation.phone = updateReservationDto.phone;
    if (updateReservationDto.email)
      reservation.email = updateReservationDto.email;

    // Si le statut est mis à jour, déléguer à updateReservationStatus pour une logique cohérente
    if (
      updateReservationDto.status &&
      reservation.status !== updateReservationDto.status
    ) {
      // Convertit la chaîne de statut en membre de l'énumération pour l'appel
      // Ceci suppose que updateReservationDto.status contient une chaîne valide de ReservationStatus
      const newStatusAsEnum = updateReservationDto.status as ReservationStatus;
      // Utilisez this.updateReservationStatus pour gérer la logique de transition, notifications, etc.
      // Important: cette méthode save et retourne déjà la réservation, donc pas besoin de la sauvegarder à nouveau ici
      return this.updateReservationStatus(id, newStatusAsEnum);
    }

    // Sauvegarde la réservation si aucun changement de statut n'a eu lieu qui appellerait updateReservationStatus
    const updatedReservation =
      await this.reservationRepository.save(reservation);

    // Optionnel : Ajouter une notification pour toute mise à jour de réservation
    // Si vous souhaitez notifier l'admin à chaque modification (pas seulement statut)
    try {
      await this.notificationService.createNotification({
        type: 'reservation_mise_a_jour',
        message: `La réservation #${updatedReservation.id} a été mise à jour.`,
        payload: { reservationId: updatedReservation.id },
      });
    } catch (notificationError) {
      console.error(
        'Erreur lors de la création de la notification de mise à jour:',
        notificationError,
      );
    }

    return updatedReservation;
  }

  /**
   * Supprime une réservation.
   * Si la réservation était 'À venir' ou 'En cours', le statut du véhicule redevient 'Disponible'.
   * Envoie une notification de suppression de réservation.
   * @param id L'ID de la réservation à supprimer.
   * @throws NotFoundException Si la réservation n'est pas trouvée.
   */
  async remove(id: number): Promise<void> {
    const reservation = await this.findOne(id); // Récupère la réservation pour ses détails

    // Si la réservation n'était ni terminée ni annulée, le véhicule redevient disponible
    if (
      reservation.status === ReservationStatus.UPCOMING ||
      reservation.status === ReservationStatus.IN_PROGRESS
    ) {
      const availableStatus = await this.statusRepository.findOne({
        where: { status: 'Disponible' },
      });
      if (availableStatus) {
        await this.vehicleService.updateStatus(
          reservation.vehicle.id,
          availableStatus.id,
        );
        console.log(
          `Statut du véhicule ${reservation.vehicle.id} mis à jour à 'Disponible' suite à la suppression de réservation.`,
        );
      } else {
        console.warn(
          "Statut 'Disponible' pour le véhicule non trouvé, impossible de mettre à jour le véhicule.",
        );
      }
    }

    const result = await this.reservationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Réservation avec l'ID ${id} non trouvée.`);
    }

    // Envoie une notification de suppression de réservation
    try {
      await this.notificationService.createNotification({
        type: 'reservation_supprimee',
        message: `La réservation #${id} du véhicule ${reservation.vehicle.modele} a été supprimée.`,
        payload: {
          reservationId: id,
          vehicleId: reservation.vehicle.id,
          clientName: reservation.fullName,
          clientEmail: reservation.email,
        },
      });
      console.log(
        `Notification créée pour la suppression de la réservation ID: ${id}`,
      );
    } catch (notificationError) {
      console.error(
        'Erreur lors de la création de la notification de suppression:',
        notificationError,
      );
    }
  }
}

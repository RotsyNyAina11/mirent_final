import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  HttpStatus,
  HttpCode,
  NotFoundException,
  InternalServerErrorException,
  Patch, // Ensure Patch is imported
  UsePipes,
  ValidationPipe,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from '../reservation/create_reservation.dto';
import { Reservation } from '../entities/reservation.entity';
import { UpdateReservationDto } from '../reservation/update_reservation.dto';
import { ReservationStatus } from './Enum/reservation-status.enum';

@Controller('reservations')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
)
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  /**
   * Crée une nouvelle réservation.
   * @param createReservationDto Les données de la nouvelle réservation.
   * @returns La réservation créée.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    console.log('DTO de réservation reçu et validé:', createReservationDto);
    try {
      const newReservation =
        await this.reservationService.create(createReservationDto);
      return newReservation;
    } catch (error) {
      console.error(
        'Erreur lors de la création de la réservation:',
        error.message,
        error.stack,
      );

      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException(
        'Erreur interne du serveur lors de la création de la réservation.',
      );
    }
  }

  /**
   * Récupère toutes les réservations.
   * @returns Une liste de réservations.
   */
  @Get()
  async findAll(): Promise<Reservation[]> {
    try {
      return await this.reservationService.findAll();
    } catch (error) {
      console.error(
        'Erreur lors de la récupération de toutes les réservations:',
        error.message,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Erreur interne du serveur lors de la récupération des réservations.',
      );
    }
  }

  /**
   * Récupère une seule réservation par son ID.
   * @param id L'ID de la réservation.
   * @returns La réservation trouvée.
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Reservation> {
    try {
      return await this.reservationService.findOne(+id);
    } catch (error) {
      console.error(
        `Erreur lors de la récupération de la réservation ${id}:`,
        error.message,
        error.stack,
      );
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(
        `Erreur interne du serveur lors de la récupération de la réservation avec l'ID ${id}.`,
      );
    }
  }

  /**
   * Met à jour le statut d'une réservation.
   * Utilise la nouvelle méthode centralisée du service.
   * @param id L'ID de la réservation.
   * @param status Le nouveau statut de la réservation (doit être un membre de ReservationStatus).
   * @returns La réservation mise à jour.
   */
  @Put(':id/status')
  @HttpCode(HttpStatus.OK)
  async updateReservationStatus(
    @Param('id') id: string,
    @Body('status') status: ReservationStatus,
  ): Promise<Reservation> {
    if (!Object.values(ReservationStatus).includes(status)) {
      throw new BadRequestException(
        `Statut invalide. Le statut doit être l'une des valeurs suivantes : ${Object.values(ReservationStatus).join(', ')}`,
      );
    }

    try {
      return await this.reservationService.updateReservationStatus(+id, status);
    } catch (error) {
      console.error(
        `Erreur lors de la mise à jour du statut de la réservation ${id} vers ${status}:`,
        error.message,
        error.stack,
      );
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException(
        `Erreur interne du serveur lors de la mise à jour du statut de la réservation avec l'ID ${id}.`,
      );
    }
  }

  /**
   * Annule une réservation en mettant à jour son statut.
   * Utilise PATCH car c'est une modification partielle de la ressource.
   * @param id L'ID de la réservation à annuler.
   * @returns La réservation mise à jour (annulée).
   */
  @Patch(':id/cancel') // CHANGEMENT: Utilisation de PATCH au lieu de DELETE
  @HttpCode(HttpStatus.OK) // Retourne un code 200 OK pour la mise à jour
  async cancelReservation(@Param('id') id: string): Promise<Reservation> {
    try {
      return await this.reservationService.cancelReservation(+id);
    } catch (error) {
      console.error(
        `Erreur lors de l'annulation de la réservation ${id}:`,
        error.message,
        error.stack,
      );
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException(
        `Erreur interne du serveur lors de l'annulation de la réservation avec l'ID ${id}.`,
      );
    }
  }

  /**
   * Met à jour partiellement une réservation existante.
   * @param id L'ID de la réservation.
   * @param updateReservationDto Les données de mise à jour.
   * @returns La réservation mise à jour.
   */
  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ): Promise<Reservation> {
    return this.reservationService.update(+id, updateReservationDto);
  }

  /**
   * Supprime une réservation.
   * @param id L'ID de la réservation à supprimer.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    try {
      await this.reservationService.remove(+id);
    } catch (error) {
      console.error(
        `Erreur lors de la suppression de la réservation ${id}:`,
        error.message,
        error.stack,
      );
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(
        `Erreur interne du serveur lors de la suppression de la réservation avec l'ID ${id}.`,
      );
    }
  }
}

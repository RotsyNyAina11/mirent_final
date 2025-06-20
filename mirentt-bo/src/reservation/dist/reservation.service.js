"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.ReservationService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var typeorm_2 = require("typeorm");
var reservation_entity_1 = require("../entities/reservation.entity"); // Assurez-vous que votre entité Reservation utilise 'ReservationStatus'
var dayjs = require("dayjs");
var isBetween = require("dayjs/plugin/isBetween");
var status_entity_1 = require("../entities/status.entity"); // Ceci est pour le statut du VEHICULE
var reservation_status_enum_1 = require("./Enum/reservation-status.enum"); // Import de l'énumération des statuts de réservation
var schedule_1 = require("@nestjs/schedule"); // Import pour les tâches planifiées
dayjs.extend(isBetween);
var ReservationService = /** @class */ (function () {
    function ReservationService(reservationRepository, vehicleService, regionService, statusRepository, // Pour les statuts de VEHICULE (Disponible, Réservé)
    notificationService) {
        this.reservationRepository = reservationRepository;
        this.vehicleService = vehicleService;
        this.regionService = regionService;
        this.statusRepository = statusRepository;
        this.notificationService = notificationService;
    }
    /**
     * Crée une nouvelle réservation.
     * Valide les dates, la disponibilité du véhicule, la région et les chevauchements.
     * Met à jour le statut du véhicule à 'Réservé' et initialise le statut de la réservation à 'À venir'.
     * Envoie une notification de nouvelle réservation.
     * @param createReservationDto Les données de la nouvelle réservation.
     * @returns La réservation créée.
     */
    ReservationService.prototype.create = function (createReservationDto) {
        return __awaiter(this, void 0, Promise, function () {
            var startDate, endDate, vehicleId, regionName, fullName, email, phone, start, end, vehicle, region, overlappingReservations, numberOfDays, totalPriceCalculated, reservation, savedReservation, reservedStatusEntity, notificationError_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startDate = createReservationDto.startDate, endDate = createReservationDto.endDate, vehicleId = createReservationDto.vehicleId, regionName = createReservationDto.regionName, fullName = createReservationDto.fullName, email = createReservationDto.email, phone = createReservationDto.phone;
                        start = dayjs(startDate);
                        end = dayjs(endDate);
                        // Valide les dates de réservation
                        if (start.isBefore(dayjs(), 'day')) {
                            throw new common_1.BadRequestException('La date de début ne peut pas être dans le passé.');
                        }
                        if (start.isAfter(end)) {
                            throw new common_1.BadRequestException('La date de fin doit être après la date de début.');
                        }
                        return [4 /*yield*/, this.vehicleService.findOne(vehicleId)];
                    case 1:
                        vehicle = _a.sent();
                        if (!vehicle) {
                            throw new common_1.NotFoundException("V\u00E9hicule avec l'ID " + vehicleId + " non trouv\u00E9.");
                        }
                        // Le statut du véhicule doit être 'Disponible' pour créer une réservation
                        if (vehicle.status.status !== 'Disponible') {
                            throw new common_1.BadRequestException("Le v\u00E9hicule n'est pas disponible pour la r\u00E9servation. Statut actuel : " + vehicle.status.status + ".");
                        }
                        return [4 /*yield*/, this.regionService.findByName(regionName)];
                    case 2:
                        region = _a.sent();
                        if (!region) {
                            throw new common_1.NotFoundException("R\u00E9gion '" + regionName + "' non trouv\u00E9e.");
                        }
                        // Vérifie si les informations de prix sont disponibles pour la région
                        if (!region.prix || typeof region.prix.prix === 'undefined') {
                            throw new common_1.BadRequestException("Les informations de prix pour la r\u00E9gion '" + regionName + "' sont manquantes.");
                        }
                        return [4 /*yield*/, this.reservationRepository.find({
                                where: {
                                    vehicle: { id: vehicleId },
                                    startDate: typeorm_2.LessThanOrEqual(end.toDate()),
                                    endDate: typeorm_2.MoreThanOrEqual(start.toDate())
                                }
                            })];
                    case 3:
                        overlappingReservations = _a.sent();
                        if (overlappingReservations.length > 0) {
                            throw new common_1.BadRequestException('Le véhicule est déjà réservé pendant les dates demandées.');
                        }
                        numberOfDays = end.diff(start, 'day') + 1;
                        totalPriceCalculated = Number(region.prix.prix) * numberOfDays;
                        reservation = this.reservationRepository.create(__assign(__assign({}, createReservationDto), { startDate: start.toDate(), endDate: end.toDate(), vehicle: vehicle, pickupRegion: region, totalPrice: totalPriceCalculated, status: reservation_status_enum_1.ReservationStatus.UPCOMING }));
                        return [4 /*yield*/, this.reservationRepository.save(reservation)];
                    case 4:
                        savedReservation = _a.sent();
                        return [4 /*yield*/, this.statusRepository.findOne({
                                where: { status: 'Réservé' }
                            })];
                    case 5:
                        reservedStatusEntity = _a.sent();
                        if (!reservedStatusEntity) {
                            throw new common_1.NotFoundException("L'entité de statut 'Réservé' pour le véhicule non trouvée.");
                        }
                        return [4 /*yield*/, this.vehicleService.updateStatus(vehicle.id, reservedStatusEntity.id)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        _a.trys.push([7, 9, , 10]);
                        return [4 /*yield*/, this.notificationService.createNotification({
                                type: 'nouvelle_reservation',
                                message: "Nouvelle r\u00E9servation de " + (fullName || 'un client') + " pour le v\u00E9hicule " + vehicle.modele + " (" + vehicle.nombrePlace + ") du " + dayjs(startDate).format('DD/MM/YYYY') + " au " + dayjs(endDate).format('DD/MM/YYYY') + ".",
                                payload: {
                                    reservationId: savedReservation.id,
                                    clientName: fullName,
                                    clientEmail: email,
                                    clientPhone: phone,
                                    vehicleId: vehicle.id
                                }
                            })];
                    case 8:
                        _a.sent();
                        console.log("Notification cr\u00E9\u00E9e pour la r\u00E9servation ID: " + savedReservation.id);
                        return [3 /*break*/, 10];
                    case 9:
                        notificationError_1 = _a.sent();
                        console.error('Erreur lors de la création de la notification de nouvelle réservation:', notificationError_1);
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/, savedReservation];
                }
            });
        });
    };
    /**
     * Met à jour le statut d'une réservation et déclenche les actions associées (notifications, statut véhicule).
     * @param id L'ID de la réservation.
     * @param newStatus Le nouveau statut de la réservation (utilisant l'énumération ReservationStatus).
     * @returns La réservation mise à jour.
     */
    ReservationService.prototype.updateReservationStatus = function (id, newStatus) {
        return __awaiter(this, void 0, Promise, function () {
            var reservation, oldStatus, updatedReservation, notificationMessage, notificationType, vehicleStatusToUpdate, vehicleNewStatusEntity, notificationError_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        reservation = _a.sent();
                        oldStatus = reservation.status;
                        // Règles de transition de statut (exemple, adaptez selon vos besoins)
                        if (oldStatus === reservation_status_enum_1.ReservationStatus.COMPLETED &&
                            newStatus !== reservation_status_enum_1.ReservationStatus.COMPLETED) {
                            throw new common_1.BadRequestException("Impossible de modifier le statut d'une réservation déjà terminée.");
                        }
                        if (oldStatus === reservation_status_enum_1.ReservationStatus.CANCELLED &&
                            newStatus !== reservation_status_enum_1.ReservationStatus.CANCELLED) {
                            throw new common_1.BadRequestException("Impossible de modifier le statut d'une réservation déjà annulée.");
                        }
                        if (oldStatus === newStatus) {
                            return [2 /*return*/, reservation]; // Pas de changement, pas besoin de traiter
                        }
                        reservation.status = newStatus;
                        return [4 /*yield*/, this.reservationRepository.save(reservation)];
                    case 2:
                        updatedReservation = _a.sent();
                        notificationMessage = '';
                        notificationType = '';
                        vehicleStatusToUpdate = null;
                        switch (newStatus) {
                            case reservation_status_enum_1.ReservationStatus.CONFIRMED:
                                notificationMessage = "La r\u00E9servation #" + updatedReservation.id + " du v\u00E9hicule " + updatedReservation.vehicle.modele + " a \u00E9t\u00E9 confirm\u00E9e.";
                                notificationType = 'reservation_confirmee';
                                // Si le véhicule était 'Réservé', il reste 'Réservé'
                                break;
                            case reservation_status_enum_1.ReservationStatus.IN_PROGRESS:
                                notificationMessage = "La r\u00E9servation #" + updatedReservation.id + " du v\u00E9hicule " + updatedReservation.vehicle.modele + " est maintenant 'En cours'.";
                                notificationType = 'reservation_en_cours';
                                // Le véhicule est déjà 'Réservé', il reste 'Réservé'
                                break;
                            case reservation_status_enum_1.ReservationStatus.COMPLETED:
                                notificationMessage = "La r\u00E9servation #" + updatedReservation.id + " du v\u00E9hicule " + updatedReservation.vehicle.modele + " a \u00E9t\u00E9 termin\u00E9e.";
                                notificationType = 'reservation_terminee';
                                vehicleStatusToUpdate = 'Disponible'; // Le véhicule redevient disponible
                                break;
                            case reservation_status_enum_1.ReservationStatus.CANCELLED:
                                notificationMessage = "La r\u00E9servation #" + updatedReservation.id + " du v\u00E9hicule " + updatedReservation.vehicle.modele + " a \u00E9t\u00E9 annul\u00E9e.";
                                notificationType = 'reservation_annulee';
                                vehicleStatusToUpdate = 'Disponible'; // Le véhicule redevient disponible
                                break;
                            case reservation_status_enum_1.ReservationStatus.PENDING_PAYMENT:
                                notificationMessage = "La r\u00E9servation #" + updatedReservation.id + " du v\u00E9hicule " + updatedReservation.vehicle.modele + " est en attente de paiement.";
                                notificationType = 'reservation_attente_paiement';
                                break;
                            case reservation_status_enum_1.ReservationStatus.UPCOMING:
                                // Généralement, on ne revient pas à 'UPCOMING' après avoir avancé.
                                // Cette transition pourrait être pour une réinitialisation manuelle si nécessaire.
                                notificationMessage = "La r\u00E9servation #" + updatedReservation.id + " du v\u00E9hicule " + updatedReservation.vehicle.modele + " est \u00E0 nouveau '\u00C0 venir'.";
                                notificationType = 'reservation_reinitialisee';
                                break;
                        }
                        if (!vehicleStatusToUpdate) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.statusRepository.findOne({
                                where: { status: vehicleStatusToUpdate }
                            })];
                    case 3:
                        vehicleNewStatusEntity = _a.sent();
                        if (!!vehicleNewStatusEntity) return [3 /*break*/, 4];
                        console.warn("Statut de v\u00E9hicule '" + vehicleStatusToUpdate + "' non trouv\u00E9. Impossible de mettre \u00E0 jour le v\u00E9hicule.");
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.vehicleService.updateStatus(updatedReservation.vehicle.id, vehicleNewStatusEntity.id)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        if (!notificationMessage) return [3 /*break*/, 10];
                        _a.label = 7;
                    case 7:
                        _a.trys.push([7, 9, , 10]);
                        return [4 /*yield*/, this.notificationService.createNotification({
                                type: notificationType,
                                message: notificationMessage,
                                payload: {
                                    reservationId: updatedReservation.id,
                                    oldStatus: oldStatus,
                                    newStatus: newStatus,
                                    vehicleId: updatedReservation.vehicle.id,
                                    clientName: updatedReservation.fullName,
                                    clientEmail: updatedReservation.email
                                }
                            })];
                    case 8:
                        _a.sent();
                        console.log("Notification cr\u00E9\u00E9e pour la mise \u00E0 jour de statut de r\u00E9servation ID: " + updatedReservation.id + " vers " + newStatus);
                        return [3 /*break*/, 10];
                    case 9:
                        notificationError_2 = _a.sent();
                        console.error('Erreur lors de la création de la notification de statut:', notificationError_2);
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/, updatedReservation];
                }
            });
        });
    };
    /**
     * Annule une réservation spécifique.
     * Change le statut de la réservation à 'Annulée' et rend le véhicule 'Disponible'.
     * @param id L'ID de la réservation à annuler.
     * @returns La réservation mise à jour.
     */
    ReservationService.prototype.cancelReservation = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var reservation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        reservation = _a.sent();
                        // Empêche l'annulation si déjà terminée ou annulée
                        if (reservation.status === reservation_status_enum_1.ReservationStatus.COMPLETED ||
                            reservation.status === reservation_status_enum_1.ReservationStatus.CANCELLED) {
                            throw new common_1.BadRequestException("Impossible d'annuler une réservation terminée ou déjà annulée.");
                        }
                        // Appelle la méthode générique de mise à jour de statut pour gérer la transition
                        return [2 /*return*/, this.updateReservationStatus(id, reservation_status_enum_1.ReservationStatus.CANCELLED)];
                }
            });
        });
    };
    /**
     * Tâche planifiée quotidienne pour mettre à jour les statuts des réservations.
     * Vérifie les réservations dont la date de début est aujourd'hui (pour 'En cours').
     * Vérifie les réservations dont la date de fin est passée (pour 'Terminée').
     * S'exécute chaque jour à 00:00.
     */
    ReservationService.prototype.handleTestCron = function () {
        console.log('--- TEST CRON EXECUTED ---', new Date());
    };
    ReservationService.prototype.handleReservationStatusUpdates = function () {
        return __awaiter(this, void 0, void 0, function () {
            var today, upcomingReservations, _i, upcomingReservations_1, reservation, inProgressReservations, _a, inProgressReservations_1, reservation;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('*** DEBUT TACHE CRON : handleReservationStatusUpdates ***', new Date());
                        today = dayjs().startOf('day');
                        console.log("Date actuelle pour la t\u00E2che cron: " + today.format('YYYY-MM-DD'));
                        // 1. Mettre à jour les réservations 'À venir' en 'En cours'
                        console.log('Recherche des réservations UPCOMING à passer en IN_PROGRESS...');
                        return [4 /*yield*/, this.reservationRepository.find({
                                where: {
                                    status: reservation_status_enum_1.ReservationStatus.UPCOMING,
                                    startDate: typeorm_2.LessThanOrEqual(today.toDate())
                                },
                                relations: ['vehicle']
                            })];
                    case 1:
                        upcomingReservations = _b.sent();
                        console.log("Trouv\u00E9 " + upcomingReservations.length + " r\u00E9servations UPCOMING \u00E0 traiter.");
                        _i = 0, upcomingReservations_1 = upcomingReservations;
                        _b.label = 2;
                    case 2:
                        if (!(_i < upcomingReservations_1.length)) return [3 /*break*/, 5];
                        reservation = upcomingReservations_1[_i];
                        console.log("Traitement r\u00E9servation " + reservation.id + " (UPCOMING). StartDate: " + dayjs(reservation.startDate).format('YYYY-MM-DD'));
                        // ... (votre logique existante)
                        return [4 /*yield*/, this.updateReservationStatus(reservation.id, reservation_status_enum_1.ReservationStatus.IN_PROGRESS)];
                    case 3:
                        // ... (votre logique existante)
                        _b.sent();
                        console.log("R\u00E9servation " + reservation.id + " pass\u00E9e \u00E0 'En cours'.");
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        console.log('Fin du traitement des réservations UPCOMING.');
                        // 2. Mettre à jour les réservations 'En cours' en 'Terminée'
                        console.log('Recherche des réservations IN_PROGRESS à passer en COMPLETED...');
                        return [4 /*yield*/, this.reservationRepository.find({
                                where: {
                                    status: reservation_status_enum_1.ReservationStatus.IN_PROGRESS,
                                    endDate: typeorm_2.LessThanOrEqual(today.toDate())
                                },
                                relations: ['vehicle']
                            })];
                    case 6:
                        inProgressReservations = _b.sent();
                        console.log("Trouv\u00E9 " + inProgressReservations.length + " r\u00E9servations IN_PROGRESS \u00E0 traiter.");
                        _a = 0, inProgressReservations_1 = inProgressReservations;
                        _b.label = 7;
                    case 7:
                        if (!(_a < inProgressReservations_1.length)) return [3 /*break*/, 10];
                        reservation = inProgressReservations_1[_a];
                        console.log("Traitement r\u00E9servation " + reservation.id + " (IN_PROGRESS). EndDate: " + dayjs(reservation.endDate).format('YYYY-MM-DD'));
                        // ... (votre logique existante)
                        return [4 /*yield*/, this.updateReservationStatus(reservation.id, reservation_status_enum_1.ReservationStatus.COMPLETED)];
                    case 8:
                        // ... (votre logique existante)
                        _b.sent();
                        console.log("R\u00E9servation " + reservation.id + " pass\u00E9e \u00E0 'Termin\u00E9e'.");
                        _b.label = 9;
                    case 9:
                        _a++;
                        return [3 /*break*/, 7];
                    case 10:
                        console.log('*** FIN TACHE CRON ***');
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Récupère toutes les réservations avec les relations nécessaires.
     * @returns Une liste de réservations.
     */
    ReservationService.prototype.findAll = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.reservationRepository.find({
                        relations: [
                            'vehicle',
                            'pickupRegion',
                            'vehicle.type',
                            'vehicle.status',
                            'pickupRegion.prix',
                        ],
                        order: {
                            startDate: 'DESC'
                        }
                    })];
            });
        });
    };
    /**
     * Récupère une seule réservation par son ID.
     * @param id L'ID de la réservation.
     * @returns La réservation trouvée.
     * @throws NotFoundException Si la réservation n'est pas trouvée.
     */
    ReservationService.prototype.findOne = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var reservation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.reservationRepository.findOne({
                            where: { id: id },
                            relations: [
                                'vehicle',
                                'pickupRegion',
                                'vehicle.type',
                                'vehicle.status',
                                'pickupRegion.prix',
                            ]
                        })];
                    case 1:
                        reservation = _a.sent();
                        if (!reservation) {
                            throw new common_1.NotFoundException("R\u00E9servation avec l'ID " + id + " non trouv\u00E9e.");
                        }
                        return [2 /*return*/, reservation];
                }
            });
        });
    };
    /**
     * Met à jour une réservation existante.
     * Gère la mise à jour des dates, du prix, des informations du client et du statut.
     * @param id L'ID de la réservation à mettre à jour.
     * @param updateReservationDto Les données de mise à jour.
     * @returns La réservation mise à jour.
     */
    ReservationService.prototype.update = function (id, updateReservationDto) {
        return __awaiter(this, void 0, Promise, function () {
            var reservation, newStartDate, newEndDate, overlappingReservations, conflicts, numberOfDays, region, newStatusAsEnum, updatedReservation, notificationError_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        reservation = _a.sent();
                        if (!(updateReservationDto.startDate || updateReservationDto.endDate)) return [3 /*break*/, 3];
                        newStartDate = dayjs(updateReservationDto.startDate || reservation.startDate);
                        newEndDate = dayjs(updateReservationDto.endDate || reservation.endDate);
                        if (newStartDate.isAfter(newEndDate)) {
                            throw new common_1.BadRequestException('La date de fin doit être après la date de début pour la mise à jour.');
                        }
                        return [4 /*yield*/, this.reservationRepository.find({
                                where: {
                                    vehicle: { id: reservation.vehicle.id },
                                    startDate: typeorm_2.LessThanOrEqual(newEndDate.toDate()),
                                    endDate: typeorm_2.MoreThanOrEqual(newStartDate.toDate()),
                                    // Exclure les réservations annulées ou terminées si elles ne doivent pas être considérées comme des chevauchements
                                    status: typeorm_2.Not(typeorm_2.In([reservation_status_enum_1.ReservationStatus.CANCELLED, reservation_status_enum_1.ReservationStatus.COMPLETED]))
                                }
                            })];
                    case 2:
                        overlappingReservations = _a.sent();
                        conflicts = overlappingReservations.filter(function (res) { return res.id !== reservation.id; });
                        if (conflicts.length > 0) {
                            throw new common_1.BadRequestException('Le véhicule est déjà réservé pendant les dates demandées pour la mise à jour.');
                        }
                        numberOfDays = newEndDate.diff(newStartDate, 'day') + 1;
                        region = reservation.pickupRegion;
                        if (!region.prix || typeof region.prix.prix === 'undefined') {
                            throw new common_1.BadRequestException("Les informations de prix pour la r\u00E9gion '" + region.nom_region + "' sont manquantes pour la mise \u00E0 jour.");
                        }
                        reservation.totalPrice = Number(region.prix.prix) * numberOfDays;
                        reservation.startDate = newStartDate.toDate();
                        reservation.endDate = newEndDate.toDate();
                        _a.label = 3;
                    case 3:
                        // Met à jour les autres champs de la réservation
                        if (updateReservationDto.fullName)
                            reservation.fullName = updateReservationDto.fullName;
                        if (updateReservationDto.phone)
                            reservation.phone = updateReservationDto.phone;
                        if (updateReservationDto.email)
                            reservation.email = updateReservationDto.email;
                        // Si le statut est mis à jour, déléguer à updateReservationStatus pour une logique cohérente
                        if (updateReservationDto.status &&
                            reservation.status !== updateReservationDto.status) {
                            newStatusAsEnum = updateReservationDto.status;
                            // Utilisez this.updateReservationStatus pour gérer la logique de transition, notifications, etc.
                            // Important: cette méthode save et retourne déjà la réservation, donc pas besoin de la sauvegarder à nouveau ici
                            return [2 /*return*/, this.updateReservationStatus(id, newStatusAsEnum)];
                        }
                        return [4 /*yield*/, this.reservationRepository.save(reservation)];
                    case 4:
                        updatedReservation = _a.sent();
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, this.notificationService.createNotification({
                                type: 'reservation_mise_a_jour',
                                message: "La r\u00E9servation #" + updatedReservation.id + " a \u00E9t\u00E9 mise \u00E0 jour.",
                                payload: { reservationId: updatedReservation.id }
                            })];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        notificationError_3 = _a.sent();
                        console.error('Erreur lors de la création de la notification de mise à jour:', notificationError_3);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/, updatedReservation];
                }
            });
        });
    };
    /**
     * Supprime une réservation.
     * Si la réservation était 'À venir' ou 'En cours', le statut du véhicule redevient 'Disponible'.
     * Envoie une notification de suppression de réservation.
     * @param id L'ID de la réservation à supprimer.
     * @throws NotFoundException Si la réservation n'est pas trouvée.
     */
    ReservationService.prototype.remove = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var reservation, availableStatus, result, notificationError_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findOne(id)];
                    case 1:
                        reservation = _a.sent();
                        if (!(reservation.status === reservation_status_enum_1.ReservationStatus.UPCOMING ||
                            reservation.status === reservation_status_enum_1.ReservationStatus.IN_PROGRESS)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.statusRepository.findOne({
                                where: { status: 'Disponible' }
                            })];
                    case 2:
                        availableStatus = _a.sent();
                        if (!availableStatus) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.vehicleService.updateStatus(reservation.vehicle.id, availableStatus.id)];
                    case 3:
                        _a.sent();
                        console.log("Statut du v\u00E9hicule " + reservation.vehicle.id + " mis \u00E0 jour \u00E0 'Disponible' suite \u00E0 la suppression de r\u00E9servation.");
                        return [3 /*break*/, 5];
                    case 4:
                        console.warn("Statut 'Disponible' pour le véhicule non trouvé, impossible de mettre à jour le véhicule.");
                        _a.label = 5;
                    case 5: return [4 /*yield*/, this.reservationRepository["delete"](id)];
                    case 6:
                        result = _a.sent();
                        if (result.affected === 0) {
                            throw new common_1.NotFoundException("R\u00E9servation avec l'ID " + id + " non trouv\u00E9e.");
                        }
                        _a.label = 7;
                    case 7:
                        _a.trys.push([7, 9, , 10]);
                        return [4 /*yield*/, this.notificationService.createNotification({
                                type: 'reservation_supprimee',
                                message: "La r\u00E9servation #" + id + " du v\u00E9hicule " + reservation.vehicle.modele + " a \u00E9t\u00E9 supprim\u00E9e.",
                                payload: {
                                    reservationId: id,
                                    vehicleId: reservation.vehicle.id,
                                    clientName: reservation.fullName,
                                    clientEmail: reservation.email
                                }
                            })];
                    case 8:
                        _a.sent();
                        console.log("Notification cr\u00E9\u00E9e pour la suppression de la r\u00E9servation ID: " + id);
                        return [3 /*break*/, 10];
                    case 9:
                        notificationError_4 = _a.sent();
                        console.error('Erreur lors de la création de la notification de suppression:', notificationError_4);
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        schedule_1.Cron(schedule_1.CronExpression.EVERY_MINUTE) // S'exécute toutes les minutes
    ], ReservationService.prototype, "handleTestCron");
    __decorate([
        schedule_1.Cron(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT)
    ], ReservationService.prototype, "handleReservationStatusUpdates");
    ReservationService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(reservation_entity_1.Reservation)),
        __param(3, typeorm_1.InjectRepository(status_entity_1.Status))
    ], ReservationService);
    return ReservationService;
}());
exports.ReservationService = ReservationService;

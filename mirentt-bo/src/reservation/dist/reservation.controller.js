"use strict";
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
exports.ReservationController = void 0;
var common_1 = require("@nestjs/common");
var reservation_status_enum_1 = require("./Enum/reservation-status.enum");
var ReservationController = /** @class */ (function () {
    function ReservationController(reservationService) {
        this.reservationService = reservationService;
    }
    /**
     * Crée une nouvelle réservation.
     * @param createReservationDto Les données de la nouvelle réservation.
     * @returns La réservation créée.
     */
    ReservationController.prototype.create = function (createReservationDto) {
        return __awaiter(this, void 0, Promise, function () {
            var newReservation, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('DTO de réservation reçu et validé:', createReservationDto);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.reservationService.create(createReservationDto)];
                    case 2:
                        newReservation = _a.sent();
                        return [2 /*return*/, newReservation];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Erreur lors de la création de la réservation:', error_1.message, error_1.stack);
                        if (error_1 instanceof common_1.NotFoundException) {
                            throw new common_1.NotFoundException(error_1.message);
                        }
                        if (error_1 instanceof common_1.BadRequestException) {
                            throw new common_1.BadRequestException(error_1.message);
                        }
                        throw new common_1.InternalServerErrorException('Erreur interne du serveur lors de la création de la réservation.');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Récupère toutes les réservations.
     * @returns Une liste de réservations.
     */
    ReservationController.prototype.findAll = function () {
        return __awaiter(this, void 0, Promise, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.reservationService.findAll()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Erreur lors de la récupération de toutes les réservations:', error_2.message, error_2.stack);
                        throw new common_1.InternalServerErrorException('Erreur interne du serveur lors de la récupération des réservations.');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Récupère une seule réservation par son ID.
     * @param id L'ID de la réservation.
     * @returns La réservation trouvée.
     */
    ReservationController.prototype.findOne = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.reservationService.findOne(+id)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_3 = _a.sent();
                        console.error("Erreur lors de la r\u00E9cup\u00E9ration de la r\u00E9servation " + id + ":", error_3.message, error_3.stack);
                        if (error_3 instanceof common_1.NotFoundException) {
                            throw new common_1.NotFoundException(error_3.message);
                        }
                        throw new common_1.InternalServerErrorException("Erreur interne du serveur lors de la r\u00E9cup\u00E9ration de la r\u00E9servation avec l'ID " + id + ".");
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Met à jour le statut d'une réservation.
     * Utilise la nouvelle méthode centralisée du service.
     * @param id L'ID de la réservation.
     * @param status Le nouveau statut de la réservation (doit être un membre de ReservationStatus).
     * @returns La réservation mise à jour.
     */
    ReservationController.prototype.updateReservationStatus = function (id, status) {
        return __awaiter(this, void 0, Promise, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!Object.values(reservation_status_enum_1.ReservationStatus).includes(status)) {
                            throw new common_1.BadRequestException("Statut invalide. Le statut doit \u00EAtre l'une des valeurs suivantes : " + Object.values(reservation_status_enum_1.ReservationStatus).join(', '));
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.reservationService.updateReservationStatus(+id, status)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_4 = _a.sent();
                        console.error("Erreur lors de la mise \u00E0 jour du statut de la r\u00E9servation " + id + " vers " + status + ":", error_4.message, error_4.stack);
                        if (error_4 instanceof common_1.NotFoundException) {
                            throw new common_1.NotFoundException(error_4.message);
                        }
                        if (error_4 instanceof common_1.BadRequestException) {
                            throw new common_1.BadRequestException(error_4.message);
                        }
                        throw new common_1.InternalServerErrorException("Erreur interne du serveur lors de la mise \u00E0 jour du statut de la r\u00E9servation avec l'ID " + id + ".");
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Annule une réservation en mettant à jour son statut.
     * Utilise PATCH car c'est une modification partielle de la ressource.
     * @param id L'ID de la réservation à annuler.
     * @returns La réservation mise à jour (annulée).
     */
    ReservationController.prototype.cancelReservation = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.reservationService.cancelReservation(+id)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_5 = _a.sent();
                        console.error("Erreur lors de l'annulation de la r\u00E9servation " + id + ":", error_5.message, error_5.stack);
                        if (error_5 instanceof common_1.NotFoundException) {
                            throw new common_1.NotFoundException(error_5.message);
                        }
                        if (error_5 instanceof common_1.BadRequestException) {
                            throw new common_1.BadRequestException(error_5.message);
                        }
                        throw new common_1.InternalServerErrorException("Erreur interne du serveur lors de l'annulation de la r\u00E9servation avec l'ID " + id + ".");
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Met à jour partiellement une réservation existante.
     * @param id L'ID de la réservation.
     * @param updateReservationDto Les données de mise à jour.
     * @returns La réservation mise à jour.
     */
    ReservationController.prototype.update = function (id, updateReservationDto) {
        return this.reservationService.update(+id, updateReservationDto);
    };
    /**
     * Supprime une réservation.
     * @param id L'ID de la réservation à supprimer.
     */
    ReservationController.prototype.remove = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.reservationService.remove(+id)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        console.error("Erreur lors de la suppression de la r\u00E9servation " + id + ":", error_6.message, error_6.stack);
                        if (error_6 instanceof common_1.NotFoundException) {
                            throw new common_1.NotFoundException(error_6.message);
                        }
                        throw new common_1.InternalServerErrorException("Erreur interne du serveur lors de la suppression de la r\u00E9servation avec l'ID " + id + ".");
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        common_1.Post(),
        common_1.HttpCode(common_1.HttpStatus.CREATED),
        __param(0, common_1.Body())
    ], ReservationController.prototype, "create");
    __decorate([
        common_1.Get()
    ], ReservationController.prototype, "findAll");
    __decorate([
        common_1.Get(':id'),
        __param(0, common_1.Param('id'))
    ], ReservationController.prototype, "findOne");
    __decorate([
        common_1.Put(':id/status'),
        common_1.HttpCode(common_1.HttpStatus.OK),
        __param(0, common_1.Param('id')),
        __param(1, common_1.Body('status'))
    ], ReservationController.prototype, "updateReservationStatus");
    __decorate([
        common_1.Patch(':id/cancel') // CHANGEMENT: Utilisation de PATCH au lieu de DELETE
        ,
        common_1.HttpCode(common_1.HttpStatus.OK) // Retourne un code 200 OK pour la mise à jour
        ,
        __param(0, common_1.Param('id'))
    ], ReservationController.prototype, "cancelReservation");
    __decorate([
        common_1.Patch(':id'),
        common_1.UsePipes(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })),
        __param(0, common_1.Param('id')),
        __param(1, common_1.Body())
    ], ReservationController.prototype, "update");
    __decorate([
        common_1.Delete(':id'),
        common_1.HttpCode(common_1.HttpStatus.NO_CONTENT),
        __param(0, common_1.Param('id'))
    ], ReservationController.prototype, "remove");
    ReservationController = __decorate([
        common_1.Controller('reservations'),
        common_1.UsePipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true
        }))
    ], ReservationController);
    return ReservationController;
}());
exports.ReservationController = ReservationController;

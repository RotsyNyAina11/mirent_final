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
exports.ProformaService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var proforma_entity_1 = require("src/entities/proforma.entity");
var proformat_item_entity_1 = require("../entities/proformat-item.entity");
var vehicle_entity_1 = require("src/entities/vehicle.entity");
var region_entity_1 = require("src/entities/region.entity");
var prix_entity_1 = require("src/entities/prix.entity");
var status_entity_1 = require("src/entities/status.entity");
var ProformaService = /** @class */ (function () {
    function ProformaService(proformaRepository, proformaItemRepository, vehiculeRepository, regionRepository, prixRepository, statusRepository) {
        this.proformaRepository = proformaRepository;
        this.proformaItemRepository = proformaItemRepository;
        this.vehiculeRepository = vehiculeRepository;
        this.regionRepository = regionRepository;
        this.prixRepository = prixRepository;
        this.statusRepository = statusRepository;
    }
    ProformaService.prototype.generateProformaNumber = function () {
        return __awaiter(this, void 0, Promise, function () {
            var lastProforma, numero, lastNumberMatch, date, mois, annee;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.proformaRepository.find({
                            order: { id: 'DESC' },
                            take: 1
                        })];
                    case 1:
                        lastProforma = _a.sent();
                        numero = 1;
                        if (lastProforma.length > 0) {
                            lastNumberMatch = lastProforma[0].proformaNumber.match(/MRT (\d+)PROF/);
                            if (lastNumberMatch) {
                                numero = parseInt(lastNumberMatch[1], 10) + 1;
                            }
                        }
                        date = new Date();
                        mois = String(date.getMonth() + 1).padStart(2, '0');
                        annee = date.getFullYear();
                        return [2 /*return*/, "FACTURE PROFORMA N\u00B0 MRT " + String(numero).padStart(3, '0') + "PROF/" + mois + "/" + annee];
                }
            });
        });
    };
    ProformaService.prototype.create = function (proformaData) {
        return __awaiter(this, void 0, Promise, function () {
            var proforma, _a, proformaItems, _b, error_1;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 4, , 5]);
                        proforma = this.proformaRepository.create({
                            client: { id: proformaData.clientId },
                            date: proformaData.date,
                            notes: proformaData.notes
                        });
                        _a = proforma;
                        return [4 /*yield*/, this.generateProformaNumber()];
                    case 1:
                        _a.proformaNumber = _c.sent();
                        return [4 /*yield*/, Promise.all(proformaData.items.map(function (item) { return __awaiter(_this, void 0, void 0, function () {
                                var vehiculeExist, regionExist, prixExist, statusDisponible, vehiculeDejaLoue, dateDepart, dateRetour, dureeLocation, subTotal, proformaItem, statusIndisponible;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.vehiculeRepository.findOne({
                                                where: { id: Number(item.vehicleId) }
                                            })];
                                        case 1:
                                            vehiculeExist = _a.sent();
                                            if (!vehiculeExist)
                                                throw new common_1.NotFoundException("V\u00E9hicule ID " + item.vehicleId + " introuvable");
                                            return [4 /*yield*/, this.regionRepository.findOne({
                                                    where: { id: Number(item.regionId) }
                                                })];
                                        case 2:
                                            regionExist = _a.sent();
                                            if (!regionExist)
                                                throw new common_1.NotFoundException("R\u00E9gion ID " + item.regionId + " introuvable");
                                            return [4 /*yield*/, this.prixRepository.findOne({
                                                    where: { id: item.prixId }
                                                })];
                                        case 3:
                                            prixExist = _a.sent();
                                            if (!prixExist)
                                                throw new common_1.NotFoundException("Prix ID " + item.prixId + " introuvable");
                                            return [4 /*yield*/, this.statusRepository.findOne({
                                                    where: { status: 'Disponible' }
                                                })];
                                        case 4:
                                            statusDisponible = _a.sent();
                                            if (!statusDisponible)
                                                throw new common_1.NotFoundException("Statut 'Disponible' non trouv\u00E9");
                                            if (vehiculeExist.status.id !== statusDisponible.id) {
                                                throw new common_1.BadRequestException("Le v\u00E9hicule " + item.vehicleId + " n'est pas disponible");
                                            }
                                            return [4 /*yield*/, this.proformaItemRepository.findOne({
                                                    where: {
                                                        vehicle: { id: Number(item.vehicleId) },
                                                        dateDepart: new Date(item.dateDepart),
                                                        dateRetour: new Date(item.dateRetour)
                                                    }
                                                })];
                                        case 5:
                                            vehiculeDejaLoue = _a.sent();
                                            if (vehiculeDejaLoue) {
                                                throw new common_1.BadRequestException("Le v\u00E9hicule " + item.vehicleId + " est d\u00E9j\u00E0 lou\u00E9");
                                            }
                                            dateDepart = new Date(item.dateDepart);
                                            dateRetour = new Date(item.dateRetour);
                                            dureeLocation = Math.ceil((dateRetour.getTime() - dateDepart.getTime()) / (1000 * 3600 * 24));
                                            item.nombreJours = dureeLocation;
                                            subTotal = prixExist.prix * dureeLocation;
                                            item['subTotal'] = subTotal;
                                            proformaItem = this.proformaItemRepository.create({
                                                vehicle: { id: Number(item.vehicleId) },
                                                region: { id: Number(item.regionId) },
                                                prix: { id: Number(item.prixId) },
                                                dateDepart: dateDepart,
                                                dateRetour: dateRetour,
                                                nombreJours: dureeLocation,
                                                subTotal: subTotal
                                            });
                                            return [4 /*yield*/, this.statusRepository.findOne({
                                                    where: { status: 'Indisponible' }
                                                })];
                                        case 6:
                                            statusIndisponible = _a.sent();
                                            if (!statusIndisponible)
                                                throw new common_1.NotFoundException("Statut 'Indisponible' non trouv\u00E9");
                                            vehiculeExist.status = statusIndisponible;
                                            return [4 /*yield*/, this.vehiculeRepository.save(vehiculeExist)];
                                        case 7:
                                            _a.sent();
                                            return [2 /*return*/, proformaItem];
                                    }
                                });
                            }); }))];
                    case 2:
                        proformaItems = _c.sent();
                        _b = proforma;
                        return [4 /*yield*/, this.proformaItemRepository.save(proformaItems)];
                    case 3:
                        _b.items = _c.sent();
                        proforma.totalAmount = proforma.items.reduce(function (sum, item) { return sum + item.subTotal; }, 0);
                        return [2 /*return*/, this.proformaRepository.save(proforma)];
                    case 4:
                        error_1 = _c.sent();
                        throw new common_1.BadRequestException(error_1.message || 'Erreur lors de la création de la proforma');
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ProformaService.prototype.findOne = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var proforma;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.proformaRepository.findOne({
                            where: { id: id },
                            relations: [
                                'items',
                                'items.vehicle',
                                'items.region',
                                'items.prix',
                                'client',
                            ]
                        })];
                    case 1:
                        proforma = _a.sent();
                        if (!proforma)
                            throw new common_1.NotFoundException("Proforma ID " + id + " introuvable");
                        return [2 /*return*/, proforma];
                }
            });
        });
    };
    ProformaService.prototype.findAll = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.proformaRepository.find()];
            });
        });
    };
    ProformaService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(proforma_entity_1.Proforma)),
        __param(1, typeorm_1.InjectRepository(proformat_item_entity_1.ProformaItem)),
        __param(2, typeorm_1.InjectRepository(vehicle_entity_1.Vehicule)),
        __param(3, typeorm_1.InjectRepository(region_entity_1.Region)),
        __param(4, typeorm_1.InjectRepository(prix_entity_1.Prix)),
        __param(5, typeorm_1.InjectRepository(status_entity_1.Status))
    ], ProformaService);
    return ProformaService;
}());
exports.ProformaService = ProformaService;

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
exports.DevisService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var devis_entity_1 = require("src/entities/devis.entity");
var client_entity_1 = require("src/entities/client.entity");
var region_entity_1 = require("src/entities/region.entity");
var devis_item_entity_1 = require("src/entities/devis-item.entity");
var vehicle_entity_1 = require("src/entities/vehicle.entity");
var DevisService = /** @class */ (function () {
    function DevisService(devisRepository, clientRepository, regionRepository, vehicleRepository, devisItemRepository) {
        this.devisRepository = devisRepository;
        this.clientRepository = clientRepository;
        this.regionRepository = regionRepository;
        this.vehicleRepository = vehicleRepository;
        this.devisItemRepository = devisItemRepository;
    }
    DevisService.prototype.create = function (createDevisDto) {
        return __awaiter(this, void 0, Promise, function () {
            var client, devis, _a, _b, _c, vehicule, _i, _d, itemDto, region, prixExiste, devisItem;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.clientRepository.findOne({
                            where: { id: Number(createDevisDto.clientName) }
                        })];
                    case 1:
                        client = _e.sent();
                        if (!client) {
                            throw new common_1.NotFoundException('Client non trouvé.');
                        }
                        _b = (_a = this.devisRepository).create;
                        _c = {};
                        return [4 /*yield*/, this.generateDevisNumber()];
                    case 2:
                        devis = _b.apply(_a, [(_c.numeroDevis = _e.sent(),
                                _c.client = client,
                                _c.remarque = createDevisDto.remarque,
                                _c.dateCreation = createDevisDto.dateCreation,
                                _c.prixCarburant = createDevisDto.prixCarburant,
                                _c.prixTotal = 0,
                                _c.items = [],
                                _c)]);
                        return [4 /*yield*/, this.vehicleRepository.findOne({
                                where: {}
                            })];
                    case 3:
                        vehicule = _e.sent();
                        _i = 0, _d = createDevisDto.items;
                        _e.label = 4;
                    case 4:
                        if (!(_i < _d.length)) return [3 /*break*/, 7];
                        itemDto = _d[_i];
                        return [4 /*yield*/, this.regionRepository.findOne({
                                where: { id: itemDto.regionId },
                                relations: ['prix']
                            })];
                    case 5:
                        region = _e.sent();
                        if (!region) {
                            throw new common_1.NotFoundException('Région non trouvée.');
                        }
                        if (!region.prix) {
                            throw new common_1.NotFoundException('Prix non trouvé pour cette région.');
                        }
                        prixExiste = region.prix;
                        devisItem = this.devisItemRepository.create(__assign(__assign({}, itemDto), { region: region,
                            devis: devis }));
                        devis.items.push(devisItem);
                        _e.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7: return [2 /*return*/, this.devisRepository.save(devis)];
                }
            });
        });
    };
    DevisService.prototype.generateDevisNumber = function () {
        return __awaiter(this, void 0, Promise, function () {
            var lastDevis, numero, match, date, mois, annee;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.devisRepository.find({
                            order: { id: 'DESC' },
                            take: 1
                        })];
                    case 1:
                        lastDevis = _a.sent();
                        numero = 1;
                        if (lastDevis.length > 0) {
                            match = lastDevis[0].numeroDevis.match(/MRT (\d+)DEV/);
                            if (match) {
                                numero = parseInt(match[1], 10) + 1;
                            }
                        }
                        date = new Date();
                        mois = String(date.getMonth() + 1).padStart(2, '0');
                        annee = date.getFullYear();
                        return [2 /*return*/, "DEVIS N\u00B0 MRT " + String(numero).padStart(3, '0') + "DEV/" + mois + "/" + annee];
                }
            });
        });
    };
    DevisService.prototype.findAll = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.devisRepository.find({
                        relations: [
                            'client',
                            'items',
                            'items.region',
                            'items.prix',
                            'items.vehicule',
                        ]
                    })];
            });
        });
    };
    DevisService.prototype.findOne = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var devis;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.devisRepository.findOne({
                            where: { id: id },
                            relations: [
                                'client',
                                'items',
                                'items.region',
                                'items.prix',
                                'items.vehicule',
                            ]
                        })];
                    case 1:
                        devis = _a.sent();
                        if (!devis) {
                            throw new common_1.NotFoundException('Devis non trouvé.');
                        }
                        return [2 /*return*/, devis];
                }
            });
        });
    };
    DevisService.prototype.update = function (id, updateDevisDto) {
        return __awaiter(this, void 0, Promise, function () {
            var devis;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.devisRepository.findOne({ where: { id: id } })];
                    case 1:
                        devis = _a.sent();
                        if (!devis) {
                            throw new common_1.NotFoundException('Devis non trouvé.');
                        }
                        Object.assign(devis, updateDevisDto);
                        return [2 /*return*/, this.devisRepository.save(devis)];
                }
            });
        });
    };
    DevisService.prototype.remove = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var devis;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.devisRepository.findOne({ where: { id: id } })];
                    case 1:
                        devis = _a.sent();
                        if (!devis) {
                            throw new common_1.NotFoundException('Devis non trouvé.');
                        }
                        return [4 /*yield*/, this.devisRepository.remove(devis)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DevisService.prototype["delete"] = function () {
        return __awaiter(this, void 0, Promise, function () {
            var devis;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.devisRepository.find()];
                    case 1:
                        devis = _a.sent();
                        if (devis.length === 0) {
                            throw new common_1.NotFoundException('Aucun devis trouvé.');
                        }
                        return [4 /*yield*/, this.devisRepository.remove(devis)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DevisService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(devis_entity_1.Devis)),
        __param(1, typeorm_1.InjectRepository(client_entity_1.Client)),
        __param(2, typeorm_1.InjectRepository(region_entity_1.Region)),
        __param(3, typeorm_1.InjectRepository(vehicle_entity_1.Vehicule)),
        __param(4, typeorm_1.InjectRepository(devis_item_entity_1.DevisItem))
    ], DevisService);
    return DevisService;
}());
exports.DevisService = DevisService;

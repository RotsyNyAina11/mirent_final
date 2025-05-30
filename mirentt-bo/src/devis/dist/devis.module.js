"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DevisModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var devis_entity_1 = require("../entities/devis.entity");
var client_entity_1 = require("src/entities/client.entity"); // <-- ajouté
var devis_controller_1 = require("./devis.controller");
var devis_service_1 = require("./devis.service");
var client_module_1 = require("src/client/client.module");
var vehicle_entity_1 = require("src/entities/vehicle.entity");
var region_entity_1 = require("src/entities/region.entity");
var prix_entity_1 = require("src/entities/prix.entity");
var devis_item_entity_1 = require("src/entities/devis-item.entity");
var DevisModule = /** @class */ (function () {
    function DevisModule() {
    }
    DevisModule = __decorate([
        common_1.Module({
            imports: [
                typeorm_1.TypeOrmModule.forFeature([
                    devis_entity_1.Devis,
                    client_entity_1.Client,
                    vehicle_entity_1.Vehicule,
                    region_entity_1.Region,
                    prix_entity_1.Prix,
                    devis_item_entity_1.DevisItem,
                ]),
                client_module_1.ClientModule,
            ],
            controllers: [devis_controller_1.DevisController],
            providers: [devis_service_1.DevisService],
            exports: [devis_service_1.DevisService]
        })
    ], DevisModule);
    return DevisModule;
}());
exports.DevisModule = DevisModule;

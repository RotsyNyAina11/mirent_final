"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ReservationModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var reservation_service_1 = require("./reservation.service");
var reservation_controller_1 = require("./reservation.controller");
var reservation_entity_1 = require("../entities/reservation.entity");
var vehicles_module_1 = require("../vehicles/vehicles.module");
var regions_module_1 = require("../regions/regions.module");
var prixs_module_1 = require("src/prixs/prixs.module");
var status_module_1 = require("src/status/status.module");
var status_entity_1 = require("src/entities/status.entity");
var notifications_module_1 = require("src/notifications/notifications.module");
var ReservationModule = /** @class */ (function () {
    function ReservationModule() {
    }
    ReservationModule = __decorate([
        common_1.Module({
            imports: [
                typeorm_1.TypeOrmModule.forFeature([reservation_entity_1.Reservation, status_entity_1.Status]),
                vehicles_module_1.VehiclesModule,
                regions_module_1.RegionsModule,
                prixs_module_1.PrixsModule,
                status_module_1.StatusModule,
                notifications_module_1.NotificationsModule,
            ],
            controllers: [reservation_controller_1.ReservationController],
            providers: [reservation_service_1.ReservationService]
        })
    ], ReservationModule);
    return ReservationModule;
}());
exports.ReservationModule = ReservationModule;

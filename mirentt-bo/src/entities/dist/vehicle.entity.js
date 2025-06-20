"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Vehicule = void 0;
var typeorm_1 = require("typeorm");
var type_entity_1 = require("./type.entity");
var status_entity_1 = require("./status.entity");
var reservation_entity_1 = require("./reservation.entity");
var Vehicule = /** @class */ (function () {
    function Vehicule() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], Vehicule.prototype, "id");
    __decorate([
        typeorm_1.Column({ nullable: false })
    ], Vehicule.prototype, "nom");
    __decorate([
        typeorm_1.Column({ nullable: false })
    ], Vehicule.prototype, "marque");
    __decorate([
        typeorm_1.Column({ nullable: false })
    ], Vehicule.prototype, "modele");
    __decorate([
        typeorm_1.Column({ nullable: false, unique: true })
    ], Vehicule.prototype, "immatriculation");
    __decorate([
        typeorm_1.Column()
    ], Vehicule.prototype, "nombrePlace");
    __decorate([
        typeorm_1.ManyToOne(function () { return type_entity_1.Type; }, function (type) { return type.vehicules; }, { eager: true })
    ], Vehicule.prototype, "type");
    __decorate([
        typeorm_1.ManyToOne(function () { return status_entity_1.Status; }, function (status) { return status.vehicules; }, { eager: true })
    ], Vehicule.prototype, "status");
    __decorate([
        typeorm_1.Column({ type: 'varchar', nullable: true })
    ], Vehicule.prototype, "imageUrl");
    __decorate([
        typeorm_1.OneToMany(function () { return reservation_entity_1.Reservation; }, function (reservation) { return reservation.vehicle; })
    ], Vehicule.prototype, "reservations");
    Vehicule = __decorate([
        typeorm_1.Entity()
    ], Vehicule);
    return Vehicule;
}());
exports.Vehicule = Vehicule;

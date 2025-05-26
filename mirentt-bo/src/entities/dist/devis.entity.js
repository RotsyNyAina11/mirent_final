"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Devis = void 0;
var typeorm_1 = require("typeorm");
var client_entity_1 = require("./client.entity");
// import { User } from './user.entity';
var devis_item_entity_1 = require("./devis-item.entity");
var Devis = /** @class */ (function () {
    function Devis() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], Devis.prototype, "id");
    __decorate([
        typeorm_1.Column()
    ], Devis.prototype, "dateCreation");
    __decorate([
        typeorm_1.Column({ unique: true })
    ], Devis.prototype, "numeroDevis");
    __decorate([
        typeorm_1.ManyToOne(function () { return client_entity_1.Client; }, function (client) { return client.devis; }, { nullable: true })
    ], Devis.prototype, "client");
    __decorate([
        typeorm_1.OneToMany(function () { return devis_item_entity_1.DevisItem; }, function (item) { return item.devis; }, { cascade: true })
    ], Devis.prototype, "items");
    __decorate([
        typeorm_1.Column('decimal', { precision: 10, scale: 2, nullable: true })
    ], Devis.prototype, "prixCarburant");
    __decorate([
        typeorm_1.Column('decimal', { precision: 10, scale: 2 })
    ], Devis.prototype, "prixTotal");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], Devis.prototype, "totalEnLettre");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], Devis.prototype, "signatureClient");
    __decorate([
        typeorm_1.CreateDateColumn()
    ], Devis.prototype, "createdAt");
    __decorate([
        typeorm_1.UpdateDateColumn()
    ], Devis.prototype, "updatedAt");
    Devis = __decorate([
        typeorm_1.Entity()
    ], Devis);
    return Devis;
}());
exports.Devis = Devis;

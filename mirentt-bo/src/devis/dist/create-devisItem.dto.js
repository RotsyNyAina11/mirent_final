"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CreateDevisDto = exports.CreateDevisItemDto = void 0;
var class_validator_1 = require("class-validator");
var CreateDevisItemDto = /** @class */ (function () {
    function CreateDevisItemDto() {
    }
    __decorate([
        class_validator_1.IsInt()
    ], CreateDevisItemDto.prototype, "devisId");
    __decorate([
        class_validator_1.IsInt(),
        class_validator_1.IsPositive(),
        class_validator_1.IsNumber()
    ], CreateDevisItemDto.prototype, "vehicleId");
    __decorate([
        class_validator_1.IsInt(),
        class_validator_1.IsPositive(),
        class_validator_1.IsNumber()
    ], CreateDevisItemDto.prototype, "regionId");
    __decorate([
        class_validator_1.IsInt()
    ], CreateDevisItemDto.prototype, "prixId");
    __decorate([
        class_validator_1.IsDateString()
    ], CreateDevisItemDto.prototype, "dateDebut");
    __decorate([
        class_validator_1.IsDateString()
    ], CreateDevisItemDto.prototype, "dateFin");
    __decorate([
        class_validator_1.IsInt(),
        class_validator_1.IsPositive()
    ], CreateDevisItemDto.prototype, "nombreJours");
    __decorate([
        class_validator_1.IsNumber(),
        class_validator_1.IsPositive()
    ], CreateDevisItemDto.prototype, "prixUnitaire");
    __decorate([
        class_validator_1.IsNumber(),
        class_validator_1.IsPositive()
    ], CreateDevisItemDto.prototype, "sousTotal");
    return CreateDevisItemDto;
}());
exports.CreateDevisItemDto = CreateDevisItemDto;
var CreateDevisDto = /** @class */ (function () {
    function CreateDevisDto() {
    }
    return CreateDevisDto;
}());
exports.CreateDevisDto = CreateDevisDto;

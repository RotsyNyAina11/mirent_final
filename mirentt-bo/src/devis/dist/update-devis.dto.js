"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UpdateDevisDto = exports.UpdateDevisItemDto = void 0;
var class_validator_1 = require("class-validator");
var UpdateDevisItemDto = /** @class */ (function () {
    function UpdateDevisItemDto() {
    }
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsNumber()
    ], UpdateDevisItemDto.prototype, "vehiculeId");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsDateString()
    ], UpdateDevisItemDto.prototype, "dateDebut");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsDateString()
    ], UpdateDevisItemDto.prototype, "dateFin");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsNumber()
    ], UpdateDevisItemDto.prototype, "prixUnitaire");
    return UpdateDevisItemDto;
}());
exports.UpdateDevisItemDto = UpdateDevisItemDto;
var UpdateDevisDto = /** @class */ (function () {
    function UpdateDevisDto() {
    }
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsNumber()
    ], UpdateDevisDto.prototype, "clientId");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsArray()
    ], UpdateDevisDto.prototype, "items");
    __decorate([
        class_validator_1.IsOptional()
    ], UpdateDevisDto.prototype, "remarque");
    return UpdateDevisDto;
}());
exports.UpdateDevisDto = UpdateDevisDto;

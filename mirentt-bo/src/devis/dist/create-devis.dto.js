"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CreateDevisDto = exports.CreateDevisItemDto = void 0;
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var CreateDevisItemDto = /** @class */ (function () {
    function CreateDevisItemDto() {
    }
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], CreateDevisItemDto.prototype, "clientName");
    __decorate([
        class_validator_1.IsNotEmpty(),
        class_transformer_1.Transform(function (_a) {
            var value = _a.value;
            return new Date(value);
        }),
        class_validator_1.IsDate()
    ], CreateDevisItemDto.prototype, "dateCreation");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], CreateDevisItemDto.prototype, "numeroDevis");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsNumber(),
        class_validator_1.IsNotEmpty()
    ], CreateDevisItemDto.prototype, "prixCarburant");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsNumber()
    ], CreateDevisItemDto.prototype, "prixTotal");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], CreateDevisItemDto.prototype, "totalEnLettre");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], CreateDevisItemDto.prototype, "signatureClient");
    return CreateDevisItemDto;
}());
exports.CreateDevisItemDto = CreateDevisItemDto;
var CreateDevisDto = /** @class */ (function () {
    function CreateDevisDto() {
    }
    __decorate([
        class_validator_1.IsNotEmpty()
    ], CreateDevisDto.prototype, "clientId");
    __decorate([
        class_validator_1.IsArray(),
        class_validator_1.IsNotEmpty({ each: true })
    ], CreateDevisDto.prototype, "items");
    return CreateDevisDto;
}());
exports.CreateDevisDto = CreateDevisDto;

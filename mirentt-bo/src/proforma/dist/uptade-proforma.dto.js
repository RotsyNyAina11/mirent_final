"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UpdateProformaDto = void 0;
var class_validator_1 = require("class-validator");
var proforma_entity_1 = require("src/entities/proforma.entity");
var UpdateProformaDto = /** @class */ (function () {
    function UpdateProformaDto() {
    }
    __decorate([
        class_validator_1.IsNumber(),
        class_validator_1.IsOptional()
    ], UpdateProformaDto.prototype, "totalAmount");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsEnum(proforma_entity_1.ProformaStatus) // Si tu veux gérer les statuts avec un enum
    ], UpdateProformaDto.prototype, "status");
    __decorate([
        class_validator_1.IsString(),
        class_validator_1.IsOptional()
    ], UpdateProformaDto.prototype, "contractReference");
    __decorate([
        class_validator_1.IsString(),
        class_validator_1.IsOptional()
    ], UpdateProformaDto.prototype, "notes");
    __decorate([
        class_validator_1.IsString(),
        class_validator_1.IsOptional()
    ], UpdateProformaDto.prototype, "updatedAt");
    return UpdateProformaDto;
}());
exports.UpdateProformaDto = UpdateProformaDto;

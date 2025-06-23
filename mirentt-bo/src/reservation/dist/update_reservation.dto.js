"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UpdateReservationDto = void 0;
// src/reservation/update_reservation.dto.ts
var class_validator_1 = require("class-validator");
var UpdateReservationDto = /** @class */ (function () {
    function UpdateReservationDto() {
    }
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsDateString()
    ], UpdateReservationDto.prototype, "startDate");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsDateString()
    ], UpdateReservationDto.prototype, "endDate");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], UpdateReservationDto.prototype, "fullName");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsPhoneNumber('MG') // Valider pour Madagascar si applicable
    ], UpdateReservationDto.prototype, "phone");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsEmail()
    ], UpdateReservationDto.prototype, "email");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], UpdateReservationDto.prototype, "status");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], UpdateReservationDto.prototype, "regionName");
    return UpdateReservationDto;
}());
exports.UpdateReservationDto = UpdateReservationDto;

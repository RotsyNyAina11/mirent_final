// src/reservation/update_reservation.dto.ts
import {
  IsDateString,
  IsString,
  IsPhoneNumber,
  IsEmail,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { ReservationStatus } from './Enum/reservation-status.enum';

export class UpdateReservationDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsPhoneNumber('MG') // Valider pour Madagascar si applicable
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  // Vous ne devriez pas laisser le frontend modifier le totalPrice ou le statut directement
  // @IsOptional()
  // @IsNumber()
  // totalPrice?: number;

  @IsOptional()
  @IsString()
  status?: ReservationStatus; // Le statut devrait être géré par des actions spécifiques (cancel, complete)

  // vehicleId et pickupRegionId ne devraient pas être modifiables après la création
  // @IsOptional()
  // @IsNumber()
  // vehicleId?: number;

  @IsOptional()
  @IsString()
  regionName?: string;
}

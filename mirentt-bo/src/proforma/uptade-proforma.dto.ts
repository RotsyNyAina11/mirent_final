import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProformaItemDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  proformaId?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  vehicleId?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  regionId?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  prixId?: number;

  @IsOptional()
  @IsDateString()
  dateDepart?: Date;

  @IsOptional()
  @IsDateString()
  dateRetour?: Date;

  @IsOptional()
  @IsInt()
  nombreJours?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  subTotal?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  totalAmount?: number;
}

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
  @Type(() => Date) // Ajoutez Type pour la transformation correcte de la chaîne en Date
  dateDepart?: Date;

  @IsOptional()
  @IsDateString()
  @Type(() => Date) // Ajoutez Type pour la transformation correcte de la chaîne en Date
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

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  carburant?: number; // Ajout du champ carburant
}

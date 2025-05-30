import { Transform } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class VehicleCriteria {
  @IsOptional()
  @IsString()
  marque?: string;

  @IsOptional()
  @IsString()
  modele?: string;

  @IsOptional()
  @IsString()
  type?: string;
}

export class CreateDevisItemDto {
  @IsNotEmpty()
  vehicleCriteria: VehicleCriteria;

  @IsNotEmpty()
  @IsString()
  regionNom: string;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  dateDebut: Date;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  dateFin: Date;
}

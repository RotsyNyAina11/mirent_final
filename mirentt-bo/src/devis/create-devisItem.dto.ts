import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class CreateDevisItemDto {
  @IsInt()
  devisId: number;

  @IsInt()
  @IsPositive()
  @IsNumber()
  vehicleId: number;

  @IsInt()
  @IsPositive()
  @IsNumber()
  regionId: number;

  @IsInt()
  prixId: number;

  @IsDateString()
  dateDebut: Date;

  @IsDateString()
  dateFin: Date;

  @IsInt()
  @IsPositive()
  nombreJours: number;

  @IsNumber()
  @IsPositive()
  prixUnitaire: number;

  @IsNumber()
  @IsPositive()
  sousTotal: number;
}
export class CreateDevisDto {
  clientId: number;
  items: CreateDevisItemDto[];
}

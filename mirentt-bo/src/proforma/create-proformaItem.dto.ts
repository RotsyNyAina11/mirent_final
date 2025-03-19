import { IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class CreateProformaItemDto {
  @IsString()
  proformaNumber: string;

  @IsString()
  clientId: string;

  @IsString()
  vehicleId: string;

  @IsString()
  regionId: string;

  @IsDateString()
  dateDepart: string;

  @IsDateString()
  dateRetour: string;

  @IsNumber()
  nombreJours: number;

  @IsString()
  carburant: string;

  @IsNumber()
  prixId: number;

  @IsNumber()
  totalAmount: number;
}

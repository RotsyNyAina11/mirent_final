// dto/create-proforma-item.dto.ts
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProformaItemDto {
  @IsNotEmpty()
  @IsNumber()
  vehicleId: number;

  @IsNotEmpty()
  @IsNumber()
  regionId: number;

  @IsNotEmpty()
  @IsNumber()
  prixId: number;

  @IsNotEmpty()
  dateDepart: Date;

  @IsNotEmpty()
  dateRetour: Date;

  @IsNotEmpty()
  @IsNumber()
  nombreJours: number;

  @IsNotEmpty()
  @IsNumber()
  subTotal: number;
}
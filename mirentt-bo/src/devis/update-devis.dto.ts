import { IsDateString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class UpdateDevisItemDto {
  @IsOptional()
  @IsNumber()
  vehiculeId?: number;

  @IsOptional()
  @IsDateString()
  dateDebut?: string;

  @IsOptional()
  @IsDateString()
  dateFin?: string;

  @IsOptional()
  @IsNumber()
  prixUnitaire?: number;
}

export class UpdateDevisDto {
  @IsOptional()
  @IsNumber()
  clientId?: number;

  @IsOptional()
  @IsArray()
  items?: UpdateDevisItemDto[];

  @IsOptional()
  remarque?: string;
}

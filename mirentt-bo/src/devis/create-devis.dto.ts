import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  IsString,
  IsDate,
} from 'class-validator';

export class CreateDevisItemDto {
  @IsOptional()
  @IsString()
  clientName: string;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  dateCreation: Date;

  @IsOptional()
  @IsString()
  numeroDevis: string;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  prixCarburant: number;

  @IsOptional()
  @IsNumber()
  prixTotal: number;

  @IsOptional()
  @IsString()
  totalEnLettre: string;

  @IsOptional()
  @IsString()
  signatureClient: string;
}

export class CreateDevisDto {
  @IsNotEmpty()
  clientId: number;

  @IsArray()
  @IsNotEmpty({ each: true })
  items: CreateDevisItemDto[];
}

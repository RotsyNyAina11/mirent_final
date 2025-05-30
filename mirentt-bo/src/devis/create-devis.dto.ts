import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  IsString,
  IsDate,
  ArrayNotEmpty,
  ValidateNested,
  IsInt,
} from 'class-validator';

export class CreateDevisItemDto {
  @IsOptional()
  @IsString()
  clientName: string;

  @IsInt()
  @IsNotEmpty()
  regionId: number;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  dateCreation: Date;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  prixCarburant: number;

  @IsNotEmpty()
  @IsString()
  remarque?: string;

  @ArrayNotEmpty()
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => CreateDevisItemDto)
  items: CreateDevisItemDto[];
}

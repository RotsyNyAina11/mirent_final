import { IsNumber, IsOptional } from 'class-validator';

export class CreatePrixDto {
  @IsNumber()
  region_id: number;

  @IsOptional()
  @IsNumber()
  district_id?: number;

  @IsNumber()
  prix_location: number;
}
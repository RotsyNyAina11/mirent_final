import { IsString, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PrixDto {
  @IsNumber()
  prix_location: number;
}

class DistrictDto {
  @IsOptional()
  @IsString()
  nom_district?: string;
}

export class CreateRegionFullDto {
  @IsString()
  nom_region: string;

  @ValidateNested()
  @Type(() => PrixDto)
  prix: PrixDto;

  @ValidateNested()
  @Type(() => DistrictDto)
  district?: DistrictDto;
}
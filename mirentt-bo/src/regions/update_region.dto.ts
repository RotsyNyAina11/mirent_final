import { IsString, IsNumber, IsOptional, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

class PrixDto {
  @IsOptional()
  @IsNumber()
  prix_location?: number;
}

class DistrictDto {
  @IsOptional()
  @IsString()
  nom_district?: string;
}

export class UpdateRegionFullDto {
  @IsOptional()
  @IsString()
  nom_region?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PrixDto)
  prix?: PrixDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DistrictDto)
  district?: DistrictDto;

  @IsOptional()
  @IsBoolean()
  deleteDistrict?: boolean;
}
import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { ProformaStatus } from 'src/entities/proforma.entity';

export class UpdateProformaDto {
  @IsNumber()
  @IsOptional()
  totalAmount?: number;

  @IsOptional()
  @IsEnum(ProformaStatus) // Si tu veux gérer les statuts avec un enum
  status?: ProformaStatus;

  @IsString()
  @IsOptional()
  contractReference?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  updatedAt?: string; // Cette date sera mise à jour côté backend
}

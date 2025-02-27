import { IsString, IsOptional, IsInt, IsNotEmpty } from 'class-validator';

export class UpdateVehiculeDto {
  @IsOptional()  
  @IsString()
  @IsNotEmpty()
  nom?: string;

  @IsOptional() 
  @IsString()
  @IsNotEmpty()
  marque?: string;

  @IsOptional()  
  @IsString()
  @IsNotEmpty()
  modele?: string;

  @IsOptional()  
  @IsString()
  @IsNotEmpty()
  immatriculation?: string;

  @IsOptional() 
  @IsInt()
  nombrePlace?: number;

  @IsOptional()  
  @IsString()
  imageUrl?: string;

  @IsOptional()  
  @IsInt()
  @IsNotEmpty()
  typeId?: number;

  @IsOptional()  
  @IsInt()
  @IsNotEmpty()
  statusId?: number;
}
export default UpdateVehiculeDto;

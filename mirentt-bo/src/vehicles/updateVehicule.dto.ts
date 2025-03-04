import { Transform, TransformFnParams } from 'class-transformer';
import { IsString, IsOptional, IsInt, IsNotEmpty } from 'class-validator';

export class UpdateVehiculeDto {
  @IsOptional()  
  @IsString()
  nom?: string;

  @IsOptional() 
  @IsString()
  marque?: string;

  @IsOptional()  
  @IsString()
  modele?: string;

  @IsOptional()  
  @IsString()
  immatriculation?: string;

  @IsOptional() 
  @IsInt()
  @Transform(({ value }: TransformFnParams) => parseInt(value))
  nombrePlace?: number;

  @IsOptional()  
  @IsString()
  imageUrl?: string;

  @IsOptional()  
  @IsInt()
  @Transform(({ value }: TransformFnParams) => parseInt(value))
  typeId?: number;

  @IsOptional()  
  @IsInt()
  @Transform(({ value }: TransformFnParams) => parseInt(value))
  statusId?: number;
}
export default UpdateVehiculeDto;

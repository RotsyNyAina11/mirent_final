import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';


export class CreateVehiculeDto {
    @IsNotEmpty()
    @IsString()
    nom: string;
  
    @IsNotEmpty()
    @IsString()
    marque: string;
  
    @IsNotEmpty()
    @IsString()
    modele: string;
  
    @IsNotEmpty()
    @IsString()
    immatriculation: string;
  
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    nombrePlace: number;

    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    typeId: number;
  
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    statusId: number;

    @IsOptional()
    @IsString()
    imageUrl?: string;
  }
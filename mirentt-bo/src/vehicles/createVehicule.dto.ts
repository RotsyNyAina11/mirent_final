import { IsNotEmpty, IsNumber, IsString } from 'class-validator';


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
    @IsNumber()
    nombre_de_places: number;

    @IsNotEmpty()
    @IsNumber()
    typeId: number;
  
    @IsNotEmpty()
    @IsNumber()
    statusId: number;
  }
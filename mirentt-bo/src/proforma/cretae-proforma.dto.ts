import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateProformaItemDto } from './create-proformaItem.dto';


export class CreateProformaDto {
    @IsNotEmpty()
    @IsNumber()
    clientId: number;

    @IsOptional()
    @IsString()
    contractReference?: string; 

    @IsNotEmpty()
    date: Date;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsNotEmpty()
    items: CreateProformaItemDto[];
}
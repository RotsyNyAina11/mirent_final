import {
  IsDateString,
  IsNotEmpty,
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsNumber,
} from 'class-validator';

export class CreateReservationDto {
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  vehicleId: number;

  @IsString()
  @IsNotEmpty()
  regionName: string;

  @IsNumber()
  @IsNotEmpty()
  totalPrice: number;

  @IsString()
  @IsNotEmpty()
  clientId: string;
}

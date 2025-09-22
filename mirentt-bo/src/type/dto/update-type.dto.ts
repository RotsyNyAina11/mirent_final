import { IsOptional, IsString } from 'class-validator';

export class UpdateTypeDto {
  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

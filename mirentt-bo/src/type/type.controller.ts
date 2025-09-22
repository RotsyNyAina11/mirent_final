import { Body, Controller, Delete, Get, Param, Put, Post } from '@nestjs/common';
import { TypeService } from './type.service';
import { Type } from 'src/entities/type.entity';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';

@Controller('type')
export class TypeController {
  constructor(private readonly typesService: TypeService) {}

  @Get()
  async findAll(): Promise<Type[]> {
    return this.typesService.findAll();
  }

  @Post()
  async createType(@Body() dto: CreateTypeDto): Promise<Type> {
    return this.typesService.create(dto);
  }

  @Delete(':id')
  async deleteType(@Param('id') id: number): Promise<void> {
    return this.typesService.delete(id);
  }

  @Put(':id')
  async updateType(
    @Param('id') id: number,
    @Body() dto: UpdateTypeDto
  ): Promise<Type> {
    return this.typesService.update(id, dto);
  }

}

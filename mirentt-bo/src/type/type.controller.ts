import { Controller, Get } from '@nestjs/common';
import { TypeService } from './type.service';
import { Type } from 'src/entities/type.entity';

@Controller('type')
export class TypeController {
    constructor(
        private readonly typesService: TypeService
    ){}

    @Get()
    async findAll(): Promise<Type[]>{
        return this.typesService.findAll();
    }
}

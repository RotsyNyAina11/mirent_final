import { Body, Controller, Get, Param, ParseIntPipe, Post, Res, StreamableFile } from '@nestjs/common';
import { ProformaService } from './proforma.service';
import { Proforma } from 'src/entities/proforma.entity';

@Controller('proforma')
export class ProformaController {
    constructor(
        private readonly proformaService: ProformaService
    ){}

    @Post()
    create(@Body() createProformaDto: any) {
      return this.proformaService.create(createProformaDto);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.proformaService.findOne(id);
    }

    @Get()
    async findAll(): Promise<Proforma[]>{
        return this.proformaService.findAll();
    }


}

import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, Res, StreamableFile, ValidationPipe } from '@nestjs/common';
import { Response } from 'express';
import { ProformaService } from './proforma.service';
import { Proforma } from 'src/entities/proforma.entity';
import { CreateProformaByCriteriaDto } from './create-proforma.dto';
import { FindAvailableVehiclesDto } from 'src/dto/find-available-vehicles.dto';
import { UpdateProformaStatusDto } from 'src/dto/update-proforma-status.dto';

@Controller('proforma')
export class ProformaController {
    constructor(
        private readonly proformaService: ProformaService
    ){}

    @Post()
    async createByCriteria(
        @Body(new ValidationPipe()) createProformaByCriteriaDto: CreateProformaByCriteriaDto,
        @Res() res: Response // Injectez l'objet Response
    ) {
        try {
            const { proforma, pdfBuffer } = await this.proformaService.create(createProformaByCriteriaDto);
            const pdfBase64 = pdfBuffer.toString('base64');

            res.status(201).json({ ...proforma, pdfBase64 }); // Incluez pdfBase64 dans la réponse
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    @Get('available-vehicles')
    async findAvailableVehicles(@Query(new ValidationPipe()) query: FindAvailableVehiclesDto) {
      return this.proformaService.findAvailableVehicles(query);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.proformaService.findOne(id);
    }

    @Get()
    async findAll(): Promise<Proforma[]>{
        return this.proformaService.findAll();
    }

    @Patch(':id/status')
    async updateStatus(
      @Param('id') id: number,
      @Body(new ValidationPipe()) updateProformaStatusDto: UpdateProformaStatusDto,
    ) {
      return this.proformaService.updateStatus(id, updateProformaStatusDto.status);
    }

}

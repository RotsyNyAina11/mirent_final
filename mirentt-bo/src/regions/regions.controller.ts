import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { RegionsService } from './regions.service';
import { UpdateRegionFullDto } from './update_region.dto';
import { CreateRegionFullDto } from './create_region_full.dto';
import { CreateDistrictDto } from 'src/districts/create_district.dto';

@Controller('regions')
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Post()
  create(@Body() createRegionFullDto: CreateRegionFullDto) {
    return this.regionsService.createFull(createRegionFullDto);
  }

  @Get()
  findAllWithDetails() {
    return this.regionsService.findAllWithDetails();
  }

  @Get(':id')
  findOneWithDetails(@Param('id') id: string) {
    return this.regionsService.findOneWithDetails(+id);
  }

  @Post(':id/districts')
  addDistrict(@Param('id') id: string, @Body() createDistrictDto: CreateDistrictDto) {
    return this.regionsService.addDistrict(+id, createDistrictDto);
  }

  @Patch(':id')
  updateFull(
    @Param('id') id: string,
    @Body() updateRegionFullDto: UpdateRegionFullDto,
  ) {
    return this.regionsService.updateFull(+id, updateRegionFullDto);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.regionsService.removeRegion(+id);
  }

}

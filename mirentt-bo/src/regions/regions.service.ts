import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Prix } from 'src/entities/prix.entity';
import { Region } from 'src/entities/region.entity';
import { Repository } from 'typeorm';
import { CreateRegionDto } from './create-region.dto';


@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(Region)
    private regionRepository: Repository<Region>,
    @InjectRepository(Prix)
    private prixRepository: Repository<Prix>,
  ) {}

  async findAll(): Promise<Region[]> {
    return this.regionRepository.find({ relations: ['prix'] });
  }

  async create(createRegionDto: CreateRegionDto): Promise<Region> {
    try {
      const region = new Region();
      region.nom_region = createRegionDto.nom_region;
      region.nom_district = createRegionDto.nom_district;
      const prix = this.prixRepository.create(createRegionDto.prix);
      region.prix = prix;

      console.log('Region received:', region);
      console.log('Prix data:', region.prix);
  
      console.log('Prix created:', prix);
  
      await this.prixRepository.save(prix);
      region.prix = prix;
  
      return this.regionRepository.save(region);
    } catch (error) {
      console.error('Error creating region:', error);
      throw error; 
    }
  }

  async updatePrix(regionId: number, prixValue: number): Promise<Prix> {
    const region = await this.regionRepository.findOne({ where: { id: regionId }, relations: ['prix'] });
    if (!region) {
      throw new Error('Region not found');
    }

    let prix = region.prix;
    if (!prix) {
      prix = this.prixRepository.create({ prix: prixValue, region: region });
    } else {
      prix.prix = prixValue;
    }

    return this.prixRepository.save(prix);
  }

  async updateFull(regionId: number, updatedRegion: Partial<Region>): Promise<Region> {
    const region = await this.regionRepository.findOne({ where: { id: regionId }, relations: ['prix'] });
    if (!region) {
      throw new Error('Region not found');
    }

    if (updatedRegion.nom_region) {
      region.nom_region = updatedRegion.nom_region;
    }
    if (updatedRegion.nom_district !== undefined) {
      region.nom_district = updatedRegion.nom_district;
    }

    if (updatedRegion.prix && updatedRegion.prix.prix !== undefined) {
      if (region.prix) {
        region.prix.prix = updatedRegion.prix.prix;
        await this.prixRepository.save(region.prix);
      } else {
        const newPrix = this.prixRepository.create({ prix: updatedRegion.prix.prix, region: region });
        await this.prixRepository.save(newPrix);
        region.prix = newPrix;
      }
    }

    return this.regionRepository.save(region);
  }

  async remove(regionId: number): Promise<void> {
    const region = await this.regionRepository.findOne({ where: { id: regionId }, relations: ['prix'] });
    if (!region) {
      throw new Error('Region not found');
    }

    if (region.prix) {
      await this.prixRepository.remove(region.prix);
    }
    await this.regionRepository.remove(region);
  }
}
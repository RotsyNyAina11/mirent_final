import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Region } from 'src/entities/region.entity'; 
import { Prix } from 'src/entities/prix.entity'; 
import { District } from 'src/entities/district.entity'; 
import { CreateRegionFullDto } from './create_region_full.dto';
import { CreateDistrictDto } from 'src/districts/create_district.dto';
import { UpdateRegionFullDto } from './update_region.dto';

@Injectable()
export class RegionsService {
    constructor(
        @InjectRepository(Region)
        private regionRepository: Repository<Region>,
        @InjectRepository(Prix)
        private prixRepository: Repository<Prix>,
        @InjectRepository(District)
        private districtRepository: Repository<District>,
    ) {}

    async createFull(createRegionFullDto: CreateRegionFullDto): Promise<Region> {
        const region = this.regionRepository.create({
            nom_region: createRegionFullDto.nom_region,
        });
        await this.regionRepository.save(region);

        const prix = this.prixRepository.create({
            region_id: region.region_id,
            prix_location: createRegionFullDto.prix.prix_location,
        });
        await this.prixRepository.save(prix);

        if (createRegionFullDto.district && createRegionFullDto.district.nom_district) {
            const district = this.districtRepository.create({
                nom_district: createRegionFullDto.district.nom_district,
            });
            await this.districtRepository.save(district);

            region.district_id = district.district_id;
            await this.regionRepository.save(region);
        }

        return region;
    }

    async findAllWithDetails(): Promise<Region[]> {
        return this.regionRepository.find({
            relations: ['district', 'prix'], 
        });
    }

    async findOneWithDetails(id: number): Promise<Region | null> {
        return this.regionRepository.findOne({
            where: { region_id: id },
            relations: ['district', 'prix'], 
        });
    }

    async addDistrict(regionId: number, createDistrictDto: CreateDistrictDto): Promise<District> {
        const district = this.districtRepository.create({
            ...createDistrictDto,
        });
        await this.districtRepository.save(district);

        const region = await this.regionRepository.findOneBy({region_id: regionId});

        if(region){
            region.district_id = district.district_id;
            await this.regionRepository.save(region);
        }

        return district;
    }

    async updateFull(
        regionId: number,
        updateRegionFullDto: UpdateRegionFullDto,
    ): Promise<Region | null> {
        const region = await this.regionRepository.findOneBy({
            region_id: regionId,
        });
        if (!region) {
            throw new Error('Région non trouvée');
        }

        if (updateRegionFullDto.nom_region) {
            region.nom_region = updateRegionFullDto.nom_region;
            await this.regionRepository.save(region);
        }

        if (updateRegionFullDto.prix && updateRegionFullDto.prix.prix_location !== undefined) {
            const prix = await this.prixRepository.findOneBy({
                region_id: regionId,
            });
            if (prix) {
                prix.prix_location = updateRegionFullDto.prix.prix_location;
                await this.prixRepository.save(prix);
            }
        }

        if (updateRegionFullDto.district && updateRegionFullDto.district.nom_district !== undefined) {
            if (region.district_id) {
                const district = await this.districtRepository.findOneBy({
                    district_id: region.district_id,
                });
                if (district) {
                    district.nom_district = updateRegionFullDto.district.nom_district;
                    await this.districtRepository.save(district);
                }
            } else {
                const district = this.districtRepository.create({
                    nom_district: updateRegionFullDto.district.nom_district,
                });
                await this.districtRepository.save(district);
                region.district_id = district.district_id;
                await this.regionRepository.save(region);
            }
        }

        if (updateRegionFullDto.deleteDistrict === true) {
            if (region.district_id) {
                await this.districtRepository.delete(region.district_id);
                region.district_id = null;
                await this.regionRepository.save(region);
            }
        }

        return this.regionRepository.findOneBy({ region_id: regionId });
    }

    async removeRegion(id: number): Promise<void> {
        await this.regionRepository.delete(id);
    }
}
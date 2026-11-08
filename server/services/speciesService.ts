import type { CreateSpeciesDTO, UpdateSpeciesDTO } from "../../shared/types.ts";
import { speciesRepository } from "../repositories/species.ts";

export const speciesService = {
    async getAllSpecies() {
        return await speciesRepository.getAll();
    },

    async getSpeciesById(id: number) {
        const species = await speciesRepository.getById(id);
        if (!species) {
            throw new Error('Вид рыбы не найден');
        }
        return species;
    },

    async createSpecies(data: CreateSpeciesDTO) {
        if (!data.name || data.name.trim() == '') {
            throw new Error('Название не может быть пустым');
        }
        if (data.feedRate !== undefined && data.feedRate <= 0) {
            throw new Error('Норма кормления должна быть больше нуля');
        }
        if (data.optimalTempMin !== undefined && data.optimalTempMin <= 0) {
            throw new Error('Температура для рыбы слишком низкая');
        }
        if (data.optimalTempMax !== undefined && data.optimalTempMax <= 0) {
            throw new Error('Температура для рыбы слишком низкая');
        }
        if (data.growthRate !== undefined && data.growthRate <= 0) {
            throw new Error('Скорость роста должна быть больше нуля');
        }
        if (data.maturityMonths !== undefined && data.maturityMonths <=0 ) {
            throw new Error('Месяцы должны быть больше нуля');
        }
        return await speciesRepository.create(data);
    },

    async updateSpecies(id: number, data: UpdateSpeciesDTO) {
        const species = await speciesRepository.getById(id);
        if (!species) {
            throw new Error('Вид рыбы не найден');
        }
        if (!data.name || data.name.trim() === '') {
            throw new Error('Название не может быть пустым');
        }
        if (data.feedRate !== undefined && data.feedRate <= 0) {
            throw new Error('Норма кормления должна быть больше нуля');
        }
        if (data.optimalTempMin !== undefined && data.optimalTempMin <= 0) {
            throw new Error('Температура для рыбы слишком низкая');
        }
        if (data.optimalTempMax !== undefined && data.optimalTempMax <= 0) {
            throw new Error('Температура для рыбы слишком низкая');
        }
        if (data.growthRate !== undefined && data.growthRate <= 0) {
            throw new Error('Скорость роста должна быть больше нуля');
        }
        if (data.maturityMonths !== undefined && data.maturityMonths <= 0) {
            throw new Error('Месяцы должны быть больше нуля');
        }
        return await speciesRepository.update(id, data);
    },

    async deleteSpecies(id: number) {
        const species = await speciesRepository.getById(id);
        if (!species) {
            throw new Error('Вид рыбы не найден');
        }
        return await speciesRepository.delete(id);
    }
};
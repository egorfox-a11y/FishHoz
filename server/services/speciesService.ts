import type { CreateSpeciesDTO, UpdateSpeciesDTO } from "../../shared/types.ts";
import { speciesRepository } from "../repositories/species.ts";

export const speciesService = {
    async getAllSpecies(ownerId: string) {
        return await speciesRepository.getAll(ownerId);
    },

    async getSpeciesById(id: number, ownerId: string) {
        const species = await speciesRepository.getById(id, ownerId);
        if (!species) {
            throw new Error('Вид рыбы не найден');
        }
        return species;
    },

    async createSpecies(data: CreateSpeciesDTO, ownerId: string) {
        if (!data.name || data.name.trim() === '') {
            throw new Error('Название не может быть пустым');
        }

        // Проверка на дубликат (в рамках этого же ownerId)
        const allSpecies = await speciesRepository.getAll(ownerId);
        const existing = allSpecies.find(s => s.name.toLowerCase() === data.name.toLowerCase());
        if (existing) {
            throw new Error('Вид с таким названием уже существует');
        }

        if (data.feedRate != null && data.feedRate <= 0) {
            throw new Error('Норма кормления должна быть больше нуля');
        }
        if (data.optimalTempMin != null && data.optimalTempMin <= 0) {
            throw new Error('Температура для рыбы слишком низкая');
        }
        if (data.optimalTempMax != null && data.optimalTempMax <= 0) {
            throw new Error('Температура для рыбы слишком низкая');
        }
        if (data.growthRate != null && data.growthRate <= 0) {
            throw new Error('Скорость роста должна быть больше нуля');
        }
        if (data.maturityMonths != null && data.maturityMonths <= 0) {
            throw new Error('Месяцы должны быть больше нуля');
        }
        
        return await speciesRepository.create(data, ownerId);
    },

    async updateSpecies(id: number, data: UpdateSpeciesDTO, ownerId: string) {
        const species = await speciesRepository.getById(id, ownerId);
        if (!species) {
            throw new Error('Вид рыбы не найден');
        }

        if (data.name != null && data.name.trim() === '') {
            throw new Error('Название не может быть пустым');
        }

        // Проверка на дубликат (если имя меняется)
        if (data.name && data.name.toLowerCase() !== species.name.toLowerCase()) {
            const allSpecies = await speciesRepository.getAll(ownerId);
            const isDuplicate = allSpecies.some(
                s => s.id !== id && s.name.toLowerCase() === data.name!.toLowerCase()
            );
            if (isDuplicate) {
                throw new Error('Вид с таким названием уже существует');
            }
        }

        if (data.feedRate != null && data.feedRate <= 0) {
            throw new Error('Норма кормления должна быть больше нуля');
        }
        if (data.optimalTempMin != null && data.optimalTempMin <= 0) {
            throw new Error('Температура для рыбы слишком низкая');
        }
        if (data.optimalTempMax != null && data.optimalTempMax <= 0) {
            throw new Error('Температура для рыбы слишком низкая');
        }
        if (data.growthRate != null && data.growthRate <= 0) {
            throw new Error('Скорость роста должна быть больше нуля');
        }
        if (data.maturityMonths != null && data.maturityMonths <= 0) {
            throw new Error('Месяцы должны быть больше нуля');
        }

        return await speciesRepository.update(id, data);
    },

    async deleteSpecies(id: number, ownerId: string) {
        const species = await speciesRepository.getById(id, ownerId);
        if (!species) {
            throw new Error('Вид рыбы не найден');
        }
        return await speciesRepository.delete(id);
    }
};
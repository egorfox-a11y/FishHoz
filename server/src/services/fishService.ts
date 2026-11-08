import { auth } from '../api/auth';
import { fishRepository } from "../repositories/fishRepository";
import { pondRepository } from "../repositories/pondRepository";
import type { CreateFishBatchDTO, FishBatch, FishSpecies, UpdateFishBatchDTO } from '../types/types';

export const fishService = {
    async getAllFishBatch(): Promise<FishBatch[]> {
        return await fishRepository.getAll();
    },
    async getFishBatchById(id: number): Promise<FishBatch | null> {
        return await fishRepository.getById(id);
    },
    async getFishBatchByPond(pondId: number): Promise<FishBatch[]> {
        return await fishRepository.getByPond(pondId);
    },
    async createFishBatch(data: CreateFishBatchDTO): Promise<FishBatch> {
        const pond = await pondRepository.getById(data.pondId);
        if (!pond) {
            throw new Error('Пруд не найден');
        }
        if (data.quantity <= 0) {
            throw new Error('Количество должно быть больше 0');
        }
        if (data.avgWeight !== undefined && data.avgWeight <= 0) {
            throw new Error('Вес должен быть больше нуля')
        }
        const launchDate = new Date(data.launchDate);
        const today = new Date();
        if (launchDate > today) {
            throw new Error('Дата запуска не может быть в будущем');
        }
        const user = await auth.getUser();
        if (!user) {
            throw new Error('Не авторизован');
        }

        return await fishRepository.add({
            pondId: data.pondId,
            speciesId: data.speciesId,
            quantity: data.quantity,
            avgWeight: data.avgWeight,
            launchDate: data.launchDate,
            ownerId: user.id,
        });
    },
    async updateBatch(id: number, data: UpdateFishBatchDTO): Promise<FishBatch> {
        const batch = await fishRepository.getById(id);
        if (!batch) {
            throw new Error('Партия не найдена');
        }
        if (data.quantity !== undefined && data.quantity <= 0) {
            throw new Error('Количество должно быть больше нуля')
        }
        if (data.avgWeight !== undefined && data.avgWeight <= 0) {
            throw new Error('Средний вес должен быть больше 0')
        }
        return await fishRepository.update(id, data);
    },
    async deleteBatch(id: number): Promise<void> {
        const batch = await fishRepository.getById(id)
        if (!batch) {
            throw new Error('Партия не найдена')
        }
        await fishRepository.delete(id)
    },
     async getAllSpecies(): Promise<FishSpecies[]> {
        return await fishRepository.getAllSpecies();
    },
    
};
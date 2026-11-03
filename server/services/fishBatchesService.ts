import { fishBatchRepository } from "../repositories/fishBatches.ts";
import type { CreateFishBatchDTO, UpdateFishBatchDTO } from "../types.ts";

export const fishBatchService = {
    async getAllBatches() {
        return await fishBatchRepository.getAll();
    },

    async getBatchById(id: number) {
        const batch = await fishBatchRepository.getById(id);
        if (!batch) {
            throw new Error('Партия рыбы не найдена');
        }
        return batch;
    },

    async createBatch(data: CreateFishBatchDTO) {

        if (data.quantity <= 0) {
            throw new Error('Количество должно быть больше нуля');
        }

        if (data.avgWeight !== undefined && data.avgWeight <= 0) {
            throw new Error('Средний вес должен быть больше нуля');
        }
        return await fishBatchRepository.create(data);
    },

    async updateBatch(id: number, data: UpdateFishBatchDTO) {
        const batch = await fishBatchRepository.getById(id);
        if (!batch) {
            throw new Error('Партия рыбы не найдена')
        }
        if (data.quantity !== undefined && data.quantity <= 0) {
            throw new Error('Количество должно быть больше нуля');
        }

        if (data.avgWeight !== undefined && data.avgWeight <= 0) {
            throw new Error('Средний вес должен быть больше нуля');
        }
        return await fishBatchRepository.update(id, data);
    },

    async deleteBatch(id: number) {
        const batch = await fishBatchRepository.getById(id);
        if (!batch) {
            throw new Error('Партия рыбы не найдена')
        }

        return await fishBatchRepository.delete(id);
    }
}; 

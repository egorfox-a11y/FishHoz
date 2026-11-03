import { feedingRepository } from "../repositories/feedings.ts";
import type { CreateFeedingDTO, UpdateFeedingDTO } from "../types.ts";

export const feedingService = {
    async getAllFeedings() {
        return await feedingRepository.getAll();
    },

    async getFeedingById(id: number) {
        const feeding = await feedingRepository.getById(id);
        if (!feeding) {
            throw new Error('Запись о кормлении не найдена');
        }
        return feeding;
    },

    async createFeeding(data: CreateFeedingDTO) {
        if (data.amount <= 0) {
            throw new Error('Количество корма должно быть больше нуля');
        }
        return await feedingRepository.create(data);
    },

    async updateFeeding(id: number, data: UpdateFeedingDTO) {
        const feeding = await feedingRepository.getById(id);
        if (!feeding) {
            throw new Error('Запись о кормлении не найдена');
        }
        if (data.amount !== undefined && data.amount <= 0) {
            throw new Error('Количество корма должно быть больше нуля');
        }
        return await feedingRepository.update(id, data);
    },

    async deleteFeeding(id: number) {
        const feeding = await feedingRepository.getById(id);
        if (!feeding) {
            throw new Error('Запись о кормлении не найдена');
        }
        return await feedingRepository.delete(id);
    }
}
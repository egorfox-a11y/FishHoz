import type { CreateCatchDTO, UpdateCatchDTO } from "../../shared/types.ts";
import { catchRepository } from "../repositories/catches.ts";

export const catchService = {
    async getAllCatches() {
        return await catchRepository.getAll();
    },

    async getCatchById(id: number) {
        const catchItem = await catchRepository.getById(id);
        if (!catchItem) {
            throw new Error('Запись о вылове не найдена');
        }
        return catchItem;
    },

    async createCatch(data: CreateCatchDTO) {
        if (data.quantity <= 0) {
            throw new Error('Количество должно быть больше нуля');
        }

        if (data.totalWeight != null && data.totalWeight <= 0) {
            throw new Error('Общий вес должен быть больше нуля');
        }

        return await catchRepository.create(data);
    },

    async updateCatch(id: number, data: UpdateCatchDTO) {
        const catchItem = await catchRepository.getById(id);

        if (!catchItem) {
            throw new Error('Запись о вылове не найдена');
        }

        if (data.quantity !== undefined && data.quantity <= 0) {
            throw new Error('Количество должно быть больше нуля');
        }

        if (data.totalWeight != null && data.totalWeight <= 0) {
            throw new Error('Общий вес должен быть больше нуля');
        }

        return await catchRepository.update(id, data);
    },

    async deleteCatch(id: number)  {
        const catchItem = await catchRepository.getById(id);
        if (!catchItem) {
            throw new Error('Запись о вылове не найдена');
        }

        return await catchRepository.delete(id);
    }

}
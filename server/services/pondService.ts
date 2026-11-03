import { pondRepository } from "../repositories/ponds.ts";
import type { CreatePondDTO, UpdatePondDTO } from "../types.ts";

export const pondService = {
    async getAllPonds() {
        return await pondRepository.getAll();
    },

    async getPondById(id: number) {
        const pond = await pondRepository.getById(id);
        if (!pond) {
            throw new Error('Пруд не найден');
        }
        return pond;
    },

    async createPond(data: CreatePondDTO) {
        if (!data.name || data.name.trim() === '') {
            throw new Error('Имя пруда не может быть пустым');
        }
        return await pondRepository.create(data);
    },

    async updatePond(id: number, data: UpdatePondDTO) {
        const existingPond = await pondRepository.getById(id);
        if (!existingPond) {
            throw new Error('Пруд не найден');
        }
        if (data.name !== undefined && data.name.trim() === '') {
            throw new Error('Имя пруда не может быть пустым');
        }
        return await pondRepository.update(id, data);
    },

    async deletePond(id: number) {
        const existingPond = await pondRepository.getById(id);
        if (!existingPond) {
            throw new Error('Пруд не найден');
        }
        await pondRepository.delete(id);
    }
};
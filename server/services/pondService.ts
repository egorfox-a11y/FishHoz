import type { CreatePondDTO, UpdatePondDTO } from "../../shared/types.ts";
import { pondRepository } from "../repositories/ponds.ts";

async function getOwnedPond(id: number, ownerId: string) {
    const pond = await pondRepository.getById(id);
    if (!pond || pond.ownerId !== ownerId) {
        throw new Error('Пруд не найден');
    }
    return pond;
}

export const pondService = {
    async getAllPonds(ownerId: string) {
        return await pondRepository.getAll(ownerId);
    },

    async getPondById(id: number, ownerId: string) {
        return await getOwnedPond(id, ownerId);
    },

    async createPond(data: CreatePondDTO, ownerId: string) {
        if (!data.name || data.name.trim() === '') {
            throw new Error('Имя пруда не может быть пустым');
        }
        return await pondRepository.create(data, ownerId);
    },

    async updatePond(id: number, data: UpdatePondDTO, ownerId: string) {
        await getOwnedPond(id, ownerId);
        if (data.name !== undefined && data.name.trim() === '') {
            throw new Error('Имя пруда не может быть пустым');
        }
        return await pondRepository.update(id, data);
    },

    async deletePond(id: number, ownerId: string) {
        await getOwnedPond(id, ownerId);
        await pondRepository.delete(id);
    }
};

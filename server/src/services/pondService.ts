import { auth } from '../api/auth';
import { pondRepository } from "../repositories/pondRepository";
import type { CreatePondDTO, Pond, UpdatePondDTO } from "../types/types";
export const pondService = {
    async getAllPonds(): Promise<Pond[]> {
        return await pondRepository.getAll();
    },
    async getPondById(id: number): Promise<Pond | null> {
        return await pondRepository.getById(id);
    },
    async createPond(data: CreatePondDTO): Promise<Pond> {

        if (!data.name || data.name.trim() === '') {
            throw new Error('Название пруда обязательно')
        };

        if (data.area !== undefined && data.area <= 0) {
            throw new Error('Площадь должна быть больше нуля')
        };

        if (data.depth !== undefined && data.depth <= 0) {
            throw new Error('Глубина должна быть больше 0')
        };

        const user = await auth.getUser();
        if (!user) {
            throw new Error('Не авторизован');
        }

        return await pondRepository.add({
            name: data.name.trim(),
            area: data.area,
            depth: data.depth,
            ownerId: user.id,
        });
    },
    async updatePond(id: number, data: UpdatePondDTO): Promise<Pond> {
        const pond = await pondRepository.getById(id);
        if (!pond) {
            throw new Error('Пруд не найден');
        }
        if (data.name !== undefined && data.name.trim() === '') {
            throw new Error('Название пруда не может быть пустым');
        }
        if (data.area !== undefined && data.area <= 0) {
            throw new Error('Площадь должна быть больше 0')
        }
        if (data.depth !== undefined && data.depth <= 0) {
            throw new Error('Глубина должна быть больше 0');
        }
        return await pondRepository.update(id, {
            name: data.name?.trim(),
            area: data.area,
            depth: data.depth,
        });
    },
    async deletePond(id: number): Promise<void> {
        const pond = await pondRepository.getById(id);
        if (!pond) {
            throw new Error('Пруд не найден')
        }
        await pondRepository.delete(id);
    }, 
};
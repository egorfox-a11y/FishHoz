import { auth } from '../api/auth';
import { feedingRepository } from "../repositories/feedingRepository";
import { pondRepository } from "../repositories/pondRepository";
import type { CreateFeedingDTO, Feeding, UpdateFeedingDTO } from '../types/types';

export const feedingService = {
    async getAllFeedings(): Promise<Feeding[]> {
        return await feedingRepository.getAll()
    },
    async getFeedingByPond(pondId: number): Promise<Feeding[]> {
        const pond = await pondRepository.getById(pondId);
        if (!pond) {
            throw new Error('Пруд не найден');
        }
        return await feedingRepository.getByPond(pondId);
    },
    async getFeedingById(id: number): Promise<Feeding | null> {
        return await feedingRepository.getById(id);
    },
    async createFeeding(data: CreateFeedingDTO): Promise<Feeding> {
        const pond = await pondRepository.getById(data.pondId);
        if (!pond) {
            throw new Error('Пруд не найден');
        }
        if (data.amount <= 0) {
            throw new Error('Количество корма должно быть больше 0');
        }
        if (data.amount > 1000) {
            throw new Error('Количество корма слишком большое, максимум 1000')
        }
        if (data.feedType !== undefined && data.feedType.trim() === '') {
            throw new Error('Тип корма не может быть пустым')
        }
        const user = await auth.getUser();
        if (!user) {
            throw new Error('Не авторизован');
        }
        return await feedingRepository.add({
            pondId: data.pondId,
            amount: data.amount,
            feedType: data.feedType?.trim(),
            ownerId: user.id,
        });
    },
    async updateFeeding(id: number, data: UpdateFeedingDTO): Promise<Feeding> {
        const feeding = await feedingRepository.getById(id);
        if (!feeding) {
            throw new Error('Запись о кормлении не найдена');
        }
        if (data.amount !== undefined && data.amount <= 0) {
            throw new Error('Количество корма должно быть больше 0');
        }
        if (data.amount !== undefined && data.amount > 1000) {
            throw new Error('Количество корма слишком большое, максимум 1000');
        }
        return await feedingRepository.update(id, data);
    },
    async deleteFeeding(id: number): Promise<void> {
        const feeding = await feedingRepository.getById(id);
        if (!feeding) {
            throw new Error('Запись о кормлении не найдена');
        }
        await feedingRepository.delete(id);
    }
};
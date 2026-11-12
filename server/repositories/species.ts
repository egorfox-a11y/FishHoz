import { and, eq } from 'drizzle-orm'; // <-- Добавили and
import type { CreateSpeciesDTO, FishSpecies, UpdateSpeciesDTO } from '../../shared/types.ts';
import { db } from '../db/index.ts';
import { fishSpecies } from '../db/schema.ts';

export const speciesRepository = {
    async getById(id: number, ownerId: string): Promise<FishSpecies | undefined> {
        const result = await db.select()
            .from(fishSpecies)
            .where(and(eq(fishSpecies.id, id), eq(fishSpecies.ownerId, ownerId)));
        return result[0];
    },

    async getAll(ownerId: string): Promise<FishSpecies[]> {
        return await db.select().from(fishSpecies).where(eq(fishSpecies.ownerId, ownerId));
    },

    async create(data: Omit<CreateSpeciesDTO, 'ownerId'>, ownerId: string): Promise<FishSpecies> {
        const result = await db.insert(fishSpecies)
            .values({ ...data, ownerId })
            .returning();
        return result[0]!;
    },

    async update(id: number, data: UpdateSpeciesDTO): Promise<FishSpecies> {
        const result = await db.update(fishSpecies)
            .set(data)
            .where(eq(fishSpecies.id, id))
            .returning();
        return result[0]!;
    },

    async delete(id: number): Promise<void> {
        await db.delete(fishSpecies).where(eq(fishSpecies.id, id));
    }
};
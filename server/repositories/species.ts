import { eq } from 'drizzle-orm';
import type { CreateSpeciesDTO, FishSpecies, UpdateSpeciesDTO } from '../../shared/types.ts';
import { db } from '../db/index.ts';
import { fishSpecies } from '../db/schema.ts';

export const speciesRepository = {

    async getById(id: number): Promise<FishSpecies | undefined> {
        const result = await db.select().from(fishSpecies).where(eq(fishSpecies.id, id));
        return result[0];
    },
    async getAll(): Promise<FishSpecies[]> {
        return await db.select().from(fishSpecies);
    },
    async create(data: CreateSpeciesDTO): Promise<FishSpecies> {
        const result = await db.insert(fishSpecies).values(data).returning();
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
        await db.delete(fishSpecies).where(eq(fishSpecies.id, id)).returning();
    }
};
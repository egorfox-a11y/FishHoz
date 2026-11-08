import { eq } from 'drizzle-orm';
import type { CreateFishBatchDTO, FishBatch, UpdateFishBatchDTO } from '../../shared/types.ts';
import { db } from '../db/index.ts';
import { fishBatches, fishSpecies } from '../db/schema.ts';

export const fishBatchRepository = {

    async getById(id: number): Promise<FishBatch | undefined> {
        const result = await db.select({
            id: fishBatches.id,
            pondId: fishBatches.pondId,
            speciesId: fishBatches.speciesId,
            quantity: fishBatches.quantity,
            avgWeight: fishBatches.avgWeight,
            launchDate: fishBatches.launchDate,
            speciesName: fishSpecies.name, // <-- Добавили имя
        })
        .from(fishBatches)
        .leftJoin(fishSpecies, eq(fishBatches.speciesId, fishSpecies.id))
        .where(eq(fishBatches.id, id));
        
        return result[0] as FishBatch | undefined;
    },

    async getAll(): Promise<FishBatch[]> {
        const result = await db.select({
            id: fishBatches.id,
            pondId: fishBatches.pondId,
            speciesId: fishBatches.speciesId,
            quantity: fishBatches.quantity,
            avgWeight: fishBatches.avgWeight,
            launchDate: fishBatches.launchDate,
            speciesName: fishSpecies.name, 
        })
        .from(fishBatches)
        .leftJoin(fishSpecies, eq(fishBatches.speciesId, fishSpecies.id));
        
        return result as FishBatch[];
    },

    async create(data: CreateFishBatchDTO): Promise<FishBatch> {
        const result = await db.insert(fishBatches).values(data).returning();
        return result[0]!;
    },

    async update(id: number, data: UpdateFishBatchDTO): Promise<FishBatch> {
        const result = await db.update(fishBatches)
            .set(data)
            .where(eq(fishBatches.id, id))
            .returning();
        return result[0]!;
    },

    async delete(id: number): Promise<void> {
        await db.delete(fishBatches).where(eq(fishBatches.id, id)).returning();
    }
};
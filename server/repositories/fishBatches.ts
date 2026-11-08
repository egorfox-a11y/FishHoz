import { eq } from 'drizzle-orm';
import type { CreateFishBatchDTO, FishBatch, UpdateFishBatchDTO } from '../../shared/types.ts';
import { db } from '../db/index.ts';
import { fishBatches } from '../db/schema.ts';
export const fishBatchRepository = {

    async getById(id: number): Promise<FishBatch | undefined> {
        const result = await db.select().from(fishBatches).where(eq(fishBatches.id, id));
        return result[0];
    },
    async getAll(): Promise<FishBatch[]> {
        return await db.select().from(fishBatches);
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
        const result = await db.delete(fishBatches).where(eq(fishBatches.id, id)).returning();
    }
};
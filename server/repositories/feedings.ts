import { eq } from 'drizzle-orm';
import type { CreateFeedingDTO, Feeding, UpdateFeedingDTO } from '../../shared/types.ts';
import { db } from '../db/index.ts';
import { feedings } from '../db/schema.ts';
export const feedingRepository = {

    async getById(id: number): Promise<Feeding | undefined> {
        const result = await db.select().from(feedings).where(eq(feedings.id, id));
        return result[0];
    },
    async getAll(): Promise<Feeding[]> {
        return await db.select().from(feedings);
    },
    async create(data: CreateFeedingDTO): Promise<Feeding> {
        const result = await db.insert(feedings).values(data).returning();
        return result[0]!;
    },

    async update(id: number, data: UpdateFeedingDTO): Promise<Feeding> {
        const result = await db.update(feedings)
            .set(data)
            .where(eq(feedings.id, id))
            .returning();
        return result[0]!;
    },

    async delete(id: number): Promise<void> {
        await db.delete(feedings).where(eq(feedings.id, id)).returning();
    }
};
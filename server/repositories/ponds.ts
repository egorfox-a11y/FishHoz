import { eq } from 'drizzle-orm';
import type { CreatePondDTO, Pond, UpdatePondDTO } from '../../shared/types.ts';
import { db } from '../db/index.ts';
import { ponds } from '../db/schema.ts';
export const pondRepository = {

    async getById(id: number): Promise<Pond | undefined> {
        const result = await db.select().from(ponds).where(eq(ponds.id, id));
        return result[0];
    },
    async getAll(): Promise<Pond[]> {
        return await db.select().from(ponds);
    },
    async create(data: CreatePondDTO): Promise<Pond> {
        const result = await db.insert(ponds).values(data).returning();
        return result[0]!;
    },

    async update(id: number, data: UpdatePondDTO): Promise<Pond> {
        const result = await db.update(ponds)
            .set(data)
            .where(eq(ponds.id, id))
            .returning();
        return result[0]!;
    },

    async delete(id: number): Promise<void> {
        const result = await db.delete(ponds).where(eq(ponds.id, id)).returning();
    }
};

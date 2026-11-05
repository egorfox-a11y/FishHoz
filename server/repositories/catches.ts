import { eq } from 'drizzle-orm';
import { db } from '../db/index.ts';
import { catches } from '../db/schema.ts';
import type { CreateCatchDTO, Catch, UpdateCatchDTO } from '../types.ts';
export const catchRepository = {

    async getById(id: number): Promise<Catch | undefined> {
        const result = await db.select().from(catches).where(eq(catches.id, id));
        return result[0];
    },
    async getAll(): Promise<Catch[]> {
        return await db.select().from(catches);
    },
    async create(data: CreateCatchDTO): Promise<Catch> {
        const result = await db.insert(catches).values(data).returning();
        return result[0]!;
    },

    async update(id: number, data: UpdateCatchDTO): Promise<Catch> {
        const result = await db.update(catches)
            .set(data)
            .where(eq(catches.id, id))
            .returning();
        return result[0]!;
    },

    async delete(id: number): Promise<void> {
        await db.delete(catches).where(eq(catches.id, id)).returning();
    }
};
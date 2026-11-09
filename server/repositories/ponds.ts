import { eq } from 'drizzle-orm';
import type { CreatePondDTO, Pond, UpdatePondDTO } from '../../shared/types.ts';
import { db } from '../db/index.ts';
import { ponds } from '../db/schema.ts';
export const pondRepository = {

    async getById(id: number): Promise<Pond | undefined> {
        const result = await db.select().from(ponds).where(eq(ponds.id, id));
        return result[0];
    },
    async getAll(ownerId: string): Promise<Pond[]> {
        return await db.select().from(ponds).where(eq(ponds.ownerId, ownerId));
    },
    async create(data: CreatePondDTO, ownerId: string): Promise<Pond> {
        // ownerId всегда берём из токена, а не из тела запроса
        const { ownerId: _ignored, ...rest } = data;
        const result = await db.insert(ponds).values({ ...rest, ownerId }).returning();
        return result[0]!;
    },

    async update(id: number, data: UpdatePondDTO): Promise<Pond> {
        // менять владельца через PATCH нельзя
        const { ownerId: _ignored, ...rest } = data;
        const result = await db.update(ponds)
            .set(rest)
            .where(eq(ponds.id, id))
            .returning();
        return result[0]!;
    },

    async delete(id: number): Promise<void> {
        await db.delete(ponds).where(eq(ponds.id, id)).returning();
    }
};

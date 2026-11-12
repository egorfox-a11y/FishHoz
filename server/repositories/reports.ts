import { and, eq } from 'drizzle-orm';
import type { CreateReportDTO, Report } from '../../shared/types.ts';
import { db } from '../db/index.ts';
import { reports } from '../db/schema.ts';

export const reportsRepository = {
    async getAll(ownerId: string): Promise<Report[]> {
        return await db.select().from(reports).where(eq(reports.ownerId, ownerId));
    },

    async getById(id: number, ownerId: string): Promise<Report | undefined> {
        const result = await db.select()
            .from(reports)
            .where(and(eq(reports.id, id), eq(reports.ownerId, ownerId)));
        return result[0];
    },

    async create(data: Omit<CreateReportDTO, 'ownerId'>, ownerId: string): Promise<Report> {
        const result = await db.insert(reports)
            .values({ ...data, ownerId })
            .returning();
        return result[0]!;
    },

    async delete(id: number): Promise<void> {
        await db.delete(reports).where(eq(reports.id, id));
    }
};
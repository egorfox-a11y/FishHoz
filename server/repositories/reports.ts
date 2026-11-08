import { eq } from 'drizzle-orm';
import type { CreateReportDTO, Report, UpdateReportDTO } from '../../shared/types.ts';
import { db } from '../db/index.ts';
import { reports } from '../db/schema.ts';
export const reportsRepository = {

    async getById(id: number): Promise<Report | undefined> {
        const result = await db.select().from(reports).where(eq(reports.id, id));
        return result[0];
    },
    async getAll(): Promise<Report[]> {
        return await db.select().from(reports);
    },
    async create(data: CreateReportDTO): Promise<Report> {
        const result = await db.insert(reports).values(data).returning();
        return result[0]!;
    },

    async update(id: number, data: UpdateReportDTO): Promise<Report> {
        const result = await db.update(reports)
            .set(data)
            .where(eq(reports.id, id))
            .returning();
        return result[0]!;
    },

    async delete(id: number): Promise<void> {
        await db.delete(reports).where(eq(reports.id, id)).returning();
    }
};
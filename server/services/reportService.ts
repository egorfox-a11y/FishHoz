import type { CreateReportDTO } from "../../shared/types.ts";
import { reportsRepository } from "../repositories/reports.ts";

export const reportService = {
    async getAllReports(ownerId: string) {
        return await reportsRepository.getAll(ownerId);
    },
    async getReportById(id: number, ownerId: string) {
        const report = await reportsRepository.getById(id, ownerId);
        if (!report) {
            throw new Error('Отчёт не найден');
        }
        return report;
    },
    
    async createReport(data: CreateReportDTO, ownerId: string) {
        if (!data.period || data.period.trim() === '') {
            throw new Error('Период не может быть пустым');
        }
        return await reportsRepository.create(data, ownerId);
    },

    async deleteReport(id: number, ownerId: string) {
        const report = await reportsRepository.getById(id, ownerId);
        if (!report) {
            throw new Error('Отчёт не найден');
        }

        return await reportsRepository.delete(id);
    }
};
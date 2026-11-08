import type { CreateReportDTO, UpdateReportDTO } from "../../shared/types.ts";
import { reportsRepository } from "../repositories/reports.ts";

export const reportService = {
    async getAllReports() {
        return await reportsRepository.getAll();
    },
    async getReportById(id: number) {
        const report = await reportsRepository.getById(id);
        if (!report) {
            throw new Error('Отчёт не найден');
        }
        return report;
    },
    
    async createReport(data: CreateReportDTO) {
        if (!data.period || data.period.trim() == '') {
            throw new Error('Период не может быть пустым');
        }
        if (!data.type || data.type.trim() == '') {
            throw new Error('Тип не может быть пустым');
        }
        return await reportsRepository.create(data); 
    },

    async updateReport(id: number, data: UpdateReportDTO) {
        const report = await reportsRepository.getById(id);
        if (!report) {
            throw new Error('Отчёт не найден')
        }
        if (data.period !== undefined && data.period.trim() === '') {
            throw new Error('Период не может быть пустым');
        }
        if (data.type !== undefined && data.type.trim() === '') {
            throw new Error('Тип не может быть пустым');
        }

        return await reportsRepository.update(id, data);
    },

    async deleteReport(id: number) {
        const report = await reportsRepository.getById(id);
        if (!report) {
            throw new Error('Отчёт не найден');
        }

        return await reportsRepository.delete(id);
    }
};
import type { FastifyInstance } from "fastify";
import type { CreateReportDTO } from "../../shared/types.ts";
import { reportService } from "../services/reportService.ts";

export async function reportsRoutes(fastify: FastifyInstance) {
    fastify.get('/reports', {
        schema: {
            tags: ['Reports'],
            description: 'Получение всех отчётов',
            response: {
                200: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'number' },
                            period: { type: 'string' },
                            totalIncome: { type: 'number' },
                            totalExpense: { type: 'number' },
                            balance: { type: 'number' },
                            createdAt: { type: 'string' },
                        }
                    }
                }
            }
        }
    }, async (request, reply) => {
        const userId = request.userId!;
        return await reportService.getAllReports(userId);
    });

    fastify.get('/reports/:id', {
        schema: {
            tags: ['Reports'],
            description: 'Получить отчёт по ID',
            params: { type: 'object', properties: { id: { type: 'number' } } }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: number };
        const userId = request.userId!;
        try {
            const report = await reportService.getReportById(id, userId);
            return reply.code(200).send(report);
        } catch (error: any) {
            if (error.message === 'Отчёт не найден') {
                return reply.code(404).send({ error: error.message });
            }
            return reply.code(400).send({ error: error.message });
        }
    });

    fastify.post('/reports', {
        schema: {
            tags: ['Reports'],
            description: 'Создание отчёта',
            body: {
                type: 'object',
                required: ['period', 'totalIncome', 'totalExpense', 'balance', 'data'],
                properties: {
                    period: { type: 'string', description: 'Период' },
                    totalIncome: { type: 'number', description: 'Сумма доходов' },
                    totalExpense: { type: 'number', description: 'Сумма расходов' },
                    balance: { type: 'number', description: 'Баланс' },
                    data: { type: 'array', description: 'Данные транзакций' }, // JSON
                }
            }
        }
    }, async (request, reply) => {
        const body = request.body as CreateReportDTO;
        const userId = request.userId!;
        try {
            const newReport = await reportService.createReport(body, userId);
            return reply.code(201).send(newReport);
        } catch (error: any) {
            return reply.code(400).send({ error: error.message });
        }
    });

    fastify.delete('/reports/:id', {
        schema: {
            tags: ['Reports'],
            description: 'Удалить отчёт',
            params: { type: 'object', properties: { id: { type: 'number' } } }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: number };
        const userId = request.userId!;
        try {
            await reportService.deleteReport(id, userId);
            return reply.code(204).send();
        } catch (error: any) {
            if (error.message === 'Отчёт не найден') {
                return reply.code(404).send({ error: error.message });
            }
            return reply.code(400).send({ error: error.message })
        }
    });
}
import type { FastifyInstance } from "fastify";
import type { CreateReportDTO, UpdateReportDTO } from "../../shared/types.ts";
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
                            pondId: { type: 'number', nullable: true },
                            period: { type: 'string' },
                            type: { type: 'string' },
                        }
                    }
                }
            }
        }
    }, async (request, reply) => {
        return await reportService.getAllReports();
    });

    fastify.get('/reports/:id', {
        schema: {
            tags: ['Reports'],
            description: 'Получить отчёт по ID',
            params: { type: 'object', properties: { id: { type: 'number' } } }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: number };
        try {
            const report = await reportService.getReportById(id);
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
                required: ['period', 'type'],
                properties: {
                    pondId: { type: 'number', description: 'ID пруда' },
                    period: { type: 'string', description: 'Период' },
                    type: { type: 'string', description: 'Тип отчёта' },
                }
            }
        }
    }, async (request, reply) => {
        const body = request.body as CreateReportDTO;
        try {
            const newReport = await reportService.createReport(body);
            return reply.code(201).send(newReport);
        } catch (error: any) {
            return reply.code(400).send({ error: error.message });
        }
    });

    fastify.patch('/reports/:id', {
        schema: {
            tags: ['Reports'],
            description: 'Обновление данных отчёта',
            params: { type: 'object', properties: { id: { type: 'number' } } },
            body: {
                type: 'object',
                 properties: {
                    pondId: { type: 'number' },
                    period: { type: 'string' },
                    type: { type: 'string' },  
                }
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: number };
        const body = request.body as UpdateReportDTO;

        try {
            const updated = await reportService.updateReport(id, body);
            return reply.code(200).send(updated);
        } catch (error: any) {
            if (error.message === 'Отчёт не найден') {
                return reply.code(404).send({ error: error.message });
            }
            return reply.code(400).send({ error: error.message })
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
        try {
            await reportService.deleteReport(id);
            return reply.code(204).send();
        } catch (error: any) {
            if (error.message === 'Отчёт не найден') {
                return reply.code(404).send({ error: error.message });
            }
            return reply.code(400).send({ error: error.message })
        }
    });
}
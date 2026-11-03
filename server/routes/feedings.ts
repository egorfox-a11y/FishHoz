import type { FastifyInstance } from "fastify";
import { feedingService } from "../services/feedingService.ts";
import type { CreateFeedingDTO, UpdateFeedingDTO } from "../types.ts";

export async function feedingRoutes(fastify: FastifyInstance) {
    fastify.get('/feedings', {
        schema: {
            tags: ['Feedings'],
            description: 'Получить все записи о кормлении',
            response: {
                200: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'number' },
                            pondId: { type: 'number' },
                            amount: { type: 'number' },
                            feedType: { type: 'string', nullable: true },
                            fedAt: { type: 'string' }
                        }
                    }
                }
            }
        }
    }, async (request, reply) => {
        return await feedingService.getAllFeedings();
    });

    fastify.get('/feedings/:id', {
        schema: {
            tags: ['Feedings'],
            description: 'Получить запись о кормлении по ID',
            params: { type: 'object', properties: { id: { type: 'number' } } }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: number };
        try {
            const feeding = await feedingService.getFeedingById(id);
            return await reply.code(200).send(feeding);
        } catch (error: any) {
            if (error.message === 'Запись о кормлении не найдена') {
                return await reply.code(404).send({ error: error.message });
            }
            return await reply.code(400).send({ error: error.message })
        }
    });

    fastify.post('/feedings', {
        schema: {
            tags: ['Feedings'],
            description: 'Создание записи о кормлении',
            body: {
                type: 'object',
                required: ['pondId', 'amount'],
                properties: {
                    pondId: { type: 'number', description: 'ID пруда' },
                    amount: { type: 'number', description: 'Количество корма' },
                    feedType: { type: 'string', description: 'Тип корма (опционально)' }
                }
            }
        }
    }, async (request, reply) => {
        const body = request.body as CreateFeedingDTO;
        try {
            const newFeeding = await feedingService.createFeeding(body);
            return reply.code(201).send(newFeeding);
        } catch (error: any) {
            return reply.code(400).send({ error: error.message })
        }
    });

    fastify.patch('/feedings/:id', {
        schema: {
            description: 'Обновить запись о кормлении',
            tags: ['Feedings'],
            params: { type: 'object', properties: { id: { type: 'number' } } },
            body: {
                type: 'object',
                properties: {
                    pondId: { type: 'number' },
                    amount: { type: 'number' },
                    feedType: { type: 'string' }
                }
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: number };
        const body = request.body as UpdateFeedingDTO;
        try {
            const updated = await feedingService.updateFeeding(id, body);
            return reply.code(200).send(updated);
        } catch (error: any) {
            if (error.message === 'Запись о кормлении не найдена') {
                return reply.code(404).send({ error: error.message });
            }
            return reply.code(400).send({ error: error.message });
        }
    });

    fastify.delete('/feedings/:id', {
        schema: {
            description: 'Удалить запись о кормлении',
            tags: ['Feedings'],
            params: { type: 'object', properties: { id: { type: 'number' } } }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: number };
        try {
            await feedingService.deleteFeeding(id);
            return reply.code(204).send(); // 204 No Content
        } catch (error: any) {
            if (error.message === 'Запись о кормлении не найдена') {
                return reply.code(404).send({ error: error.message });
            }
            return reply.code(400).send({ error: error.message });
        }
    });

}
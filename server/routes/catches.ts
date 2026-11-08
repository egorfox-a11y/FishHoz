import type { FastifyInstance } from "fastify";
import type { CreateCatchDTO, UpdateCatchDTO } from "../../shared/types.ts";
import { catchService } from "../services/catchService.ts";

export async function catchesRoutes(fastify: FastifyInstance) {
    fastify.get('/catches', {
        schema: {
            tags: ['Catches'],
            description: 'Получить все записи о выловах',
            response: {
                200: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'number' },
                            pondId: { type: 'number' },
                            speciesId: { type: 'number' },
                            quantity: { type: 'number'},
                            totalWeight: { type: 'number', nullable: true },
                            purpose: { type: 'string', nullable: true },
                            caughtAt: { type: 'string' }
                        }
                    }
                }
            }
        }
    }, async (request, repy) => {
        return await catchService.getAllCatches();
    });

    fastify.get('/catches/:id', {
        schema: {
            tags: ['Catches'],
            description: 'Получить запись о вылове по Id',
            params: { type: 'object', properties: { id: { type: 'number' } } }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: number };
        try {
            const catchItem = await catchService.getCatchById(id);
            return await reply.code(200).send(catchItem);
        } catch (error: any) {
            if (error.message === 'Запись о вылове не найдена') {
                return await reply.code(404).send({ error: error.message });
            }
            return await reply.code(400).send({ error: error.message });
        }
    });

    fastify.post('/catches', {
        schema: {
            tags: ['Catches'],
            description: 'Создать запись о вылове',
            body: {
                type: 'object',
                required: ['pondId', 'speciesId', 'quantity'],
                properties: {
                    pondId: { type: 'number', description: 'Id пруда' },
                    speciesId: { type: 'number', description: 'Id вида рыбы' },
                    quantity: { type: 'number', description: 'Количество' },
                    totalWeight: { type: 'number', description: 'Общий вес (опционально)' },
                    purpose: { type: 'string', description: 'Цель вылова (опционально)' }
                }
            }
        }
    }, async (request, reply) => {
        const body = request.body as CreateCatchDTO;
        try {
            const newCatch = await catchService.createCatch(body);
            return reply.code(201).send(newCatch);
        } catch (error: any) {
            if (error.message === 'Запись о вылове не найдена') {
                return reply.code(404).send({ error: error.message });
            }
            return reply.code(400).send({ error: error.message })
        }
    });

    fastify.patch('/catches/:id', {
        schema: {
            tags: ['Catches'],
            description: 'Обновить данные записи о вылове',
            params: { type: 'object', properties: { id: { type: 'number' } } },
            body: {
                type: 'object',
                properties: {
                    pondId: { type: 'number' },
                    speciesId: { type: 'number' },
                    quantity: { type: 'number' },
                    totalWeight: { type: 'number', nullable: true },
                    purpose: { type: 'string', nullable: true }
                }
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: number };
        const body = request.body as UpdateCatchDTO;
        try {
            const updated = await catchService.updateCatch(id, body);
            return reply.code(200).send(updated);
        } catch (error: any) {
            if (error.message === 'Запись о вылове не найдена') {
                return reply.code(404).send({ error: error.message });
            }
            return reply.code(400).send({ error: error.message });
        }
    });

    fastify.delete('/catches/:id', {
        schema: {
            tags: ['Catches'],
            description: 'Удалить запись о вылове',
            params: { type: 'object', properties: { id : { type: 'number' } } }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: number };
        try {
            await catchService.deleteCatch(id);
            return reply.code(204).send();
        } catch (error: any)  {
            if (error.message === 'Запись о вылове не найдена') {
                return reply.code(404).send({ error: error.message });
            }
            return reply.code(400).send({ error: error.message })
        }
    })
};
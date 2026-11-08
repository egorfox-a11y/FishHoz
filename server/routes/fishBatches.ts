import type { FastifyInstance } from "fastify";
import type { CreateFishBatchDTO, UpdateFishBatchDTO } from "../../shared/types.ts";
import { fishBatchService } from "../services/fishBatchesService.ts";

export async function fishBatchRoutes(fastify: FastifyInstance) {
    fastify.get('/fish-batches', {
    schema: {
        description: 'Получить список всех партий',
        tags: ['Fish Batches'],
        response: {
            200: {
                type: 'array',
                items: {           
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        pondId: { type: 'number' },
                        speciesId: { type: 'number', nullable: true },
                        speciesName: { type: 'string', nullable: true },
                        quantity: { type: 'number' },
                        avgWeight: { type: 'number', nullable: true },
                        launchDate: { type: 'string' }
                    }
                }                  
            }
        }
    }
}, async (request, reply) => {
    return await fishBatchService.getAllBatches();
});

    fastify.get('/fish-batches/:id', {
        schema: {
            description: 'Получить партию рыбы по ID',
            tags: ['Fish Batches'],
            params: { type: 'object', properties: { id: { type: 'number' } } }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: number };
        try {
            const batch = await fishBatchService.getBatchById(id);
            return reply.code(200).send(batch);
        } catch (error: any) {
            if (error.message === 'Партия рыбы не найдена') {
                return reply.code(404).send({ error: error.message })
            }
            return reply.code(400).send({ error: error.message })
        }
    });

    fastify.post('/fish-batches', {
        schema: {
            tags: ['Fish Batches'],
            description: 'Добавить партию рыбы',
            body: {
                type: 'object',
                required: ['pondId', 'quantity', 'launchDate'],
                properties: {
                    pondId: { type: 'number', description: 'ID пруда' },
                    speciesId: { type: 'number', description: 'ID вида рыбы (опционально)' },
                    quantity: { type: 'number', description: 'Количество рыбы' },
                    avgWeight: { type: 'number', description: 'Средний вес' },
                    launchDate: { type: 'string', description: 'Дата запуска (YYYY-MM-DD)' }
                }
            }
        }
    }, async (request, reply) => {
        const body = request.body as CreateFishBatchDTO;
        try {
            const newBatch = await fishBatchService.createBatch(body);
            return reply.code(200).send(newBatch);
        } catch (error: any) {
            return reply.code(400).send({ error: error.message });
        }
    });

    fastify.patch('/fish-batches/:id', {
        schema: {
            tags: ['Fish Batches'],
            description: 'Обновить данные партии рыбы',
            params: { type: 'object', properties: { id: { type: 'number' } } },
            body: {
                type: 'object',
                properties: {
                    pondId: { type: 'number' },
                    speciesId: { type: 'number' },
                    quantity: { type: 'number' },
                    avgWeight: { type: 'number' },
                    launchDate: { type: 'string' }
                }
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: number };
        const body = request.body as UpdateFishBatchDTO;
        try {
            const updateBatch = await fishBatchService.updateBatch(id, body);
            return reply.code(200).send(updateBatch);
        } catch (error: any) {
            if (error.message === 'Партия рыбы не найдена') {
                return reply.code(404).send({ error: error.message })
            }
        return reply.code(400).send({ error: error.message })
        }
    });

    fastify.delete('/fish-batches/:id', {
        schema:{
            tags: ['Fish Batches'],
            description: 'Удалить партию рыбы',
            params: { type: 'object', properties: { id: { type: 'number' } } }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: number };
        try {
            await fishBatchService.deleteBatch(id);
            return reply.code(204).send();
        } catch (error: any) {
            if (error.message === 'Партия рыбы не найдена') {
                return reply.code(404).send({ error: error.message })
            }
            return reply.code(400).send({ error: error.message })
        }
            
    });
}
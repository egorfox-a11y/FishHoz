import type { FastifyInstance } from "fastify";
import type { CreateSpeciesDTO, UpdateSpeciesDTO } from "../../shared/types.ts";
import { speciesService } from "../services/speciesService.ts";

export async function speciesRoutes(fastify: FastifyInstance) {
    fastify.get('/species', {
        schema: {
            tags: ['Species'],
            description: 'Получение всех видов рыбы',
            response: {
                200: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'number' },
                            name: { type: 'string'}, 
                            description: { type: 'string', nullable: true},
                            optimalTempMin: { type: 'number', nullable: true },
                            optimalTempMax: { type: 'number', nullable: true },
                            feedRate: { type: 'number', nullable: true },
                            growthRate: { type: 'number', nullable: true },
                            maturityMonths: { type: 'number', nullable: true },
                        }
                    }
                }
            }
        }
    }, async (request, reply) => {
        return await speciesService.getAllSpecies();
    });

    fastify.get('/species/:id', {
        schema: {
            tags: ['Species'],
            description: 'Получить вид рыбы по ID',
            params: { type: 'object', properties: { id: { type: 'number' } } }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: number };
        try {
            const species = await speciesService.getSpeciesById(id);
            return reply.code(200).send(species);
        } catch (error: any) {
            if (error.message === 'Вид рыбы не найден') {
                return reply.code(404).send({ error: error.message });
            }
            return reply.code(400).send({ error: error.message });
        }
    });

    fastify.post('/species', {
        schema: {
            tags: ['Species'],
            description: 'Создание вида рыбы',
            body: {
                type: 'object',
                required: ['name'],
                properties: {
                    name: { type: 'string'}, 
                    description: { type: 'string', description: 'Описание'},
                    optimalTempMin: { type: 'number', description: 'Оптимально минимальная температура' },
                    optimalTempMax: { type: 'number', description: 'Оптимально максимальная температура' },
                    feedRate: { type: 'number' },
                    growthRate: { type: 'number', description: 'Коэффицент роста' },
                    maturityMonths: { type: 'number', description: 'Количество месяцев до полового созревания' },
                }
            }
        }
    }, async (request, reply) => {
        const body = request.body as CreateSpeciesDTO;
        try {
            const newSpecies = await speciesService.createSpecies(body);
            return reply.code(201).send(newSpecies);
        } catch (error: any) {
            return reply.code(400).send({ error: error.message });
        }
    });

    fastify.patch('/species/:id', {
        schema: {
            tags: ['Species'],
            description: 'Обновление данных о виде рыбы',
            params: { type: 'object', properties: { id: { type: 'number' } } },
            body: {
                type: 'object',
                 properties: {
                    name: { type: 'string'}, 
                    description: { type: 'string' },
                    optimalTempMin: { type: 'number' },
                    optimalTempMax: { type: 'number' },
                    feedRate: { type: 'number' },
                    growthRate: { type: 'number' },
                    maturityMonths: { type: 'number' },
                        
                }
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: number };
        const body = request.body as UpdateSpeciesDTO;

        try {
            const updated = await speciesService.updateSpecies(id, body);
            return reply.code(200).send(updated);
        } catch (error: any) {
            if (error.message === 'Вид рыбы не найден') {
                return reply.code(404).send({ error: error.message });
            }
            return reply.code(400).send({ error: error.message })
        }
    });

    fastify.delete('/species/:id', {
        schema: {
            tags: ['Species'],
            description: 'Удалить вид рыбы',
            params: { type: 'object', properties: { id: { type: 'number' } } }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: number };
        try {
            await speciesService.deleteSpecies(id);
            return reply.code(204).send();
        } catch (error: any) {
            if (error.message === 'Вид рыбы не найден') {
                return reply.code(404).send({ error: error.message });
            }
            return reply.code(400).send({ error: error.message })
        }
    });
}
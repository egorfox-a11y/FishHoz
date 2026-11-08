import type { FastifyInstance } from 'fastify';
import type { CreatePondDTO, UpdatePondDTO } from '../../shared/types.ts';
import { pondService } from '../services/pondService.ts';

export async function pondRoutes(fastify: FastifyInstance) {

  fastify.get('/ponds', {
    schema: {
      description: 'Получить список всех прудов',
      tags: ['Ponds'], 
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              area: { type: 'number' },
              depth: { type: 'number' },
              createdAt: { type: 'string' }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    return await pondService.getAllPonds();
  });

  fastify.get('/ponds/:id', {
    schema: {
      tags: ['Ponds'],
      description: 'Получить пруд по ID',
      params: { type: 'object', properties: { id: { type: 'number' } } }
    }
  }, async (request, reply) => {
      const { id } = request.params as { id: number };
      try {
        const pond = await pondService.getPondById(id);
        return reply.code(200).send(pond);
      } catch (error: any) {
        if (error.message === 'Пруд не найден') {
          return reply.code(404).send({ error: error.message });
        }
        return reply.code(400).send({ error: error.message });
      }
  });

  fastify.post('/ponds', {
    schema: {
      description: 'Создать новый пруд',
      tags: ['Ponds'],
      body: {
        type: 'object',
        required: ['name'],
        properties: {
        name: { type: 'string', description: 'Название пруда' },
        area: { type: 'number', description: 'Площадь' },
        depth: { type: 'number', description: 'Глубина' }
      }
    }
  }
}, async (request, reply) => {
    const body = request.body as CreatePondDTO;

    try {
      const newPond = await pondService.createPond(body);
      return reply.code(201).send(newPond);
    } catch (error: any) {
        return reply.code(400).send({ error: error.message });
    }
});

  fastify.patch('/ponds/:id', {
    schema: {
      description: 'Обновить данные пруда',
      tags: ['Ponds'],
      params: { type: 'object', properties: { id: {type: 'number'} } },
      body: { type: 'object', properties: { name: {type: 'string'},
    area: { type: 'number' }, depth: { type: 'number' } } }
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: number };
    const body = request.body as UpdatePondDTO;
      try {
        const updatedPond = await pondService.updatePond(id, body)
        return reply.code(200).send(updatedPond);
      } catch(error: any) {
        if (error.message === 'Пруд не найден') {
          return reply.code(404).send({ error: error.message })
        }
        return reply.code(400).send({ error: error.message });
      }
  });

  fastify.delete('/ponds/:id', {
    schema: {
      description: 'Удалить пруд',
      tags: ['Ponds'],
      params: {
        type: 'object',
        properties: { id: { type: 'number' } }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: number };

    try {
      await pondService.deletePond(id);
      return reply.code(204).send();
    } catch (error: any) {
      if (error.message === 'Пруд не найден') {
        return reply.code(404).send({ error: error.message });
      }
      return reply.code(400).send({ error: error.message })
    }
  });
}
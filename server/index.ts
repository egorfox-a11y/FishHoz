import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import Fastify from 'fastify';
import { authHook } from './auth.ts';
import { catchesRoutes } from './routes/catches.ts';
import { feedingRoutes } from './routes/feedings.ts';
import { fishBatchRoutes } from './routes/fishBatches.ts';
import { pondRoutes } from './routes/ponds.ts';
import { reportsRoutes } from './routes/reports.ts';
import { speciesRoutes } from './routes/species.ts';
import { transactionRoutes } from './routes/transactions.ts';
import { supabaseAdmin } from './supabaseAdmin.ts';

export async function buildServer() {
  const fastify = Fastify({ logger: false }); 

  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'FishHoz API',
        description: 'API для учёта рыбного хозяйства',
        version: '1.0.0',
      },
      servers: [
        { url: 'http://localhost:3000', description: 'Локальный сервер' },
      ],
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/documentation', 
  });

  await fastify.register(cors, {
    origin: '*',
  });

  fastify.addHook('onRequest', authHook);

  fastify.delete('/api/v1/auth/delete-account', async (request, reply) => {
    try {
      const userId = request.userId;
      
      if (!userId) {
        return reply.code(401).send({ error: 'Неавторизован' });
      }

      const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

      if (error) {
        return reply.code(400).send({ error: error.message });
      }

      return reply.code(204).send(); 
    } catch (err) {
      console.error('Ошибка удаления аккаунта:', err);
      return reply.code(500).send({ error: 'Не удалось удалить аккаунт' });
    }
  });

  await fastify.register(pondRoutes, { prefix: '/api/v1' });
  await fastify.register(fishBatchRoutes, { prefix: '/api/v1' });
  await fastify.register(feedingRoutes, { prefix: '/api/v1' });
  await fastify.register(catchesRoutes, { prefix: '/api/v1' });
  await fastify.register(transactionRoutes, { prefix: '/api/v1' });
  await fastify.register(speciesRoutes, { prefix: '/api/v1' });
  await fastify.register(reportsRoutes, { prefix: '/api/v1' });

  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  return fastify; 
}

const start = async () => {
  try {
    const fastify = await buildServer();
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Сервер запущен на http://localhost:3000');
    console.log('Swagger доступен по адресу http://localhost:3000/documentation');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  start();
}
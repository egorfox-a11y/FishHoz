import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import Fastify from 'fastify';
import { feedingRoutes } from './routes/feedings.ts';
import { fishBatchRoutes } from './routes/fishBatches.ts';
import { pondRoutes } from './routes/ponds.ts';
import { catchesRoutes } from './routes/catches.ts';

const fastify = Fastify({ logger: true });

fastify.register(swagger, {
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

fastify.register(swaggerUi, {
  routePrefix: '/documentation', 
});

fastify.register(cors, {
  origin: '*',
});


fastify.register(pondRoutes, { prefix: '/api/v1' });

fastify.register(fishBatchRoutes, { prefix: '/api/v1' });

fastify.register(feedingRoutes, { prefix: '/api/v1' });

fastify.register(catchesRoutes, { prefix: '/api/v1' });

fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Сервер запущен на http://localhost:3000');
    console.log('Swagger доступен по адресу http://localhost:3000/documentation');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
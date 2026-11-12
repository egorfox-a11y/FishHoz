import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import type { FastifyReply, FastifyRequest } from 'fastify';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Не заданы SUPABASE_URL и SUPABASE_ANON_KEY в server/.env');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

declare module 'fastify' {
  interface FastifyRequest {
    userId?: string;
  }
}

const PUBLIC_PREFIXES = ['/health', '/documentation'];

export async function authHook(request: FastifyRequest, reply: FastifyReply) {
  if (request.method === 'OPTIONS') return;
  if (PUBLIC_PREFIXES.some((p) => request.url.startsWith(p))) return;

  const header = request.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return reply.code(401).send({ error: 'Нет токена авторизации' });
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error) {
    if (error.name === 'AuthRetryableFetchError') {
      request.log.error(error, 'Supabase недоступен');
      return reply.code(503).send({ error: 'Сервис авторизации недоступен' });
    }
    return reply.code(401).send({ error: 'Недействительный токен' });
  }

  if (!data.user) {
    return reply.code(401).send({ error: 'Недействительный токен' });
  }

  request.userId = data.user.id;
  console.log('AUTH HOOK: userId установлен:', request.userId);
}

declare module 'fastify' {
  interface FastifyRequest {
    userId?: string;
  }
}

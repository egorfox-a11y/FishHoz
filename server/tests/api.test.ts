import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { buildServer } from '../index.ts';

// 1. Мокаем authHook
vi.mock('../auth', () => ({
  authHook: async (request: any) => {
    request.userId = '07b3bb0e-8a9c-438c-b204-cbbadc11e9a0'; 
  }
}));

// 2. Мокаем репозиторий (просто и с «памятью»)
vi.mock('../repositories/ponds', () => {
  let mockPond: any = null; // «База» в памяти
  
  return {
    pondRepository: {
      getAll: vi.fn().mockImplementation(() => mockPond ? [mockPond] : []),
      getById: vi.fn().mockImplementation((id: number) => mockPond && mockPond.id === id ? mockPond : undefined),
      create: vi.fn().mockImplementation((data: any) => {
        mockPond = { id: 1, ...data, ownerId: '07b3bb0e-8a9c-438c-b204-cbbadc11e9a0' };
        return mockPond;
      }),
      update: vi.fn().mockImplementation((id: number, data: any) => {
        if (mockPond) mockPond = { ...mockPond, ...data };
        return mockPond;
      }),
      delete: vi.fn().mockImplementation(() => {
        mockPond = null;
        return undefined;
      }),
    }
  };
});

describe('Ponds API (CRUD + ошибка)', () => {
  let app: any;
  let createdPondId: number; 

  beforeAll(async () => {
    app = await buildServer();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  const uniqueName = `Тестовый пруд ${Date.now()}`;

  it('POST /ponds — должен создать пруд и вернуть 201', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/ponds',
      payload: { name: uniqueName, area: 100, depth: 5 },
    });
    
    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body.name).toBe(uniqueName); // Теперь мок вернет то, что мы передали
    createdPondId = body.id;
  });

  it('GET /ponds — должен вернуть список с созданным прудом и код 200', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/ponds',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(Array.isArray(body)).toBe(true);
    expect(body.some((p: any) => p.id === createdPondId)).toBe(true);
  });

  it('PATCH /ponds/:id — должен обновить имя пруда и вернуть 200', async () => {
    const response = await app.inject({
      method: 'PATCH',
      url: `/api/v1/ponds/${createdPondId}`,
      payload: { name: `${uniqueName} (обновленный)` },
    });
    
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.name).toBe(`${uniqueName} (обновленный)`);
  });

  it('DELETE /ponds/:id — должен удалить пруд и вернуть 204', async () => {
    expect(createdPondId).toBeDefined();
    const response = await app.inject({
      method: 'DELETE',
      url: `/api/v1/ponds/${createdPondId}`,
    });
    
    expect(response.statusCode).toBe(204);
    
    // Проверяем, что пруд удален
    const checkResponse = await app.inject({
      method: 'GET',
      url: `/api/v1/ponds/${createdPondId}`,
    });
    expect(checkResponse.statusCode).toBe(404);
  });

  it('POST /ponds — должен вернуть 400, если имя пустое', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/ponds',
      payload: { name: '', area: 100, depth: 5 },
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.error).toContain('Имя пруда'); 
  });
});
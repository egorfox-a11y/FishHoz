import type { FastifyInstance } from "fastify";
import type { CreateTransactionDTO, UpdateTransactionDTO } from "../../shared/types.ts";
import { transactionService } from "../services/transactionService.ts";

export async function transactionRoutes(fastify: FastifyInstance) {
    fastify.get('/transactions', {
        schema: {
            tags: ['Transactions'],
            description: 'Получение всех транзакций',
            response: {
                200: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'number' },
                            catchId: { type: 'number', nullable: true }, 
                            type: { 
                                type: 'string', 
                                enum: ['income', 'expense']
                            },
                            category: { type: 'string' },
                            amount: { type: 'number' },
                            transactionDate: { type: 'string' },
                            comment: { type: 'string', nullable: true }
                        }
                    }
                }
            }
        }
    }, async (request, reply) => {
        return await transactionService.getAllTransactions();
    });

    fastify.get('/transactions/:id', {
        schema: {
            tags: ['Transactions'],
            description: 'Получить транзакцию по ID',
            params: { type: 'object', properties: { id: { type: 'number' } } }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: number };
        try {
            const transaction = await transactionService.getTransactionById(id);
            return reply.code(200).send(transaction);
        } catch (error: any) {
            if (error.message === 'Транзакция не найдена') {
                return reply.code(404).send({ error: error.message });
            }
            return reply.code(400).send({ error: error.message });
        }
    });

    fastify.post('/transactions', {
        schema: {
            tags: ['Transactions'],
            description: 'Создание транзакции',
            body: {
                type: 'object',
                required: ['type', 'category', 'amount', 'transactionDate'],
                properties: {
                    catchId: { type: 'number', description: 'ID вылова' },
                    type: { 
                        type: 'string', 
                        enum: ['income', 'expense'], 
                        description: 'Тип: доход или расход' 
                    },
                    category: { type: 'string', description: 'Категория' },
                    amount: { type: 'number', description: 'Количество' },
                    transactionDate: { type: 'string', description: 'Дата транзакции' },
                    comment: { type: 'string', description: 'Комментарий' }
                }
            }
        }
    }, async (request, reply) => {
        const body = request.body as CreateTransactionDTO;
        try {
            const newTransaction = await transactionService.createTransaction(body);
            return reply.code(201).send(newTransaction);
        } catch (error: any) {
            return reply.code(400).send({ error: error.message });
        }
    });

    fastify.patch('/transactions/:id', {
        schema: {
            tags: ['Transactions'],
            description: 'Обновить данные транзакции',
            params: { type: 'object', properties: { id: { type: 'number' } } },
            body: {
                type: 'object',
                 properties: {
                    catchId: { type: 'number' }, 
                    type: { 
                        type: 'string', 
                        enum: ['income', 'expense']
                    },
                    category: { type: 'string' },
                    amount: { type: 'number' },
                    transactionDate: { type: 'string' },
                    comment: { type: 'string' }
                }
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: number };
        const body = request.body as UpdateTransactionDTO;

        try {
            const updated = await transactionService.updateTransaction(id, body);
            return reply.code(200).send(updated);
        } catch (error: any) {
            if (error.message === 'Транзакция не найдена') {
                return reply.code(404).send({ error: error.message });
            }
            return reply.code(400).send({ error: error.message })
        }
    });

    fastify.delete('/transactions/:id', {
        schema: {
            tags: ['Transactions'],
            description: 'Удалить транзакцию',
            params: { type: 'object', properties: { id: { type: 'number' } } }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: number };
        try {
            await transactionService.deleteTransaction(id);
            return reply.code(204).send();
        } catch (error: any) {
            if (error.message === 'Транзакция не найдена') {
                return reply.code(404).send({ error: error.message });
            }
            return reply.code(400).send({ error: error.message })
        }
    });
}
import { and, eq } from 'drizzle-orm'; // <-- Добавили and
import type { CreateTransactionDTO, Transaction, UpdateTransactionDTO } from '../../shared/types.ts';
import { db } from '../db/index.ts';
import { transactions } from '../db/schema.ts';

export const transactionRepository = {

    async getById(id: number, ownerId: string): Promise<Transaction | undefined> {
        const result = await db.select()
            .from(transactions)
            .where(and(eq(transactions.id, id), eq(transactions.ownerId, ownerId)));
        return result[0];
    },

    async getAll(ownerId: string): Promise<Transaction[]> {
        return await db.select().from(transactions).where(eq(transactions.ownerId, ownerId));
    },

    async create(data: Omit<CreateTransactionDTO, 'ownerId'>, ownerId: string): Promise<Transaction> {
        const result = await db.insert(transactions)
            .values({ ...data, ownerId }) 
            .returning();
        return result[0]!;
    },

    async update(id: number, data: UpdateTransactionDTO): Promise<Transaction> {
        const result = await db.update(transactions)
            .set(data)
            .where(eq(transactions.id, id))
            .returning();
        return result[0]!;
    },

    async delete(id: number): Promise<void> {
        await db.delete(transactions).where(eq(transactions.id, id));
    }
};
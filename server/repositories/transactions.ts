import { eq } from 'drizzle-orm';
import type { CreateTransactionDTO, Transaction, UpdateTransactionDTO } from '../../shared/types.ts';
import { db } from '../db/index.ts';
import { transactions } from '../db/schema.ts';

export const transactionRepository = {

    async getById(id: number): Promise<Transaction | undefined> {
        const result = await db.select().from(transactions).where(eq(transactions.id, id));
        return result[0];
    },
    async getAll(): Promise<Transaction[]> {
        return await db.select().from(transactions);
    },
    async create(data: CreateTransactionDTO): Promise<Transaction> {
        const result = await db.insert(transactions).values(data).returning();
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
        await db.delete(transactions).where(eq(transactions.id, id)).returning();
    }
};
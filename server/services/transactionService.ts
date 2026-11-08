import type { CreateTransactionDTO, UpdateTransactionDTO } from "../../shared/types.ts";
import { transactionRepository } from "../repositories/transactions.ts";

export const transactionService = {
    async getAllTransactions() {
        return await transactionRepository.getAll();
    },

    async getTransactionById(id: number) {
        const transaction = await transactionRepository.getById(id);
        if (!transaction) {
            throw new Error('Транзакция не найдена');
        }
        return transaction;
    },

    async createTransaction(data: CreateTransactionDTO) {
        if (!data.category || data.category.trim() == '') {
            throw new Error('Категория не может быть пустой');
        }
        if (!data.amount || data.amount <= 0) {
            throw new Error('Колличество должно быть больше нуля');
        }
        if (!data.transactionDate || data.transactionDate.trim() == '') {
            throw new Error('Дата не может быть пустой')
        }
        return await transactionRepository.create(data);
    },

    async updateTransaction(id: number, data: UpdateTransactionDTO) {
        const transaction = await transactionRepository.getById(id);
        if (!transaction) {
            throw new Error('Транзакция не найдена');
        }
        if (data.category !== undefined && data.category.trim() == '') {
            throw new Error('Категория не может быть пустой');
        }
        if (data.amount !== undefined && data.amount <= 0) {
            throw new Error('Колличество должно быть больше нуля');
        }
        if (data.transactionDate !== undefined && data.transactionDate.trim() == '') {
            throw new Error('Дата не может быть пустой')
        }
        return await transactionRepository.update(id, data)
    },

    async deleteTransaction(id: number) {
        const transaction = await transactionRepository.getById(id);
        if (!transaction) {
            throw new Error('Транзакция не найдна');
        }
        return await transactionRepository.delete(id);
    }
};
import type { CreateTransactionDTO, Transaction, UpdateTransactionDTO } from '../../shared/types';
import { httpClient } from './httpClient';

export const transactionApi = {
  getAll: () => httpClient.get<Transaction[]>('/transactions'),
  
  getById: (id: number) => httpClient.get<Transaction>(`/transactions/${id}`),
  
  create: (data: Omit<CreateTransactionDTO, 'ownerId'>) => 
    httpClient.post<Transaction>('/transactions', data),
    
  update: (id: number, data: Omit<UpdateTransactionDTO, 'ownerId'>) => 
    httpClient.patch<Transaction>(`/transactions/${id}`, data),
    
  delete: (id: number) => httpClient.delete<void>(`/transactions/${id}`),
};
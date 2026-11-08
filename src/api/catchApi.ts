import type { Catch, CreateCatchDTO, UpdateCatchDTO } from '../../shared/types';
import { httpClient } from './httpClient';

export const catchApi = {
  getAll: () => httpClient.get<Catch[]>('/catches'),
  
  getById: (id: number) => httpClient.get<Catch>(`/catches/${id}`),
  
  create: (data: Omit<CreateCatchDTO, 'ownerId'>) => 
    httpClient.post<Catch>('/catches', data),
    
  update: (id: number, data: Omit<UpdateCatchDTO, 'ownerId'>) => 
    httpClient.patch<Catch>(`/catches/${id}`, data),
    
  delete: (id: number) => httpClient.delete<void>(`/catches/${id}`),

    getByPondId: async (pondId: number) => {
    const allCatches = await httpClient.get<Catch[]>('/catches');
    return allCatches.filter(c => c.pondId === pondId);
  },
};
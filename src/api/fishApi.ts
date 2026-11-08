import type { CreateFishBatchDTO, FishBatch, UpdateFishBatchDTO } from '../../shared/types';
import { httpClient } from './httpClient';

export const fishApi = {
  getAll: () => httpClient.get<FishBatch[]>('/fish-batches'),
  
  getById: (id: number) => httpClient.get<FishBatch>(`/fish-batches/${id}`),
  
  create: (data: Omit<CreateFishBatchDTO, 'ownerId'>) => 
    httpClient.post<FishBatch>('/fish-batches', data),
    
  update: (id: number, data: Omit<UpdateFishBatchDTO, 'ownerId'>) => 
    httpClient.patch<FishBatch>(`/fish-batches/${id}`, data),
    
  delete: (id: number) => httpClient.delete<void>(`/fish-batches/${id}`),

  getByPondId: async (pondId: number) => {
    const allBatches = await httpClient.get<FishBatch[]>('/fish-batches');
    return allBatches.filter(batch => batch.pondId === pondId);
  }
};
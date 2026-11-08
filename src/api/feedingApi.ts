import type { CreateFeedingDTO, Feeding, UpdateFeedingDTO } from '../../shared/types';
import { httpClient } from './httpClient';

export const feedingApi = {
  getAll: () => httpClient.get<Feeding[]>('/feedings'),
  
  getById: (id: number) => httpClient.get<Feeding>(`/feedings/${id}`),
  
  create: (data: Omit<CreateFeedingDTO, 'ownerId'>) => 
    httpClient.post<Feeding>('/feedings', data),
    
  update: (id: number, data: Omit<UpdateFeedingDTO, 'ownerId'>) => 
    httpClient.patch<Feeding>(`/feedings/${id}`, data),
    
  delete: (id: number) => httpClient.delete<void>(`/feedings/${id}`),
};
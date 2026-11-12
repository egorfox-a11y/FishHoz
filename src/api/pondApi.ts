import { CreatePondDTO, Pond, UpdatePondDTO } from '../../shared/types';
import { httpClient } from './httpClient';

export const pondApi = {
  getAll: () => httpClient.get<Pond[]>('/ponds'),

  getById: (id: number) => httpClient.get<Pond>(`/ponds/${id}`),

  create: (data: CreatePondDTO) => httpClient.post<Pond>('/ponds', data),

  update: (id: number, data: UpdatePondDTO) => 
    httpClient.patch<Pond>(`/ponds/${id}`, data),
    
  delete: (id: number) => httpClient.delete<void>(`/ponds/${id}`),
};
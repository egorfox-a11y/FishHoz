import type { CreateSpeciesDTO, FishSpecies, UpdateSpeciesDTO } from '../../shared/types';
import { httpClient } from './httpClient';

export const speciesApi = {
  getAll: () => httpClient.get<FishSpecies[]>('/species'),
  
  getById: (id: number) => httpClient.get<FishSpecies>(`/species/${id}`),
  
  create: (data: CreateSpeciesDTO) => 
    httpClient.post<FishSpecies>('/species', data),
    
  update: (id: number, data: UpdateSpeciesDTO) => 
    httpClient.patch<FishSpecies>(`/species/${id}`, data),
    
  delete: (id: number) => httpClient.delete<void>(`/species/${id}`),
};
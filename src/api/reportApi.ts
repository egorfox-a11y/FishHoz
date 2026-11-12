import type { CreateReportDTO, Report } from '../../shared/types';
import { httpClient } from './httpClient';

export const reportApi = {
  getAll: () => httpClient.get<Report[]>('/reports'),
  
  getById: (id: number) => httpClient.get<Report>(`/reports/${id}`),
  
  create: (data: Omit<CreateReportDTO, 'ownerId'>) => 
    httpClient.post<Report>('/reports', data),
    
  delete: (id: number) => httpClient.delete<void>(`/reports/${id}`),
};
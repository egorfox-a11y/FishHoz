import type { CreateReportDTO, Report, UpdateReportDTO } from '../../shared/types';
import { httpClient } from './httpClient';

export const reportApi = {
  // 1. Получить все отчеты
  getAll: () => httpClient.get<Report[]>('/reports'),
  
  // 2. Получить один отчет по ID
  getById: (id: number) => httpClient.get<Report>(`/reports/${id}`),
  
  // 3. Создать отчет
  create: (data: Omit<CreateReportDTO, 'ownerId'>) => 
    httpClient.post<Report>('/reports', data),
    
  // 4. Обновить отчет
  update: (id: number, data: Omit<UpdateReportDTO, 'ownerId'>) => 
    httpClient.patch<Report>(`/reports/${id}`, data),
    
  // 5. Удалить отчет
  delete: (id: number) => httpClient.delete<void>(`/reports/${id}`),
};
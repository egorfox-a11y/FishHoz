export type User = {
    id: string;
    email: string;
    role: 'owner' | 'worker';
};

export type Pond = {
  id: number;
  name: string;
  area: number | null;
  depth: number | null;
  ownerId: string;
  createdAt: string | null;
};

export type FishSpecies = {
  id: number;
  name: string;
  description: string | null;
  optimalTempMin: number | null;
  optimalTempMax: number | null;
  feedRate: number | null;
  growthRate: number | null;
  maturityMonths: number | null;
};

export type FishBatch = {
  id: number;
  pondId: number;
  speciesId: number | null;
  quantity: number;
  avgWeight: number | null;
  launchDate: string;
   speciesName?: string;
};

export type Feeding = {
  id: number;
  pondId: number;
  amount: number;
  feedType: string | null;
  fedAt: string;
};

export type Catch = {
  id: number;
  pondId: number;
  speciesId: number | null;
  quantity: number;
  totalWeight: number | null;
  purpose: string | null;
  caughtAt: string;
};

export type Transaction = {
  id: number;
  catchId: number | null;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  transactionDate: string;
  comment: string | null;
};

export type Report = {
  id: number;
  ownerId: string;
  period: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  data: any;
  createdAt: string | null;
};

export type CreatePondDTO = {
  name: string;
  area?: number | null;
  depth?: number | null;
  ownerId?: string;
};

export type CreateFishBatchDTO = {
  pondId: number;
  speciesId?: number | null;
  quantity: number;
  avgWeight?: number | null;
  launchDate: string;
  ownerId?: string;
};

export type CreateSpeciesDTO = {
  name: string;
  description?: string | null; 
  optimalTempMin?: number | null;
  optimalTempMax?: number | null;
  feedRate?: number | null; 
  growthRate?: number | null; 
  maturityMonths?: number | null; 
};

export type CreateFeedingDTO = {
  pondId: number;
  amount: number;
  feedType?: string | null;
  ownerId?: string;
};

export type CreateCatchDTO = {
  pondId: number;
  speciesId: number;
  quantity: number;
  totalWeight?: number | null;
  purpose?: string | null;
  ownerId?: string;
};

export type CreateTransactionDTO = {
  catchId?: number | null;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  transactionDate: string;
  comment?: string | null;
  ownerId?: string;
};

export type CreateReportDTO = {
  period: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  data: any;
  ownerId?: string;
};

export type UpdatePondDTO = Partial<CreatePondDTO>;
export type UpdateFishBatchDTO = Partial<CreateFishBatchDTO>;
export type UpdateFeedingDTO = Partial<CreateFeedingDTO>;
export type UpdateSpeciesDTO = Partial<CreateSpeciesDTO>;
export type UpdateCatchDTO = Partial<CreateCatchDTO>;
export type UpdateTransactionDTO = Partial<CreateTransactionDTO>;
export type UpdateReportDTO = Partial<CreateReportDTO>;
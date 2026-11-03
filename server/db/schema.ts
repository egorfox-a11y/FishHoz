import {
  bigint,
  date,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const fishSpecies = pgTable('fish_species', {
    id: bigint('id', {mode: 'number'}).primaryKey().generatedAlwaysAsIdentity(),
    name: text('name').notNull(),
    description: text('description'),
    optimalTempMin: numeric('optimal_temp_min', { mode: 'number' }),
    optimalTempMax: numeric('optimal_temp_max', { mode: 'number' }),
    feedRate: numeric('feed_rate', { mode: 'number' }),
    growthRate: numeric('growth_rate', { mode: 'number' }),
    maturityMonths: integer('maturity_months'),
});

export const ponds = pgTable('ponds', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
  area: numeric('area', { mode: 'number' }),
  depth: numeric('depth', { mode: 'number' }),
  createdAt: timestamp('created_at', {mode: 'string'}).defaultNow(),
});

export const fishBatches = pgTable('fish_batches', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  pondId: bigint('pond_id', { mode: 'number' })
    .references(() => ponds.id, { onDelete: 'cascade' })
    .notNull(),
  speciesId: bigint('species_id', { mode: 'number' })
    .references(() => fishSpecies.id, { onDelete: 'set null' }),
  quantity: integer('quantity').notNull(),
  avgWeight: numeric('avg_weight', { mode: 'number' }),
  launchDate: date('launch_date').notNull(),
});

export const feedings = pgTable('feedings', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  pondId: bigint('pond_id', { mode: 'number' })
    .references(() => ponds.id, { onDelete: 'cascade' })
    .notNull(),
  amount: numeric('amount', { mode: 'number' }).notNull(),
  feedType: text('feed_type'),
  fedAt: timestamp('fed_at', { mode: 'string' }).defaultNow().notNull(),
});

export const catches = pgTable('catches', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  pondId: bigint('pond_id', { mode: 'number' })
    .references(() => ponds.id, { onDelete: 'cascade' })
    .notNull(),
  species: text('species').notNull(),
  quantity: integer('quantity').notNull(),
  totalWeight: numeric('total_weight', { mode: 'number' }),
  purpose: text('purpose'),
  caughtAt: timestamp('caught_at').defaultNow().notNull(),
});

export const transactions = pgTable('transactions', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  catchId: bigint('catch_id', { mode: 'number' })
    .references(() => catches.id, { onDelete: 'set null' }),
  type: text('type').notNull(),
  category: text('category').notNull(),
  amount: numeric('amount', { mode: 'number' }).notNull(),
  transactionDate: date('transaction_date').notNull(),
  comment: text('comment'),
});

export const reports = pgTable('reports', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  pondId: bigint('pond_id', { mode: 'number' })
    .references(() => ponds.id, { onDelete: 'set null' }),
  period: text('period').notNull(),
  type: text('type').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
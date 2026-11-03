import { supabase } from '../api/supabaseClient';
import type { CreateFishBatchDTO, FishBatch, FishSpecies, UpdateFishBatchDTO } from '@/server/types';

export const fishRepository = {

  async getAll(): Promise<FishBatch[]> {
    const { data, error } = await supabase
      .from('fish_batches')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data as FishBatch[];
  },

  async getByPond(pondId: number): Promise<FishBatch[]> {
    const { data, error } = await supabase
      .from('fish_batches')
      .select('*, fish_species(name)')
      .eq('pond_id', pondId)
      .order('id', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

     return data.map((item: any) => ({
    id: item.id,
    pondId: item.pond_id,
    speciesId: item.species_id,
    quantity: item.quantity,
    avgWeight: item.avg_weight,
    launchDate: item.launch_date,
    ownerId: item.owner_id,
    speciesName: item.fish_species?.name || 'Неизвестно', 
  })) as FishBatch[];
},

  async getById(id: number): Promise<FishBatch | null> {
    const { data, error } = await supabase
      .from('fish_batches')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return null;
    }

    return data as FishBatch;
  },

  async add(batch: CreateFishBatchDTO): Promise<FishBatch> {
    const { data, error } = await supabase
      .from('fish_batches')
      .insert({
        pond_id: batch.pondId,
        species_id: batch.speciesId,
        quantity: batch.quantity,
        avg_weight: batch.avgWeight,
        launch_date: batch.launchDate,
        owner_id: batch.ownerId,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as FishBatch;
  },

  async update(id: number, batch: UpdateFishBatchDTO): Promise<FishBatch> {
    const { data, error } = await supabase
      .from('fish_batches')
      .update({
      pond_id: batch.pondId,
      species_id: batch.speciesId,
      quantity: batch.quantity,
      avg_weight: batch.avgWeight,
      launch_date: batch.launchDate,
    })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as FishBatch;
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('fish_batches')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  },
  async getAllSpecies(): Promise<FishSpecies[]> {
    const { data, error } = await supabase
      .from('fish_species')
      .select('*')
      .order('name');

    if (error) throw new Error(error.message);
    return data as FishSpecies[];
  },
};

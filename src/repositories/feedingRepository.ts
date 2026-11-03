import { supabase } from '../api/supabaseClient';
import type { CreateFeedingDTO, Feeding, UpdateFeedingDTO } from '../types/types';

export const feedingRepository = {

  async getAll(): Promise<Feeding[]> {
    const { data, error } = await supabase
      .from('feedings')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data as Feeding[];
  },

  async getByPond(pondId: number): Promise<Feeding[]> {
    const { data, error } = await supabase
      .from('feedings')
      .select('*')
      .eq('pond_id', pondId)
      .order('fed_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data as Feeding[];
  },

  async getById(id: number): Promise<Feeding | null> {
    const { data, error } = await supabase
      .from('feedings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return null;
    }

    return data as Feeding;
  },

  async add(feeding: CreateFeedingDTO): Promise<Feeding> {
    const { data, error } = await supabase
      .from('feedings')
      .insert({
        pond_id: feeding.pondId,
        amount: feeding.amount,
        feed_type: feeding.feedType,
        owner_id: feeding.ownerId,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as Feeding;
  },

  async update(id: number, feeding: UpdateFeedingDTO): Promise<Feeding> {
    const { data, error } = await supabase
      .from('feedings')
      .update({
      pond_id: feeding.pondId,
      amount: feeding.amount,
      feed_type: feeding.feedType,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as Feeding;
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('feedings')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  },
};
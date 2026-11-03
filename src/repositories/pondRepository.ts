import { supabase } from "../api/supabaseClient";
import type { CreatePondDTO, Pond, UpdatePondDTO } from '../types/types';

export const pondRepository = {
    async getAll(): Promise<Pond[]> {
        const { data, error } = await supabase
        .from('ponds')
        .select('*')
        .order('id', { ascending: true });

        if (error) {
            throw new Error(error.message);
        }
        return data as Pond[];
    },

    async getById(id: number): Promise<Pond | null> {
      const  { data, error } = await supabase
      .from('ponds')
      .select('*')
      .eq('id', id)
      .single()

      if (error) {
        return null;
      };
      
      return data as Pond;
    },

async add(pond: CreatePondDTO): Promise<Pond> {
    const { data, error } = await supabase
      .from('ponds')
      .insert({
        name: pond.name,
        area: pond.area,
        depth: pond.depth,
        owner_id: pond.ownerId,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as Pond;
  },

  async update(id: number, pond: UpdatePondDTO): Promise<Pond> {
    const { data, error } = await supabase
      .from('ponds')
      .update({
      name: pond.name,
      area: pond.area,
      depth: pond.depth,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as Pond;
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('ponds')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  },
};
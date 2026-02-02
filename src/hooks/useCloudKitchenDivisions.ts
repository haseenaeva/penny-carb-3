import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Division {
  id: string;
  name: string;
  slot_type: string;
  start_time: string;
  end_time: string;
  cutoff_hours_before: number;
  is_active: boolean;
  display_order: number;
  food_items_count?: number;
}

export function useCloudKitchenDivisions() {
  return useQuery({
    queryKey: ['cloud-kitchen-divisions'],
    queryFn: async () => {
      // Get slots with count of assigned food items
      const { data: slots, error } = await supabase
        .from('cloud_kitchen_slots')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;

      // Get count of food items for each slot
      const divisionsWithCounts = await Promise.all(
        (slots || []).map(async (slot) => {
          const { count } = await supabase
            .from('food_items')
            .select('*', { count: 'exact', head: true })
            .eq('cloud_kitchen_slot_id', slot.id)
            .eq('is_available', true);

          return {
            ...slot,
            food_items_count: count || 0,
          };
        })
      );

      return divisionsWithCounts as Division[];
    },
  });
}

export function useCreateDivision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      slot_type: string;
      start_time: string;
      end_time: string;
      cutoff_hours_before: number;
    }) => {
      const { data: result, error } = await supabase
        .from('cloud_kitchen_slots')
        .insert({
          name: data.name,
          slot_type: data.slot_type.toLowerCase().replace(/\s+/g, '_'),
          start_time: data.start_time,
          end_time: data.end_time,
          cutoff_hours_before: data.cutoff_hours_before,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cloud-kitchen-divisions'] });
      toast({ title: 'Division created successfully' });
    },
    onError: (error) => {
      toast({
        title: 'Failed to create division',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateDivision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: string;
      name?: string;
      start_time?: string;
      end_time?: string;
      cutoff_hours_before?: number;
      is_active?: boolean;
    }) => {
      const { data: result, error } = await supabase
        .from('cloud_kitchen_slots')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cloud-kitchen-divisions'] });
      toast({ title: 'Division updated successfully' });
    },
    onError: (error) => {
      toast({
        title: 'Failed to update division',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteDivision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cloud_kitchen_slots')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cloud-kitchen-divisions'] });
      toast({ title: 'Division deleted successfully' });
    },
    onError: (error) => {
      toast({
        title: 'Failed to delete division',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

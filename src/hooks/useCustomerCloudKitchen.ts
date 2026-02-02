import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CustomerCloudKitchenItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  is_vegetarian: boolean;
  set_size: number;
  min_order_sets: number;
  cloud_kitchen_slot_id: string | null;
  images: {
    id: string;
    image_url: string;
    is_primary: boolean;
  }[];
}

export interface ActiveDivision {
  id: string;
  name: string;
  slot_type: string;
  start_time: string;
  end_time: string;
  cutoff_hours_before: number;
  is_ordering_open: boolean;
  time_until_cutoff: { hours: number; minutes: number } | null;
}

function checkIfOrderingOpen(slot: {
  start_time: string;
  cutoff_hours_before: number;
}): { isOpen: boolean; timeRemaining: { hours: number; minutes: number } | null } {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [hours, minutes] = slot.start_time.split(':').map(Number);
  const slotStartMinutes = hours * 60 + minutes;
  const cutoffMinutes = slotStartMinutes - slot.cutoff_hours_before * 60;

  if (currentMinutes >= cutoffMinutes) {
    return { isOpen: false, timeRemaining: null };
  }

  const remainingMinutes = cutoffMinutes - currentMinutes;
  return {
    isOpen: true,
    timeRemaining: {
      hours: Math.floor(remainingMinutes / 60),
      minutes: remainingMinutes % 60,
    },
  };
}

export function useCustomerDivisions() {
  return useQuery({
    queryKey: ['customer-cloud-kitchen-divisions'],
    queryFn: async () => {
      const { data: slots, error } = await supabase
        .from('cloud_kitchen_slots')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;

      return (slots || []).map((slot) => {
        const { isOpen, timeRemaining } = checkIfOrderingOpen(slot);
        return {
          id: slot.id,
          name: slot.name,
          slot_type: slot.slot_type,
          start_time: slot.start_time,
          end_time: slot.end_time,
          cutoff_hours_before: slot.cutoff_hours_before,
          is_ordering_open: isOpen,
          time_until_cutoff: timeRemaining,
        } as ActiveDivision;
      });
    },
    refetchInterval: 60000, // Refresh every minute to update time remaining
  });
}

export function useCustomerDivisionItems(divisionId: string | null) {
  return useQuery({
    queryKey: ['customer-division-items', divisionId],
    queryFn: async () => {
      if (!divisionId) return [];

      const { data, error } = await supabase
        .from('food_items')
        .select(`
          id,
          name,
          description,
          price,
          is_vegetarian,
          set_size,
          min_order_sets,
          cloud_kitchen_slot_id,
          images:food_item_images(id, image_url, is_primary)
        `)
        .eq('cloud_kitchen_slot_id', divisionId)
        .eq('is_available', true)
        .order('name');

      if (error) throw error;
      return (data || []) as CustomerCloudKitchenItem[];
    },
    enabled: !!divisionId,
  });
}

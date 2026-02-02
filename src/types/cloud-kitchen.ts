import type { Database } from '@/integrations/supabase/types';

export type CloudKitchenSlot = Database['public']['Tables']['cloud_kitchen_slots']['Row'];

export interface CloudKitchenFoodItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  is_vegetarian: boolean;
  is_available: boolean;
  set_size: number;
  min_order_sets: number;
  cloud_kitchen_slot_id: string | null;
  images: {
    id: string;
    image_url: string;
    is_primary: boolean;
  }[];
}

export interface SlotWithItems extends CloudKitchenSlot {
  food_items_count: number;
}

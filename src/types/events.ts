// Types for Indoor Events and Cloud Kitchen modules

export interface EventType {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Package {
  id: string;
  name: string;
  description: string | null;
  service_charge_percent: number;
  min_guests: number | null;
  max_guests: number | null;
  includes_decoration: boolean;
  includes_service_staff: boolean;
  includes_venue: boolean;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CloudKitchenSlot {
  id: string;
  name: string;
  slot_type: 'breakfast' | 'lunch' | 'dinner' | 'evening_snacks';
  start_time: string;
  end_time: string;
  cutoff_hours_before: number;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type OrderType = 'food_only' | 'full_event';
export type CookAssignmentStatus = 'pending' | 'accepted' | 'rejected' | 'auto_rejected';

export interface IndoorEventOrder {
  event_type_id: string;
  package_id: string;
  order_type: OrderType;
  guest_count: number;
  event_date: string;
  event_details?: string;
  delivery_address: string;
}

export interface CloudKitchenOrder {
  cloud_kitchen_slot_id: string;
  delivery_address: string;
  delivery_instructions?: string;
}

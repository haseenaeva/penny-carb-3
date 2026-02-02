-- Add set configuration columns to food_items for cloud kitchen
ALTER TABLE public.food_items
ADD COLUMN IF NOT EXISTS set_size integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS min_order_sets integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS cloud_kitchen_slot_id uuid REFERENCES public.cloud_kitchen_slots(id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_food_items_cloud_kitchen_slot ON public.food_items(cloud_kitchen_slot_id);

-- Add comment for clarity
COMMENT ON COLUMN public.food_items.set_size IS 'Number of items in one set (e.g., 5 samosas per set)';
COMMENT ON COLUMN public.food_items.min_order_sets IS 'Minimum number of sets to order (e.g., min 3 sets)';
COMMENT ON COLUMN public.food_items.cloud_kitchen_slot_id IS 'Division/slot this item belongs to for cloud kitchen';
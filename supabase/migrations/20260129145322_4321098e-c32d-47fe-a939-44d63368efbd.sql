-- STEP 1: Create event_types table for Indoor Events
CREATE TABLE public.event_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '🎉',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default event types
INSERT INTO public.event_types (name, description, icon, display_order) VALUES
  ('Birthday', 'Birthday celebrations and parties', '🎂', 1),
  ('Anniversary', 'Wedding and other anniversaries', '💍', 2),
  ('Sadya', 'Traditional Kerala feast', '🍛', 3),
  ('Function', 'General functions and gatherings', '🎊', 4);

-- STEP 2: Create packages table
CREATE TABLE public.packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  service_charge_percent NUMERIC NOT NULL DEFAULT 5,
  min_guests INTEGER DEFAULT 10,
  max_guests INTEGER DEFAULT 500,
  includes_decoration BOOLEAN NOT NULL DEFAULT false,
  includes_service_staff BOOLEAN NOT NULL DEFAULT false,
  includes_venue BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default packages
INSERT INTO public.packages (name, description, service_charge_percent, includes_decoration, includes_service_staff, includes_venue, display_order) VALUES
  ('Basic', 'Food only - No additional services', 5, false, false, false, 1),
  ('Standard', 'Food with basic decoration and service staff', 10, true, true, false, 2),
  ('Premium', 'Full event control - Food, decoration, staff, and venue coordination', 15, true, true, true, 3);

-- STEP 3: Create cloud_kitchen_slots table
CREATE TABLE public.cloud_kitchen_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slot_type TEXT NOT NULL, -- breakfast, lunch, dinner, evening_snacks
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  cutoff_hours_before INTEGER NOT NULL DEFAULT 2,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default time slots (with 2 hours before cut-off)
INSERT INTO public.cloud_kitchen_slots (name, slot_type, start_time, end_time, cutoff_hours_before, display_order) VALUES
  ('Breakfast', 'breakfast', '07:00', '10:00', 2, 1),
  ('Lunch', 'lunch', '12:00', '14:00', 2, 2),
  ('Evening Snacks', 'evening_snacks', '16:00', '18:00', 2, 3),
  ('Dinner', 'dinner', '19:00', '22:00', 2, 4);

-- STEP 4: Create order_types enum if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_type') THEN
    CREATE TYPE order_type AS ENUM ('food_only', 'full_event');
  END IF;
END $$;

-- STEP 5: Create cook_assignment_status enum
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'cook_assignment_status') THEN
    CREATE TYPE cook_assignment_status AS ENUM ('pending', 'accepted', 'rejected', 'auto_rejected');
  END IF;
END $$;

-- STEP 6: Add new columns to orders table
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS event_type_id UUID REFERENCES public.event_types(id),
ADD COLUMN IF NOT EXISTS package_id UUID REFERENCES public.packages(id),
ADD COLUMN IF NOT EXISTS order_type TEXT DEFAULT 'food_only',
ADD COLUMN IF NOT EXISTS guest_count INTEGER,
ADD COLUMN IF NOT EXISTS advance_payment_required NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS advance_payment_received BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS advance_payment_verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS advance_payment_verified_by UUID,
ADD COLUMN IF NOT EXISTS cloud_kitchen_slot_id UUID REFERENCES public.cloud_kitchen_slots(id),
ADD COLUMN IF NOT EXISTS cook_assignment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS cook_assigned_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS cook_response_deadline TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS cook_responded_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS service_charge_amount NUMERIC DEFAULT 0;

-- STEP 7: Enable RLS on new tables
ALTER TABLE public.event_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cloud_kitchen_slots ENABLE ROW LEVEL SECURITY;

-- STEP 8: Create RLS policies for event_types
CREATE POLICY "Anyone can view active event types" ON public.event_types
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage event types" ON public.event_types
  FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'));

-- STEP 9: Create RLS policies for packages
CREATE POLICY "Anyone can view active packages" ON public.packages
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage packages" ON public.packages
  FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'));

-- STEP 10: Create RLS policies for cloud_kitchen_slots
CREATE POLICY "Anyone can view active slots" ON public.cloud_kitchen_slots
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage slots" ON public.cloud_kitchen_slots
  FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'));

-- STEP 11: Add triggers for updated_at
CREATE TRIGGER update_event_types_updated_at
  BEFORE UPDATE ON public.event_types
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_packages_updated_at
  BEFORE UPDATE ON public.packages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cloud_kitchen_slots_updated_at
  BEFORE UPDATE ON public.cloud_kitchen_slots
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
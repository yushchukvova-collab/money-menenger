-- Create visitors table to store unique visitor IDs
CREATE TABLE IF NOT EXISTS public.visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT UNIQUE NOT NULL,
  first_visit TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS (open for anonymous access since no auth required)
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read visitor count
CREATE POLICY "Anyone can read visitors"
  ON public.visitors
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow anyone to insert new visitors
CREATE POLICY "Anyone can insert visitors"
  ON public.visitors
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Function to register a visitor and return total count
CREATE OR REPLACE FUNCTION public.register_visitor(visitor_id TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_count INTEGER;
BEGIN
  -- Insert visitor if doesn't exist (ignore if duplicate)
  INSERT INTO public.visitors (visitor_id)
  VALUES (visitor_id)
  ON CONFLICT (visitor_id) DO NOTHING;
  
  -- Get total count
  SELECT COUNT(*)::INTEGER INTO total_count FROM public.visitors;
  
  RETURN total_count;
END;
$$;

-- Function to get current visitor count (for page load)
CREATE OR REPLACE FUNCTION public.get_visitor_count()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_count INTEGER;
BEGIN
  SELECT COUNT(*)::INTEGER INTO total_count FROM public.visitors;
  RETURN total_count;
END;
$$;
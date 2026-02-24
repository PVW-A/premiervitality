-- Add cost column to peptides for profit margin calculation
ALTER TABLE public.peptides ADD COLUMN IF NOT EXISTS cost numeric DEFAULT NULL;

-- Add unit_price to order_items so we know what price was paid at time of purchase
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS unit_price numeric DEFAULT NULL;

-- Add total_amount to orders for quick spend queries
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total_amount numeric DEFAULT 0;
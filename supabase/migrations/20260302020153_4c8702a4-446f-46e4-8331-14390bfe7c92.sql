-- Rate limiting table for edge functions
CREATE TABLE public.rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL,         -- IP, user ID, or phone
  endpoint TEXT NOT NULL,            -- function name
  request_count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Composite index for fast lookups
CREATE UNIQUE INDEX idx_rate_limits_identifier_endpoint 
ON public.rate_limits (identifier, endpoint);

-- Index for cleanup
CREATE INDEX idx_rate_limits_window_start 
ON public.rate_limits (window_start);

-- Enable RLS (only service role should access this)
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- No public policies — only service_role can read/write
-- This ensures rate limits can't be tampered with from the client

-- Function to check and increment rate limit
-- Returns true if the request is ALLOWED, false if rate limited
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  _identifier TEXT,
  _endpoint TEXT,
  _max_requests INTEGER,
  _window_seconds INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _window_start TIMESTAMP WITH TIME ZONE;
  _current_count INTEGER;
BEGIN
  _window_start := now() - (_window_seconds || ' seconds')::INTERVAL;
  
  -- Try to insert or update atomically
  INSERT INTO public.rate_limits (identifier, endpoint, request_count, window_start)
  VALUES (_identifier, _endpoint, 1, now())
  ON CONFLICT (identifier, endpoint) DO UPDATE
  SET 
    -- Reset window if expired, otherwise increment
    request_count = CASE 
      WHEN rate_limits.window_start < _window_start THEN 1
      ELSE rate_limits.request_count + 1
    END,
    window_start = CASE
      WHEN rate_limits.window_start < _window_start THEN now()
      ELSE rate_limits.window_start
    END
  RETURNING request_count INTO _current_count;
  
  RETURN _current_count <= _max_requests;
END;
$$;

-- Cleanup function to remove stale entries (older than 24 hours)
CREATE OR REPLACE FUNCTION public.cleanup_rate_limits()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  DELETE FROM public.rate_limits 
  WHERE window_start < now() - INTERVAL '24 hours';
$$;
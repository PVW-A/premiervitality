
-- Notifications table for order updates, announcements, etc.
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID, -- NULL means broadcast to all users
  type TEXT NOT NULL DEFAULT 'info', -- 'order_update', 'announcement', 'reminder', 'info'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT, -- optional deep link like '/portal?tab=requests'
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can see their own notifications + broadcasts (user_id IS NULL)
CREATE POLICY "Users can view own and broadcast notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);

-- Users can mark their own notifications as read
CREATE POLICY "Users can update own notifications"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id);

-- Admins can manage all notifications
CREATE POLICY "Admins can manage all notifications"
ON public.notifications FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Index for fast user lookups
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

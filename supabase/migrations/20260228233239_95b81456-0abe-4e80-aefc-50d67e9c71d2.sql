
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name, phone, sms_consent)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'phone',
    COALESCE((NEW.raw_user_meta_data->>'sms_consent')::boolean, false)
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'patient');

  -- Auto-accept any pending account link invites for this email
  UPDATE public.account_links
  SET invitee_user_id = NEW.id,
      status = 'accepted',
      accepted_at = now()
  WHERE LOWER(invitee_email) = LOWER(NEW.email)
    AND status = 'pending';

  RETURN NEW;
END;
$function$;

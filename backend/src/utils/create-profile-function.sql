-- Create a function to safely insert profiles bypassing RLS
CREATE OR REPLACE FUNCTION public.create_profile(
  user_id uuid,
  user_username text,
  user_fullname text,
  user_created_at timestamptz
) RETURNS boolean 
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, created_at)
  VALUES (user_id, user_username, user_fullname, user_created_at);
  RETURN true;
EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Error creating profile: %', SQLERRM;
    RETURN false;
END;
$$; 
-- Create function to add a column if it doesn't exist
CREATE OR REPLACE FUNCTION public.create_add_column_procedure()
RETURNS void AS $$
BEGIN
  -- Check if the function already exists, if not create it
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'add_column_if_not_exists'
  ) THEN
    EXECUTE $FUNC$
      CREATE OR REPLACE FUNCTION public.add_column_if_not_exists(
        table_name text,
        column_name text,
        column_type text
      )
      RETURNS void AS $INNER$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = add_column_if_not_exists.table_name
            AND column_name = add_column_if_not_exists.column_name
        ) THEN
          EXECUTE format('ALTER TABLE public.%I ADD COLUMN %I %s', 
                         add_column_if_not_exists.table_name, 
                         add_column_if_not_exists.column_name, 
                         add_column_if_not_exists.column_type);
        END IF;
      END;
      $INNER$ LANGUAGE plpgsql SECURITY DEFINER;
    $FUNC$;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create function to enable RLS on a table
CREATE OR REPLACE FUNCTION public.enable_rls(target_table text)
RETURNS void AS $$
BEGIN
  EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', target_table);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to create service role policy for a table
CREATE OR REPLACE FUNCTION public.create_service_role_policy(target_table text)
RETURNS void AS $$
DECLARE
  policy_name text := target_table || '_service_role_policy';
BEGIN
  -- Drop policy if it already exists
  EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', policy_name, target_table);
  
  -- Create new policy
  EXECUTE format('CREATE POLICY %I ON public.%I FOR ALL TO service_role USING (true) WITH CHECK (true)', 
                 policy_name, target_table);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 
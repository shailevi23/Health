-- Fix function search path issues by adding SET search_path parameter
-- This script addresses the "Function Search Path Mutable" warnings

-- First, let's get the exact function signatures from pg_catalog
DO $$
DECLARE
  func_record record;
  alter_stmt text;
BEGIN
  -- Loop through all functions in public schema that need fixing
  FOR func_record IN 
    SELECT 
      n.nspname AS schema_name,
      p.proname AS function_name,
      pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname IN ('public', 'next_auth')
    AND p.proname IN (
      'update_updated_at', 
      'update_updated_at_column',
      'calculate_bmi', 
      'get_bmi_category',
      'calculate_goal_progress',
      'handle_new_user',
      'handle_new_profile',
      'is_authenticated',
      'is_admin',
      'owns_row',
      'created_by_user',
      'uid'
    )
  LOOP
    -- Build the ALTER FUNCTION statement with exact signature
    IF func_record.schema_name = 'next_auth' AND func_record.function_name = 'uid' THEN
      alter_stmt := format('ALTER FUNCTION %I.%I(%s) SET search_path = next_auth, public', 
                          func_record.schema_name, func_record.function_name, func_record.args);
    ELSE
      alter_stmt := format('ALTER FUNCTION %I.%I(%s) SET search_path = public', 
                          func_record.schema_name, func_record.function_name, func_record.args);
    END IF;
    
    -- Execute the statement and provide feedback
    BEGIN
      EXECUTE alter_stmt;
      RAISE NOTICE 'Fixed search_path for %.%(%) - Set search_path successfully', 
                   func_record.schema_name, func_record.function_name, func_record.args;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Error fixing %.%(%) - %', 
                   func_record.schema_name, func_record.function_name, func_record.args, SQLERRM;
    END;
  END LOOP;
  
  RAISE NOTICE 'Function search path fixing completed';
END $$;

-- Note: For the auth_otp_long_expiry warning, you'll need to update your authentication settings
-- in the Supabase dashboard under Authentication > Providers > Email
-- Reduce the OTP expiry time to less than 1 hour (3600 seconds) 
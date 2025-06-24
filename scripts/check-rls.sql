-- Check which tables have RLS enabled
SELECT n.nspname AS schema_name,
       c.relname AS table_name,
       c.relrowsecurity AS rls_enabled
FROM pg_class c
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE c.relkind = 'r'  -- Only regular tables
  AND n.nspname = 'public'
ORDER BY c.relname;

-- Check policies for each table
SELECT schemaname, 
       tablename, 
       policyname, 
       permissive, 
       roles, 
       cmd, 
       qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname; 
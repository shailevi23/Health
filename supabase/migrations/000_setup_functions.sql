-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Function to create migrations table
CREATE OR REPLACE FUNCTION create_migrations_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS _migrations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to run a migration
CREATE OR REPLACE FUNCTION run_migration(sql_statement text, migration_name text)
RETURNS void AS $$
DECLARE
  migration_exists boolean;
BEGIN
  -- Check if migration was already executed
  SELECT EXISTS (
    SELECT 1 FROM _migrations WHERE name = migration_name
  ) INTO migration_exists;
  
  IF NOT migration_exists THEN
    -- Execute the migration
    EXECUTE sql_statement;
    
    -- Record the migration
    INSERT INTO _migrations (name) VALUES (migration_name);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 
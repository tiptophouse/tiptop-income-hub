
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

/**
 * Verifies that required tables exist in the Supabase database
 * This is useful after migrating to a new Supabase instance
 */
export async function verifyDatabaseSchema() {
  try {
    console.log("Verifying database schema...");
    
    // Define the expected tables based on the types.ts file
    const expectedTables = [
      'appointments',
      'clients',
      'Or',
      'services',
      'settings',
      'working_hours'
    ];
    
    // Check if the tables exist
    const { data: tables, error: tablesError } = await supabase
      .from('pg_catalog.pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
    
    if (tablesError) {
      console.error("Error fetching tables:", tablesError);
      toast({
        title: "Database Schema Verification Failed",
        description: "Could not verify database schema. Please ensure you have the correct permissions.",
        variant: "destructive"
      });
      return false;
    }
    
    // Get table names
    const existingTableNames = tables?.map(t => t.tablename) || [];
    console.log("Existing tables:", existingTableNames);
    
    // Check for missing tables
    const missingTables = expectedTables.filter(
      table => !existingTableNames.includes(table)
    );
    
    if (missingTables.length > 0) {
      console.warn("Missing tables:", missingTables);
      toast({
        title: "Database Schema Mismatch",
        description: `Your Supabase database is missing required tables: ${missingTables.join(', ')}`,
        variant: "destructive"
      });
      return false;
    }
    
    console.log("All required tables exist in the database");
    toast({
      title: "Database Schema Verification",
      description: "Your Supabase database schema appears to be correctly set up.",
      variant: "default"
    });
    return true;
  } catch (error) {
    console.error("Error verifying database schema:", error);
    toast({
      title: "Database Schema Verification Error",
      description: "An unexpected error occurred while verifying your database schema.",
      variant: "destructive"
    });
    return false;
  }
}

/**
 * Utility function to help create required tables in the Supabase database
 * This provides guidance on the SQL commands needed to create tables
 */
export function getCreateTableCommands() {
  return {
    appointments: `
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id),
  service_id UUID REFERENCES services(id),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  email TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,
    clients: `
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp_opted_in BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,
    Or: `
CREATE TABLE IF NOT EXISTS "Or" (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,
    services: `
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL,
  price NUMERIC,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,
    settings: `
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,
    working_hours: `
CREATE TABLE IF NOT EXISTS working_hours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day INTEGER NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  is_working BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`
  };
}

/**
 * Utility to add to DashboardOverview to check schema on load
 */
export function useDatabaseSchemaVerification() {
  return {
    verifySchema: () => {
      verifyDatabaseSchema().then(isValid => {
        if (!isValid) {
          console.warn("Please ensure your Supabase database matches the expected schema");
        }
      });
    }
  };
}

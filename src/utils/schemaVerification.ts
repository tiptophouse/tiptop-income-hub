
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useState } from 'react';

// Define expected tables for the app
const expectedTables = [
  'users',
  'properties',
  'solar_analyses',
  'monetization_assets'
];

export const useDatabaseSchemaVerification = () => {
  const [isVerifying, setIsVerifying] = useState(false);

  const verifySchema = async () => {
    setIsVerifying(true);
    try {
      // Using information_schema to check tables instead of pg_tables
      // This is more compatible with Supabase's security policies
      const { data: tables, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');

      if (error) {
        console.error("Error verifying database schema:", error);
        toast({
          title: "Database Error",
          description: "Could not verify database schema. Some features may not work correctly.",
          variant: "destructive"
        });
        return false;
      }

      // Extract table names from the response
      const existingTables = tables?.map(table => table.table_name) || [];
      
      // Check if all expected tables exist
      const missingTables = expectedTables.filter(table => !existingTables.includes(table));

      if (missingTables.length > 0) {
        console.warn("Missing database tables:", missingTables);
        toast({
          title: "Database Schema Warning",
          description: `Some required tables are missing: ${missingTables.join(', ')}. You may need to run database migrations.`,
          variant: "destructive"
        });
        return false;
      }

      console.log("Database schema verification successful");
      return true;
    } catch (error) {
      console.error("Error in schema verification:", error);
      toast({
        title: "Schema Verification Error",
        description: "Could not verify database schema. Please check your database connection.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  return { verifySchema, isVerifying };
};

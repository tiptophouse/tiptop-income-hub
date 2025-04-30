
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
      // Use a raw SQL query to check tables - this is more reliable than trying to query information_schema directly
      const { data, error } = await supabase
        .rpc('get_tables', {})
        .select('*');

      if (error) {
        console.error("Error verifying database schema:", error);
        
        // Try alternative approach if RPC fails
        const { data: tablesData, error: tablesError } = await supabase
          .from('pg_catalog.pg_tables')
          .select('tablename')
          .eq('schemaname', 'public');
        
        if (tablesError) {
          console.error("Error with fallback schema verification:", tablesError);
          toast({
            title: "Database Error",
            description: "Could not verify database schema. Some features may not work correctly.",
            variant: "destructive"
          });
          setIsVerifying(false);
          return false;
        }
        
        // Extract table names from the response
        const existingTables = tablesData?.map(table => table.tablename) || [];
        return checkMissingTables(existingTables);
      }

      // Extract table names from the RPC response
      const existingTables = data?.map(item => item.table_name) || [];
      return checkMissingTables(existingTables);
    } catch (error) {
      console.error("Error in schema verification:", error);
      toast({
        title: "Schema Verification Error",
        description: "Could not verify database schema. Please check your database connection.",
        variant: "destructive"
      });
      setIsVerifying(false);
      return false;
    }
  };

  // Helper function to check missing tables and show appropriate messages
  const checkMissingTables = (existingTables: string[]) => {
    // Check if all expected tables exist
    const missingTables = expectedTables.filter(table => !existingTables.includes(table));

    if (missingTables.length > 0) {
      console.warn("Missing database tables:", missingTables);
      toast({
        title: "Database Schema Warning",
        description: `Some required tables are missing: ${missingTables.join(', ')}. You may need to run database migrations.`,
        variant: "destructive"
      });
      setIsVerifying(false);
      return false;
    }

    console.log("Database schema verification successful");
    setIsVerifying(false);
    return true;
  };

  return { verifySchema, isVerifying };
};

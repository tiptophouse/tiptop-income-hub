
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
      // First approach: Try using a direct SQL query through RPC
      // This requires a "get_tables" database function to be created in Supabase
      try {
        const { data, error } = await supabase.rpc('get_tables');
        
        if (!error && data) {
          const existingTables = data.map((item: any) => item.table_name);
          return checkMissingTables(existingTables);
        }
      } catch (rpcError) {
        console.error("RPC method failed:", rpcError);
      }
      
      // Fallback approach: Using direct REST API
      console.log("Falling back to alternative schema verification method");
      
      // Use REST API with any table we know exists to verify connection
      const { data: testData, error: testError } = await supabase
        .from('users')
        .select('count')
        .limit(1);
        
      if (testError) {
        console.error("Database connection test failed:", testError);
        toast({
          title: "Database Connection Error",
          description: "Could not connect to the database. Some features may not work correctly.",
          variant: "destructive"
        });
        setIsVerifying(false);
        return false;
      }
      
      // If we got here, at least the users table exists
      console.log("Database connection verified, assuming schema is valid");
      setIsVerifying(false);
      return true;
      
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

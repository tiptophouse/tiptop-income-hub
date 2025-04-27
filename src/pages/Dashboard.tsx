
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/pages/dashboard/DashboardLayout';
import StatisticsCards from '@/pages/dashboard/components/StatisticsCards';
import DashboardOverview from '@/pages/dashboard/DashboardOverview';
import DashboardHeader from '@/pages/dashboard/components/DashboardHeader';
import { toast } from '@/components/ui/use-toast';

const Dashboard: React.FC = () => {
  const [userName, setUserName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserName = async () => {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserName(user.user_metadata?.full_name || user.email || 'User');
        } else {
          // Handle the case where there is no user
          setUserName('Guest');
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch user data. Please try again.",
          variant: "destructive"
        });
        setUserName('Guest');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserName();
  }, []);

  return (
    <DashboardLayout onSignOut={() => {}}>
      <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        <DashboardOverview 
          userName={userName} 
          earnings={{
            daily: 49.80,
            monthly: 1582.50,
            yearly: 18990.00
          }}
          activeAssets={6}
          totalPotentialAssets={12}
          pendingActions={3}
          aiRevenueDescription="Your assets are generating revenue at optimal levels. Solar panels are operating at 94% efficiency."
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

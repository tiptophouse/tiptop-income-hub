
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/pages/dashboard/DashboardLayout';
import DashboardOverview from '@/pages/dashboard/DashboardOverview';
import { toast } from '@/components/ui/use-toast';
import { useModelGeneration } from '@/hooks/useModelGeneration';
import { startPeriodicStatusCheck } from '@/utils/api/modelStatus';
import { sendAddressToWebhook } from '@/utils/webhook';

const Dashboard: React.FC = () => {
  const [userName, setUserName] = useState<string>('');
  const [propertyAddress, setPropertyAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [propertyInsights, setPropertyInsights] = useState<any | null>(null);
  const { is3DModelGenerating, handleModelGeneration } = useModelGeneration();

  useEffect(() => {
    // Start periodic status checks for any pending models
    const stopStatusCheck = startPeriodicStatusCheck();
    
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserName(user.user_metadata?.full_name || user.email || 'User');
          setPropertyAddress(user.user_metadata?.propertyAddress || '');
          
          // Load property insights if address exists
          if (user.user_metadata?.propertyAddress) {
            await fetchPropertyInsights(user.user_metadata.propertyAddress);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch user data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
    
    // Clean up the interval when component unmounts
    return () => {
      stopStatusCheck();
    };
  }, []);
  
  const fetchPropertyInsights = async (address: string) => {
    try {
      setIsLoading(true);
      
      // Send address to webhook and receive property insights
      const { success, data } = await sendAddressToWebhook(address);
      
      if (success && data) {
        setPropertyInsights(data);
      } else {
        // Use default webhook data for demonstration
        const defaultData = {
          property_type: "multi-unit residential building",
          coordinates: { lat: 32.081911, lng: 34.787396 },
          amenities: ["solar", "garden", "parking"],
          rooftop_area_m2: 170,
          estimated_solar_capacity_kw: 25,
          rooftop_area_5g_m2: 50,
          garden_area_m2: 120,
          garden_rarity: "Low",
          parking_spaces: 8,
          avg_parking_rate_usd_per_day: 18,
          ev_charger: { present: false, type: null, power_kw: 0 },
          pool: { present: false, area_m2: 0, type: null },
          storage_volume_m3: 45,
          unused_bandwidth_mbps: 20,
          short_term_rent_usd_per_night: 160,
          projected_monthly_rental_usd: 2950,
        };
        
        setPropertyInsights(defaultData);
        console.log("Using default property insights");
      }
    } catch (error) {
      console.error("Error fetching property insights:", error);
      toast({
        title: "Error",
        description: "Failed to fetch property insights. Using default data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressSubmit = async (address: string) => {
    try {
      setIsLoading(true);
      
      // Update property address in UI
      setPropertyAddress(address);
      
      // Save address to user metadata
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.auth.updateUser({
          data: { 
            propertyAddress: address 
          }
        });
        
        toast({
          title: "Address Updated",
          description: "Your property address has been saved.",
        });
        
        // Fetch property insights for the new address
        await fetchPropertyInsights(address);
        
        // Generate 3D model for the property
        await handleModelGeneration(null, address);
      }
    } catch (error) {
      console.error("Error updating address:", error);
      toast({
        title: "Error",
        description: "Failed to update address. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Calculate earnings based on property insights
  const calculateEarnings = () => {
    if (!propertyInsights) {
      return {
        daily: 12.67,
        monthly: 380.00,
        yearly: 4560.00
      };
    }
    
    let monthly = 0;
    
    // Calculate solar earnings
    if (propertyInsights.estimated_solar_capacity_kw) {
      monthly += propertyInsights.estimated_solar_capacity_kw * 15;
    }
    
    // Calculate internet earnings
    if (propertyInsights.unused_bandwidth_mbps) {
      monthly += propertyInsights.unused_bandwidth_mbps * 5;
    }
    
    // Calculate parking earnings
    if (propertyInsights.parking_spaces && propertyInsights.avg_parking_rate_usd_per_day) {
      monthly += Math.round(propertyInsights.parking_spaces * propertyInsights.avg_parking_rate_usd_per_day * 6);
    }
    
    // Add other sources
    if (propertyInsights.storage_volume_m3) {
      monthly += Math.round(propertyInsights.storage_volume_m3 * 8);
    }
    
    if (propertyInsights.garden_area_m2) {
      monthly += Math.round(propertyInsights.garden_area_m2 * 3);
    }
    
    if (propertyInsights.rooftop_area_5g_m2) {
      monthly += Math.round(propertyInsights.rooftop_area_5g_m2 * 15);
    }
    
    const daily = parseFloat((monthly / 30).toFixed(2));
    const yearly = Math.round(monthly * 12);
    
    return {
      daily,
      monthly,
      yearly
    };
  };
  
  // Calculate total potential assets
  const calculateAssetCounts = () => {
    if (!propertyInsights) {
      return { active: 5, total: 9 };
    }
    
    let potentialCount = 0;
    
    if (propertyInsights.rooftop_area_m2 > 0 || propertyInsights.estimated_solar_capacity_kw > 0) potentialCount++;
    if (propertyInsights.unused_bandwidth_mbps > 0) potentialCount++;
    if (propertyInsights.parking_spaces > 0) potentialCount++;
    if (propertyInsights.garden_area_m2 > 0) potentialCount++;
    if (propertyInsights.storage_volume_m3 > 0) potentialCount++;
    if (propertyInsights.rooftop_area_5g_m2 > 0) potentialCount++;
    if (propertyInsights.pool && propertyInsights.pool.present) potentialCount++;
    
    // Assuming some active assets (can be refined based on real data)
    const activeCount = Math.max(1, Math.floor(potentialCount / 2));
    
    return { active: activeCount, total: potentialCount };
  };
  
  const earnings = calculateEarnings();
  const assetCounts = calculateAssetCounts();

  return (
    <DashboardLayout onSignOut={() => {}}>
      <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <DashboardOverview 
          userName={userName} 
          earnings={earnings}
          activeAssets={assetCounts.active}
          totalPotentialAssets={assetCounts.total}
          pendingActions={3}
          propertyAddress={propertyAddress}
          onAddressSubmit={handleAddressSubmit}
          is3DModelGenerating={is3DModelGenerating}
          propertyInsights={propertyInsights}
          aiRevenueDescription="Your assets are generating revenue at optimal levels based on property analysis."
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

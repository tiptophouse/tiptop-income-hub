
import React, { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Star } from 'lucide-react';
import AssetAdditionalInfo from './assets/AssetAdditionalInfo';
import AssetOpportunitiesList from './assets/AssetOpportunitiesList';
import { getPropertyInsightsFromAI } from '@/utils/openaiApi';
import AssetsCarousel from './assets/AssetsCarousel';

interface AssetOpportunitiesProps {
  address: string;
}

const AssetOpportunities: React.FC<AssetOpportunitiesProps> = ({
  address
}) => {
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<any | null>(null);
  
  const handleAssetToggle = (assetId: string) => {
    setSelectedAssets(prev => prev.includes(assetId) ? prev.filter(id => id !== assetId) : [...prev, assetId]);
  };
  
  const handleContinue = () => {
    if (selectedAssets.length === 0) {
      toast({
        title: "No assets selected",
        description: "Please select at least one asset to continue",
        variant: "destructive"
      });
      return;
    }
    setShowAdditionalInfo(true);
    setTimeout(() => {
      const additionalInfoSection = document.getElementById('additional-info');
      if (additionalInfoSection) {
        additionalInfoSection.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }, 100);
  };
  
  const handleAuthWithGoogle = async () => {
    toast({
      title: "Redirecting to Google login",
      description: "You'll be redirected to sign in with your Google account"
    });
    try {
      const {
        data,
        error
      } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard'
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error with Google auth:", error);
      toast({
        title: "Authentication Error",
        description: "There was an error signing in with Google. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Calculate the total potential monthly income
  const calculateTotalMonthlyIncome = () => {
    if (!insights) return 485; // Default value
    
    let total = 0;
    
    // Calculate from solar
    if (insights.estimated_solar_capacity_kw) {
      total += insights.estimated_solar_capacity_kw * 15;
    } else if (insights.rooftop_area_m2) {
      total += Math.round(insights.rooftop_area_m2 * 2);
    } else {
      total += 120;
    }
    
    // Calculate from bandwidth
    if (insights.unused_bandwidth_mbps) {
      total += insights.unused_bandwidth_mbps * 5;
    } else {
      total += 200;
    }
    
    // Calculate from parking
    if (insights.parking_spaces && insights.avg_parking_rate_usd_per_day) {
      total += Math.round(insights.parking_spaces * insights.avg_parking_rate_usd_per_day * 6);
    } else if (insights.parking_spaces) {
      total += Math.round(insights.parking_spaces * 15 * 6);
    } else {
      total += 50;
    }
    
    // Add storage if available
    if (insights.storage_volume_m3) {
      total += Math.round(insights.storage_volume_m3 * 8);
    }
    
    // Add garden if available
    if (insights.garden_area_m2) {
      total += Math.round(insights.garden_area_m2 * 3);
    }
    
    // Add 5G if available
    if (insights.rooftop_area_5g_m2) {
      total += Math.round(insights.rooftop_area_5g_m2 * 15);
    }
    
    // Add pool if available
    if (insights.pool && insights.pool.present && insights.pool.area_m2) {
      total += Math.round(insights.pool.area_m2 * 10);
    }
    
    return total;
  };
  
  useEffect(() => {
    if (!address) return;
    setIsLoading(true);
    
    // This webhook data would be received from Make.com in production
    const webhookData = {
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
      required_permits: ["solar_permit", "municipal_building_permit"],
      advertising_restrictions: "Billboards and rooftop ads not permitted in this zone; temporary window/banner ads possible with municipal approval.",
      regulatory_summary: "Rooftop solar installations are encouraged by city incentives; 5G rooftop leasing requires municipal engineering review and tenant/HOA notification. Permanent advertising is prohibited; public-facing amenities must comply with city and National Building Code. No short-term let limitations. No garden exclusivity advantages in this neighborhood."
    };
    
    // Use webhook data directly
    setInsights(webhookData);
    setIsLoading(false);
    
    // For development purposes, we're also calling the getPropertyInsightsFromAI as a backup
    // This would be removed in production when webhook data is reliable
    getPropertyInsightsFromAI(address).then(data => {
      if (!webhookData) {
        console.log("Using AI-generated insights as fallback");
        setInsights(data);
      }
    }).catch(error => {
      console.error("Error fetching property insights:", error);
      if (!webhookData) {
        toast({
          title: "Error",
          description: "Failed to analyze property. Please try again later.",
          variant: "destructive"
        });
      }
    });
  }, [address]);
  
  if (!address) return null;
  
  const totalMonthlyIncome = calculateTotalMonthlyIncome();
  
  return (
    <div className="w-full">
      <div className="mb-8 bg-[#9b87f5] rounded-2xl p-8">
        <div className="text-white max-w-3xl">
          <h2 className="text-2xl font-bold mb-2 text-white">Property Analysis</h2>
          <p className="text-white/90 mb-1">{address}</p>
          <p className="mb-4">We've analyzed your property and identified several monetization opportunities based on its features and location.</p>
          <div className="flex justify-between items-center">
            <p className="text-sm">→ Select which assets you want to monetize below</p>
            <div className="text-right flex items-center gap-2">
              <div className="text-sm">Potential Monthly Income</div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
                <div className="text-2xl font-bold">${totalMonthlyIncome}/mo</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <AssetOpportunitiesList 
          selectedAssets={selectedAssets} 
          onAssetToggle={handleAssetToggle} 
          address={address} 
          insights={insights} 
          isLoading={isLoading} 
        />

        {selectedAssets.length > 0 && 
          <div className="flex justify-center mt-8">
            <button 
              onClick={handleContinue} 
              className="bg-[#AA94E2] hover:bg-[#9b87f5] text-[#FFFDED] px-8 py-4 text-lg rounded-full font-fahkwang transition-all shadow-md hover:shadow-lg"
            >
              Continue with Selected Assets
            </button>
          </div>
        }
      </div>

      <AssetsCarousel />

      {showAdditionalInfo && 
        <AssetAdditionalInfo 
          selectedAssets={selectedAssets} 
          onComplete={handleAuthWithGoogle} 
          insights={insights} 
        />
      }
    </div>
  );
};

export default AssetOpportunities;

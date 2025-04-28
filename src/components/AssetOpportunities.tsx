
import React, { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AssetAdditionalInfo from './assets/AssetAdditionalInfo';
import AssetOpportunitiesList from './assets/AssetOpportunitiesList';
import { getPropertyInsightsFromAI } from '@/utils/openaiApi';
import AssetsCarousel from './assets/AssetsCarousel';

interface AssetOpportunitiesProps {
  address: string;
}

const AssetOpportunities: React.FC<AssetOpportunitiesProps> = ({ address }) => {
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<any | null>(null);

  const handleAssetToggle = (assetId: string) => {
    setSelectedAssets(prev =>
      prev.includes(assetId)
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
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
        additionalInfoSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleAuthWithGoogle = async () => {
    toast({
      title: "Redirecting to Google login",
      description: "You'll be redirected to sign in with your Google account"
    });
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
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

  useEffect(() => {
    if (!address) return;
    
    setIsLoading(true);
    
    getPropertyInsightsFromAI(address)
      .then(data => {
        console.log("Received insights data:", data);
        setInsights(data);
      })
      .catch(error => {
        console.error("Error fetching property insights:", error);
        toast({
          title: "Error",
          description: "Failed to analyze property. Please try again later.",
          variant: "destructive"
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [address]);

  if (!address) return null;

  return (
    <div className="w-full">
      <div className="mb-8 bg-[#9b87f5] rounded-2xl p-8">
        <div className="text-white max-w-3xl">
          <h2 className="text-2xl font-bold mb-2">Property Analysis</h2>
          <p className="text-white/90 mb-1">{address}</p>
          <p className="mb-4">We've analyzed your property and identified several monetization opportunities based on its features and location.</p>
          <div className="flex justify-between items-center">
            <p className="text-sm">→ Select which assets you want to monetize below</p>
            <div className="text-right">
              <div className="text-sm">Potential Monthly Income</div>
              <div className="text-2xl font-bold">$485/mo</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-[#6E59A5] font-fahkwang">
          Immediately Available Asset Opportunities
        </h2>
        <div className="bg-white/50 backdrop-blur-sm border border-[#E5DEFF] rounded-2xl p-6">
          <AssetOpportunitiesList
            selectedAssets={selectedAssets}
            onAssetToggle={handleAssetToggle}
            address={address}
            insights={insights}
            isLoading={isLoading}
          />

          {selectedAssets.length > 0 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleContinue}
                className="bg-[#AA94E2] hover:bg-[#9b87f5] text-[#FFFDED] px-8 py-4 text-lg rounded-full font-fahkwang transition-all shadow-md hover:shadow-lg"
              >
                Continue with Selected Assets
              </button>
            </div>
          )}
        </div>
      </div>

      <AssetsCarousel />

      {showAdditionalInfo && (
        <AssetAdditionalInfo
          selectedAssets={selectedAssets}
          onComplete={handleAuthWithGoogle}
          insights={insights}
        />
      )}
    </div>
  );
};

export default AssetOpportunities;

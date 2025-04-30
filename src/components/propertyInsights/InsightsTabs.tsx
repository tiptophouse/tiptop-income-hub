
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AssetCard from './AssetCard';
import { Sun, Wifi, Car, TreeDeciduous, Box, Antenna } from 'lucide-react';

const accentText = "text-[#8B5CF6] font-extrabold tracking-tight";
const glassStyle = "backdrop-blur-xl bg-white/70 dark:bg-[#18122B]/70 border border-white/40 shadow-[0_20px_60px_0_rgba(135,87,236,0.25),0_3px_12px_rgba(126,105,171,0.12)]";

interface InsightsTabsProps {
  insights: any;
  activeTab: string;
  setActiveTab: (v: string) => void;
}

// Icons used
const assetIcons = {
  rooftopSolar: <Sun className="h-6 w-6 text-amber-500" />,
  internetBandwidth: <Wifi className="h-6 w-6 text-blue-500" />,
  parkingSpace: <Car className="h-6 w-6 text-purple-500" />,
  gardenSpace: <TreeDeciduous className="h-6 w-6 text-green-500" />,
  storage: <Box className="h-6 w-6 text-orange-500" />,
  antenna5g: <Antenna className="h-6 w-6 text-indigo-500" />
};

// Helper function to determine if an opportunity is viable
const isOpportunityViable = (insights, type) => {
  if (!insights) return false;
  
  switch (type) {
    case 'rooftopSolar':
      return insights.rooftop_area_m2 > 0 || insights.estimated_solar_capacity_kw > 0;
    case 'internetBandwidth':
      return insights.unused_bandwidth_mbps > 0;
    case 'parkingSpace':
      return insights.parking_spaces > 0;
    case 'gardenSpace':
      return insights.garden_area_m2 > 0;
    case 'storage':
      return insights.storage_volume_m3 > 0;
    case 'antenna5g':
      return insights.rooftop_area_5g_m2 > 0;
    default:
      return false;
  }
};

const InsightsTabs: React.FC<InsightsTabsProps> = ({ insights, activeTab, setActiveTab }) => {
  // Filter viable opportunities
  const viableOpportunities = {
    rooftopSolar: isOpportunityViable(insights, 'rooftopSolar'),
    internetBandwidth: isOpportunityViable(insights, 'internetBandwidth'),
    parkingSpace: isOpportunityViable(insights, 'parkingSpace'),
    gardenSpace: isOpportunityViable(insights, 'gardenSpace'),
    storage: isOpportunityViable(insights, 'storage'),
    antenna5g: isOpportunityViable(insights, 'antenna5g'),
  };

  // Get the data for viable opportunities
  const getViableOpportunityCards = () => {
    const cards = [];

    if (viableOpportunities.rooftopSolar) {
      const solarValue = insights.estimated_solar_capacity_kw 
        ? Math.round(insights.estimated_solar_capacity_kw * 0.4) 
        : Math.round(insights.rooftop_area_m2 / 10);
      
      const solarDescription = insights.estimated_solar_capacity_kw
        ? `${insights.estimated_solar_capacity_kw}kW potential`
        : "Solar potential";
      
      cards.push(
        <AssetCard
          key="solar"
          color="border-l-amber-600"
          title="Rooftop Solar"
          main={`${Math.round(insights.rooftop_area_m2 * 10.764)} sq ft`}
          details={insights.regulatory_summary?.substring(0, 100) || solarDescription}
          value={`$${solarValue}/mo`}
          icon={assetIcons.rooftopSolar}
          glassStyle={glassStyle}
          accentText={accentText}
        />
      );
    }

    if (viableOpportunities.internetBandwidth) {
      const internetValue = Math.round(insights.unused_bandwidth_mbps * 0.8 / 10);
      
      cards.push(
        <AssetCard
          key="internet"
          color="border-l-blue-600"
          title="Internet"
          main={`${insights.unused_bandwidth_mbps} Mbps`}
          details="Share excess bandwidth capacity with ISP partners or local networks"
          value={`$${internetValue}/mo`}
          icon={assetIcons.internetBandwidth}
          glassStyle={glassStyle}
          accentText={accentText}
        />
      );
    }

    if (viableOpportunities.parkingSpace) {
      const parkingValue = insights.avg_parking_rate_usd_per_day 
        ? Math.round(insights.avg_parking_rate_usd_per_day * 30 * 0.7) 
        : insights.parking_spaces * 15;
      
      cards.push(
        <AssetCard
          key="parking"
          color="border-l-purple-600"
          title="Parking"
          main={`${insights.parking_spaces} spaces`}
          details={`Average parking rate: $${insights.avg_parking_rate_usd_per_day || 15}/day`}
          value={`$${parkingValue}/mo`}
          icon={assetIcons.parkingSpace}
          glassStyle={glassStyle}
          accentText={accentText}
        />
      );
    }
    
    if (viableOpportunities.gardenSpace) {
      const gardenValue = Math.round(insights.garden_area_m2 * 0.2);
      
      cards.push(
        <AssetCard
          key="garden"
          color="border-l-green-600"
          title="Garden"
          main={`${Math.round(insights.garden_area_m2 * 10.764)} sq ft`}
          details="Garden space for community or commercial use"
          value={`$${gardenValue || 80}/mo`}
          icon={assetIcons.gardenSpace}
          glassStyle={glassStyle}
          accentText={accentText}
        />
      );
    }
    
    if (viableOpportunities.storage) {
      const storageValue = Math.round(insights.storage_volume_m3 * 0.05);
      
      cards.push(
        <AssetCard
          key="storage"
          color="border-l-orange-600"
          title="Storage"
          main={`${Math.round(insights.storage_volume_m3)} cubic m`}
          details="Unused storage space for rental"
          value={`$${storageValue}/mo`}
          icon={assetIcons.storage}
          glassStyle={glassStyle}
          accentText={accentText}
        />
      );
    }
    
    if (viableOpportunities.antenna5g) {
      const antennaValue = Math.round(insights.rooftop_area_5g_m2 * 15);
      
      cards.push(
        <AssetCard
          key="antenna5g"
          color="border-l-indigo-600"
          title="5G Antenna"
          main={`${Math.round(insights.rooftop_area_5g_m2)} sq m`}
          details="Rooftop space for 5G antenna installation"
          value={`$${antennaValue}/mo`}
          icon={assetIcons.antenna5g}
          glassStyle={glassStyle}
          accentText={accentText}
        />
      );
    }

    return cards;
  };

  const viableCards = getViableOpportunityCards();
  
  if (viableCards.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No viable monetization opportunities were found for this property.</p>
      </div>
    );
  }

  return (
    <Tabs 
      defaultValue="overview" 
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2 mb-8 rounded-2xl bg-[#F3ECFF] shadow-md">
        <TabsTrigger 
          value="overview" 
          className="text-base sm:text-lg font-bold tracking-wide text-[#7E69AB] hover:text-[#8B5CF6] rounded-2xl py-2"
        >
          Overview
        </TabsTrigger>
        <TabsTrigger 
          value="details" 
          className="text-base sm:text-lg font-bold tracking-wide text-[#7E69AB] hover:text-[#8B5CF6] rounded-2xl py-2"
        >
          Asset Breakdown
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-8 animate-fade-in">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          {viableCards.slice(0, 2).map((card, index) => (
            <div key={index}>{card}</div>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="details" className="animate-fade-in">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          {viableCards}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default InsightsTabs;

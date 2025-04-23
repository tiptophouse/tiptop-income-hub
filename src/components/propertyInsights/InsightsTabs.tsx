
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AssetCard from './AssetCard';
import { Sun, Wifi, Car, TreeDeciduous } from 'lucide-react';

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
  gardenSpace: <TreeDeciduous className="h-6 w-6 text-green-500" />
};

// Helper function to determine if an opportunity is viable
const isOpportunityViable = (opportunity: any) => {
  if (!opportunity) return false;

  // Check if confidence is too low or if key metrics are zero/null
  const hasConfidence = opportunity.confidence > 0.2; // 20% minimum confidence
  
  // Check specific metrics for each type
  switch (true) {
    case 'usable_rooftop_sq_ft' in opportunity:
      return hasConfidence && opportunity.usable_rooftop_sq_ft > 0 && opportunity.est_monthly_savings_usd > 0;
    case 'shareable_capacity_mbps' in opportunity:
      return hasConfidence && opportunity.shareable_capacity_mbps > 0 && opportunity.est_monthly_revenue_usd > 0;
    case 'spaces_total' in opportunity:
      return hasConfidence && opportunity.spaces_available_for_rent > 0 && opportunity.est_monthly_rent_usd_total > 0;
    case 'garden_sq_ft' in opportunity:
      return hasConfidence && opportunity.garden_sq_ft > 0 && opportunity.est_monthly_revenue_usd > 0;
    default:
      return false;
  }
};

const InsightsTabs: React.FC<InsightsTabsProps> = ({ insights, activeTab, setActiveTab }) => {
  // Filter viable opportunities
  const viableOpportunities = {
    rooftopSolar: isOpportunityViable(insights?.monetization_opportunities?.rooftop_solar),
    internetBandwidth: isOpportunityViable(insights?.monetization_opportunities?.internet_bandwidth),
    parkingSpace: isOpportunityViable(insights?.monetization_opportunities?.parking_space),
    gardenSpace: isOpportunityViable(insights?.monetization_opportunities?.garden_space),
  };

  // Get the data for viable opportunities
  const getViableOpportunityCards = () => {
    const cards = [];

    if (viableOpportunities.rooftopSolar) {
      const solar = insights.monetization_opportunities.rooftop_solar;
      cards.push(
        <AssetCard
          key="solar"
          color="border-l-amber-600"
          title="Rooftop Solar"
          main={`${solar.usable_rooftop_sq_ft} sq ft`}
          details={solar.notes}
          value={`$${solar.est_monthly_savings_usd.toFixed(2)}/mo`}
          icon={assetIcons.rooftopSolar}
          glassStyle={glassStyle}
          accentText={accentText}
        />
      );
    }

    if (viableOpportunities.internetBandwidth) {
      const internet = insights.monetization_opportunities.internet_bandwidth;
      cards.push(
        <AssetCard
          key="internet"
          color="border-l-blue-600"
          title="Internet"
          main={`${internet.shareable_capacity_mbps} Mbps`}
          details={internet.notes}
          value={`$${internet.est_monthly_revenue_usd.toFixed(2)}/mo`}
          icon={assetIcons.internetBandwidth}
          glassStyle={glassStyle}
          accentText={accentText}
        />
      );
    }

    if (viableOpportunities.parkingSpace) {
      const parking = insights.monetization_opportunities.parking_space;
      cards.push(
        <AssetCard
          key="parking"
          color="border-l-purple-600"
          title="Parking"
          main={`${parking.spaces_available_for_rent} spaces`}
          details={parking.notes}
          value={`$${parking.est_monthly_rent_usd_total.toFixed(2)}/mo`}
          icon={assetIcons.parkingSpace}
          glassStyle={glassStyle}
          accentText={accentText}
        />
      );
    }

    if (viableOpportunities.gardenSpace) {
      const garden = insights.monetization_opportunities.garden_space;
      cards.push(
        <AssetCard
          key="garden"
          color="border-l-green-600"
          title="Garden"
          main={`${garden.garden_sq_ft} sq ft`}
          details={garden.notes}
          value={`$${garden.est_monthly_revenue_usd.toFixed(2)}/mo`}
          icon={assetIcons.gardenSpace}
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


import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AssetCard from './AssetCard';
import { TrendingUp, Home, Sun, Wifi, Car, TreeDeciduous, Info } from 'lucide-react';

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
}

const InsightsTabs: React.FC<InsightsTabsProps> = ({ insights, activeTab, setActiveTab }) => (
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
        <div className="rounded-2xl bg-gradient-to-br from-[#D6BCFA] via-[#F3ECFF] to-white shadow-xl p-6 flex flex-col items-start">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="h-7 w-7 text-[#B993FE]" />
            <span className="font-extrabold text-[#8B5CF6] text-lg tracking-wide truncate max-w-[180px]">Monthly Potential</span>
          </div>
          <div className="text-4xl sm:text-5xl font-extrabold text-[#6E59A5] mb-3 line-clamp-1 max-w-full">
            {insights?.totalMonthlyPotential || "$300-570"}
          </div>
          <span className="uppercase text-sm font-extrabold text-[#B993FE] tracking-widest">estimated range</span>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-[#E5DEFF] via-[#F3ECFF] to-white shadow-xl p-6 flex flex-col items-start">
          <div className="flex items-center gap-3 mb-3">
            <Home className="h-7 w-7 text-[#A0E884]" />
            <span className="font-extrabold text-[#7E9C6F] text-lg tracking-wide truncate max-w-[180px]">Assets Found</span>
          </div>
          <div className="text-4xl sm:text-5xl font-extrabold text-[#7E9C6F] mb-3">4</div>
          <span className="uppercase text-sm font-extrabold text-[#B9D08F] tracking-widest">monetizable</span>
        </div>
      </div>
    </TabsContent>
    <TabsContent value="details" className="animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        <AssetCard
          color="border-l-purple-600"
          title="Rooftop Solar"
          main={insights?.rooftopSolar?.potential || "High"}
          details={insights?.rooftopSolar?.sqFootage || "706 sq ft"}
          value={insights?.rooftopSolar?.monthlySavings || "$100-150 /mo"}
          icon={assetIcons.rooftopSolar}
          glassStyle={glassStyle}
          accentText={accentText}
        />
        <AssetCard
          color="border-l-blue-600"
          title="Internet"
          main={insights?.internetBandwidth?.potential || "Medium"}
          details={insights?.internetBandwidth?.sharingCapacity || "60-70%"}
          value={insights?.internetBandwidth?.monthlyEarnings || "$80-120 /mo"}
          icon={assetIcons.internetBandwidth}
          glassStyle={glassStyle}
          accentText={accentText}
        />
        <AssetCard
          color="border-l-orange-600"
          title="Parking"
          main={insights?.parkingSpace?.available || "1-2 spaces"}
          details={insights?.parkingSpace?.details || "Prime location"}
          value={insights?.parkingSpace?.monthlyValue || "$70-200 /mo"}
          icon={assetIcons.parkingSpace}
          glassStyle={glassStyle}
          accentText={accentText}
        />
        <AssetCard
          color="border-l-green-600"
          title="Garden"
          main={insights?.gardenSpace?.communityValue || "Medium-High"}
          details={insights?.gardenSpace?.sqFootage || "104 sq ft"}
          value={insights?.gardenSpace?.monthlyPotential || "$50-100 /mo"}
          icon={assetIcons.gardenSpace}
          glassStyle={glassStyle}
          accentText={accentText}
        />
      </div>
    </TabsContent>
  </Tabs>
);

export default InsightsTabs;


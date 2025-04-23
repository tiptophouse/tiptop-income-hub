
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AssetAdditionalInfoProps {
  selectedAssets: string[];
  onComplete?: () => void;
}

// Demo backend data, in real usage these would come from props or API
const ASSET_BACKEND_DETAILS: Record<string, React.ReactNode> = {
  solar: (
    <>
      <Card className="border-l-4 border-l-yellow-500 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg text-[#6E59A5]">Rooftop Solar Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#552B1B] mb-1">
              Roof Area Available (sq. ft)
            </label>
            <input type="text" defaultValue="750" className="w-full p-2 border border-[#E5DEFF] rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#552B1B] mb-1">
              Roof Type
            </label>
            <select className="w-full p-2 border border-[#E5DEFF] rounded-md" defaultValue="pitched">
              <option value="flat">Flat</option>
              <option value="pitched">Pitched</option>
              <option value="curved">Curved</option>
            </select>
          </div>
        </CardContent>
      </Card>
    </>
  ),
  bandwidth: (
    <>
      <Card className="border-l-4 border-l-blue-500 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg text-[#6E59A5]">Internet Bandwidth Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-[#552B1B] mb-2">
              Packet Loss: <span className="font-semibold text-green-600">0.5% (Excellent)</span>
            </p>
            <label className="block text-sm font-medium text-[#552B1B] mb-1">
              Suggested Bandwidth Allowance
            </label>
            <select className="w-full p-2 border border-[#E5DEFF] rounded-md" defaultValue="500">
              <option value="100">Limit to 100MB</option>
              <option value="500">Limit to 500MB</option>
              <option value="unlimited">Unlimited</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#552B1B] mb-1">
              Available Hours
            </label>
            <select className="w-full p-2 border border-[#E5DEFF] rounded-md" defaultValue="offpeak">
              <option value="night">Night Only (12am-6am)</option>
              <option value="offpeak">Off-peak Hours</option>
              <option value="all">All Hours</option>
            </select>
          </div>
        </CardContent>
      </Card>
    </>
  ),
  parking: (
    <>
      <Card className="border-l-4 border-l-purple-500 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg text-[#6E59A5]">Parking Space Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-[#552B1B] mb-2">
              Spaces Available: <span className="font-semibold">2</span>
            </p>
            <label className="block text-sm font-medium text-[#552B1B] mb-1">
              Spaces to Rent
            </label>
            <select className="w-full p-2 border border-[#E5DEFF] rounded-md" defaultValue="2">
              <option value="1">1 Space</option>
              <option value="2">2 Spaces</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#552B1B] mb-1">
              Availability Schedule
            </label>
            <select className="w-full p-2 border border-[#E5DEFF] rounded-md" defaultValue="weekends">
              <option value="weekdays">Weekdays Only</option>
              <option value="weekends">Weekends Only</option>
              <option value="all">All Days</option>
            </select>
          </div>
        </CardContent>
      </Card>
    </>
  ),
  pool: (
    <>
      <Card className="border-l-4 border-l-blue-500 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg text-[#6E59A5]">Swimming Pool Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#552B1B] mb-1">
              Pool Size
            </label>
            <select className="w-full p-2 border border-[#E5DEFF] rounded-md" defaultValue="medium">
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#552B1B] mb-1">
              Available Months
            </label>
            <select className="w-full p-2 border border-[#E5DEFF] rounded-md" defaultValue="summer">
              <option value="summer">Summer Only</option>
              <option value="extended">Extended Season</option>
              <option value="all">Year-Round (Heated)</option>
            </select>
          </div>
        </CardContent>
      </Card>
    </>
  ),
  storage: (
    <>
      <Card className="border-l-4 border-l-green-500 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg text-[#6E59A5]">Storage Space Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#552B1B] mb-1">
              Space Type
            </label>
            <select className="w-full p-2 border border-[#E5DEFF] rounded-md" defaultValue="garage">
              <option value="garage">Garage</option>
              <option value="basement">Basement</option>
              <option value="shed">Shed/Outbuilding</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#552B1B] mb-1">
              Approximate Size (sq. ft)
            </label>
            <input type="text" defaultValue="120" className="w-full p-2 border border-[#E5DEFF] rounded-md" />
          </div>
        </CardContent>
      </Card>
    </>
  ),
};

const AssetAdditionalInfo: React.FC<AssetAdditionalInfoProps> = ({
  selectedAssets,
  onComplete,
}) => {
  if (selectedAssets.length === 0) return null;

  return (
    <div className="mt-16" id="additional-info">
      <h2 className="text-2xl font-bold mb-6 text-[#6E59A5]">
        Additional Information Required
      </h2>
      <div className="space-y-8">
        {selectedAssets.map(asset => ASSET_BACKEND_DETAILS[asset] || null)}
        <div className="flex justify-center mt-8">
          <Button
            className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-8 py-6 text-lg rounded-full"
            onClick={onComplete}
          >
            Complete & View Earnings Estimate
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssetAdditionalInfo;

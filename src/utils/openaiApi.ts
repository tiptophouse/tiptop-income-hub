
import { supabase } from '@/integrations/supabase/client';

interface PropertyInsight {
  address: string;
  rooftopSolar: {
    potential: string;
    monthlySavings: string;
    sqFootage: string;
  };
  internetBandwidth: {
    potential: string;
    sharingCapacity: string;
    monthlyEarnings: string;
  };
  parkingSpace: {
    available: string;
    monthlyValue: string;
    details: string;
  };
  gardenSpace: {
    sqFootage: string;
    communityValue: string;
    monthlyPotential: string;
  };
  totalMonthlyPotential: string;
  propertySize?: string;
}

export const getPropertyInsightsFromAI = async (address: string): Promise<PropertyInsight> => {
  try {
    console.log("Fetching AI insights for address:", address);
    
    // Call our Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('property-insights', {
      body: { address }
    });

    if (error) {
      console.error("Error calling property-insights function:", error);
      return getDefaultPropertyInsights(address);
    }

    console.log("AI response received:", data);
    
    if (!data) {
      console.error("No data returned from property-insights function");
      return getDefaultPropertyInsights(address);
    }

    // If our function returned defaultData due to an error, it will be nested
    if (data.defaultData) {
      console.warn("Using default data due to API error:", data.error);
      return { ...data.defaultData, address };
    }

    // Return the data with the address
    return {
      address,
      ...data
    };
  } catch (error) {
    console.error("Error getting AI insights:", error);
    return getDefaultPropertyInsights(address);
  }
};

// Provides default values when the API call fails
const getDefaultPropertyInsights = (address: string): PropertyInsight & { propertySize?: string } => {
  return {
    address,
    rooftopSolar: {
      potential: "High",
      monthlySavings: "$100-150",
      sqFootage: "600 sq ft"
    },
    internetBandwidth: {
      potential: "Medium",
      sharingCapacity: "60-70%",
      monthlyEarnings: "$80-120"
    },
    parkingSpace: {
      available: "1-2 spaces",
      monthlyValue: "$70-200",
      details: "Available for hourly/daily rental"
    },
    gardenSpace: {
      sqFootage: "150 sq ft",
      communityValue: "Medium-High",
      monthlyPotential: "$50-100"
    },
    totalMonthlyPotential: "$300-570",
    propertySize: "2,000 sq ft (default estimate)"
  };
};

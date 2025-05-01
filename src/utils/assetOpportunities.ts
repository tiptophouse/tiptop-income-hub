
/**
 * Utility functions for asset opportunity calculations
 */

export interface AssetOpportunity {
  id: string;
  title: string;
  icon: JSX.Element;
  estimatedIncome: string;
  details: string;
}

export const calculateAssetOpportunities = (insights: any | null): AssetOpportunity[] => {
  if (!insights) {
    return [];
  }
  
  const opportunities: AssetOpportunity[] = [];
  
  // Solar panels (available if rooftop area exists)
  if (insights.rooftop_area_m2 > 0 || insights.estimated_solar_capacity_kw > 0) {
    const solarIncome = `$${insights.estimated_solar_capacity_kw * 15}/month`;
    
    const solarDetails = insights.rooftop_area_m2 
      ? `${Math.round(insights.rooftop_area_m2 * 10.764)} sq ft usable with ${insights.estimated_solar_capacity_kw}kW potential`
      : "800 sq ft usable with 6.5kW potential";
    
    opportunities.push({
      id: "solar",
      title: "Rooftop Solar",
      icon: null, // Will be set in component
      estimatedIncome: solarIncome,
      details: solarDetails
    });
  }
  
  // Internet bandwidth (available if unused bandwidth exists)
  if (insights.unused_bandwidth_mbps > 0) {
    const internetIncome = `$${insights.unused_bandwidth_mbps * 5}/month`;
    const internetDetails = `${insights.unused_bandwidth_mbps} Mbps available for sharing`;
    
    opportunities.push({
      id: "internet",
      title: "Internet Bandwidth",
      icon: null, // Will be set in component
      estimatedIncome: internetIncome,
      details: internetDetails
    });
  }
  
  // Parking space (available if parking spaces exist)
  if (insights.parking_spaces > 0) {
    const dailyRate = insights.avg_parking_rate_usd_per_day || 15;
    const parkingIncome = `$${Math.round(insights.parking_spaces * dailyRate * 6)}/month`;
    const parkingDetails = `${insights.parking_spaces} spaces available for rent`;
    
    opportunities.push({
      id: "parking",
      title: "Parking Space",
      icon: null, // Will be set in component
      estimatedIncome: parkingIncome,
      details: parkingDetails
    });
  }
  
  // Garden space (available if garden area exists)
  if (insights.garden_area_m2 > 0) {
    const gardenIncome = `$${Math.round(insights.garden_area_m2 * 3)}/month`;
    const gardenDetails = `${Math.round(insights.garden_area_m2 * 10.764)} sq ft available`;
    
    opportunities.push({
      id: "garden",
      title: "Garden Space",
      icon: null, // Will be set in component
      estimatedIncome: gardenIncome,
      details: gardenDetails
    });
  }
  
  // Storage space (if storage volume exists)
  if (insights.storage_volume_m3 > 0) {
    const storageIncome = `$${Math.round(insights.storage_volume_m3 * 8)}/month`;
    const storageDetails = `${Math.round(insights.storage_volume_m3)} cubic meters available`;
    
    opportunities.push({
      id: "storage",
      title: "Storage Space",
      icon: null, // Will be set in component
      estimatedIncome: storageIncome,
      details: storageDetails
    });
  }
  
  // 5G antenna (if rooftop 5G area exists)
  if (insights.rooftop_area_5g_m2 > 0) {
    const antennaIncome = `$${Math.round(insights.rooftop_area_5g_m2 * 15)}/month`;
    const antennaDetails = `${Math.round(insights.rooftop_area_5g_m2)} sq meters available for 5G`;
    
    opportunities.push({
      id: "antenna",
      title: "5G Antenna Hosting",
      icon: null, // Will be set in component
      estimatedIncome: antennaIncome,
      details: antennaDetails
    });
  }
  
  // Swimming pool (if pool exists)
  if (insights.pool && insights.pool.present) {
    const poolIncome = `$${Math.round(insights.pool.area_m2 * 10)}/month`;
    const poolDetails = `${Math.round(insights.pool.area_m2 * 10.764)} sq ft pool available`;
    
    opportunities.push({
      id: "pool",
      title: "Swimming Pool",
      icon: null, // Will be set in component
      estimatedIncome: poolIncome,
      details: poolDetails
    });
  }
  
  return opportunities;
}

// Default opportunities if no insights are available
export const getDefaultOpportunities = (): AssetOpportunity[] => {
  return [
    {
      id: "solar",
      title: "Rooftop Solar",
      icon: null, // Will be set in component
      estimatedIncome: "$120/month",
      details: "800 sq ft usable with 6.5kW potential"
    },
    {
      id: "internet",
      title: "Internet Bandwidth",
      icon: null, // Will be set in component
      estimatedIncome: "$200/month",
      details: "100 Mbps available for sharing"
    },
    {
      id: "parking",
      title: "Parking Space",
      icon: null, // Will be set in component
      estimatedIncome: "$300/month",
      details: "2 spaces available for rent"
    },
    {
      id: "garden",
      title: "Garden Space",
      icon: null, // Will be set in component
      estimatedIncome: "$80/month",
      details: "300 sq ft available"
    }
  ];
};

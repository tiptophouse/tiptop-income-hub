
import { toast } from '@/components/ui/use-toast';

interface WeatherServiceProps {
  location: { lat: number; lng: number };
  onSuccess: (data: any) => void;
  onError?: () => void;
}

export interface WeatherData {
  temperature: number;
  conditions: string;
  humidity: number;
  windSpeed: number;
  annualSunshine: number;
  annualRainfall: number;
  solarIrradiance: number;
  sunHoursPerDay: number;
}

export interface SolarEarningsData {
  roofUsableArea: number;
  estimatedAnnualProduction: number;
  annualEarnings: number;
  paybackPeriod: number;
  co2Reduction: number;
  roiPercentage: number;
}

// This function fetches weather data for a location
export const fetchWeatherData = async ({ location, onSuccess, onError }: WeatherServiceProps) => {
  try {
    // In a real application, you would use OpenWeatherMap, Weather API, etc.
    // For demo purposes, we'll simulate weather data
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate smarter weather data based on location and latitude
    // In a real app, you'd fetch this from a weather API
    const baseTemp = Math.floor(
      // Use latitude to approximate temperature zones
      70 - Math.abs(location.lat - 35) * 1.2
    );
    
    // Estimate annual sunshine hours based on latitude
    // Regions closer to equator typically have more sunshine
    const latitudeFactor = Math.cos(Math.abs(location.lat) * Math.PI / 180);
    const baseAnnualSunshine = Math.floor(latitudeFactor * 120 + 180);
    
    // Calculate solar irradiance (kWh/m²/day) based on latitude
    // Higher values near equator, lower at poles
    const solarIrradiance = Number((latitudeFactor * 3.5 + 2).toFixed(2));
    
    // Average sun hours per day
    const sunHoursPerDay = Number((latitudeFactor * 4 + 3).toFixed(1));
    
    // Select conditions based on latitude and some randomness
    const conditionOptions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Clear'];
    const conditionWeights = [
      latitudeFactor * 0.4, // Sunny
      0.3, // Partly Cloudy
      (1 - latitudeFactor) * 0.3, // Cloudy
      (1 - latitudeFactor) * 0.2, // Rainy
      latitudeFactor * 0.3 // Clear
    ];
    
    // Weighted random selection of weather condition
    const totalWeight = conditionWeights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    let conditionIndex = 0;
    
    for (let i = 0; i < conditionWeights.length; i++) {
      random -= conditionWeights[i];
      if (random <= 0) {
        conditionIndex = i;
        break;
      }
    }
    
    const weatherData: WeatherData = {
      temperature: baseTemp + Math.floor(Math.random() * 10),
      conditions: conditionOptions[conditionIndex],
      humidity: Math.floor(Math.random() * 60) + 30,
      windSpeed: Math.floor(Math.random() * 20),
      annualSunshine: baseAnnualSunshine,
      annualRainfall: Math.floor((1 - latitudeFactor) * 20) + 15,
      solarIrradiance,
      sunHoursPerDay
    };
    
    onSuccess(weatherData);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    toast({
      title: "Weather Data Error",
      description: "Unable to fetch weather data for this location.",
      variant: "destructive"
    });
    if (onError) onError();
  }
};

// This utility predicts potential solar earnings based on weather data
export const predictSolarEarnings = (weatherData: WeatherData, propertySize: number): SolarEarningsData | null => {
  if (!weatherData || !propertySize) return null;
  
  // More sophisticated algorithm to estimate solar potential
  const roofUsableArea = propertySize * 0.4; // Assume 40% of property size is usable roof
  const solarPanelEfficiency = 0.18; // 18% efficiency for typical modern solar panels
  const electricityRate = 0.16; // Average $0.16 per kWh in the US
  const installationCostPerSqFt = 275; // $275 per square foot for installation
  
  // Annual production calculation using solar irradiance
  const annualProduction = roofUsableArea * weatherData.solarIrradiance * 365 * solarPanelEfficiency;
  
  // Account for weather conditions
  const weatherEfficiencyFactor = getWeatherEfficiencyFactor(weatherData.conditions);
  const adjustedProduction = annualProduction * weatherEfficiencyFactor;
  
  // Calculate annual earnings
  const annualEarnings = adjustedProduction * electricityRate;
  
  // CO2 reduction (lbs) - average US grid emits ~0.92 lbs CO2 per kWh
  const co2Reduction = adjustedProduction * 0.92;
  
  // Payback period calculation
  const installationCost = roofUsableArea * installationCostPerSqFt;
  const paybackPeriod = installationCost / annualEarnings;
  
  // ROI percentage (annual)
  const roiPercentage = (annualEarnings / installationCost) * 100;
  
  return {
    roofUsableArea: Math.floor(roofUsableArea),
    estimatedAnnualProduction: Math.floor(adjustedProduction),
    annualEarnings: Math.floor(annualEarnings),
    paybackPeriod: Number(paybackPeriod.toFixed(1)),
    co2Reduction: Math.floor(co2Reduction),
    roiPercentage: Number(roiPercentage.toFixed(1))
  };
};

// Helper function to calculate efficiency factor based on weather conditions
function getWeatherEfficiencyFactor(condition: string): number {
  switch (condition) {
    case 'Sunny':
      return 1.0;
    case 'Clear':
      return 0.95;
    case 'Partly Cloudy':
      return 0.8;
    case 'Cloudy':
      return 0.6;
    case 'Rainy':
      return 0.45;
    default:
      return 0.7;
  }
}

// Calculate bandwidth earnings potential based on location
export const predictBandwidthEarnings = (location: { lat: number; lng: number }) => {
  // Check if location is in urban area (simplified for demo)
  const isUrbanArea = Math.random() > 0.3; // 70% chance of being in urban area
  
  const baseEarningPerMonth = isUrbanArea ? 45 : 25;
  const variability = isUrbanArea ? 15 : 10;
  
  const monthlyEarning = baseEarningPerMonth + Math.floor(Math.random() * variability);
  const annualEarning = monthlyEarning * 12;
  
  return {
    monthlyEarning,
    annualEarning,
    isUrbanArea
  };
};

// Calculate parking space earnings potential
export const predictParkingEarnings = (location: { lat: number; lng: number }, propertySize: number) => {
  // Check if location has parking potential
  const hasParking = propertySize > 1000; // Simple check if property is large enough
  
  if (!hasParking) {
    return {
      hasParking: false,
      monthlyEarning: 0,
      annualEarning: 0
    };
  }
  
  // Urban locations earn more for parking
  const urbanFactor = 0.8 - (Math.abs(location.lat) / 90) * 0.4;
  const baseRate = 5 + (urbanFactor * 20); // Daily rate between $5-$25 based on urbanicity
  
  const occupancyRate = 0.6; // 60% average occupancy
  const monthlyEarning = Math.floor(baseRate * 30 * occupancyRate);
  const annualEarning = monthlyEarning * 12;
  
  return {
    hasParking,
    monthlyEarning,
    annualEarning
  };
};

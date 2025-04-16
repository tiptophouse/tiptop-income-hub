
import { toast } from '@/components/ui/use-toast';

interface WeatherServiceProps {
  location: { lat: number; lng: number };
  onSuccess: (data: any) => void;
  onError?: () => void;
}

// This function fetches weather data for a location
export const fetchWeatherData = async ({ location, onSuccess, onError }: WeatherServiceProps) => {
  try {
    // In a real application, you would use OpenWeatherMap, Weather API, etc.
    // For demo purposes, we'll simulate weather data
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate random weather data based on location
    // In real app, you'd fetch this from a weather API
    const baseTemp = Math.floor(
      // Use latitude to approximate temperature zones
      70 - Math.abs(location.lat - 35) * 1.2
    );
    
    const weatherData = {
      temperature: baseTemp + Math.floor(Math.random() * 10),
      conditions: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Clear'][Math.floor(Math.random() * 5)],
      humidity: Math.floor(Math.random() * 60) + 30,
      windSpeed: Math.floor(Math.random() * 20),
      annualSunshine: Math.floor(Math.random() * 100) + 200,
      annualRainfall: Math.floor(Math.random() * 30) + 20,
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
export const predictSolarEarnings = (weatherData: any, propertySize: number) => {
  if (!weatherData || !propertySize) return null;
  
  // Simple algorithm to estimate solar potential
  // In a real app, this would use sophisticated models with actual weather and roof data
  const roofUsableArea = propertySize * 0.4; // Assume 40% of property size is usable roof
  const sunshineHours = weatherData.annualSunshine * 5; // Approx hours of sunshine per day
  const solarEfficiency = 0.15; // 15% efficiency for typical solar panels
  const electricityRate = 0.15; // Average $0.15 per kWh in the US
  
  // Calculate estimated annual production in kWh
  const estimatedAnnualProduction = roofUsableArea * sunshineHours * solarEfficiency * 1; // 1 kW per sq meter
  
  // Calculate annual earnings
  const annualEarnings = estimatedAnnualProduction * electricityRate;
  
  return {
    roofUsableArea: Math.floor(roofUsableArea),
    estimatedAnnualProduction: Math.floor(estimatedAnnualProduction),
    annualEarnings: Math.floor(annualEarnings),
    paybackPeriod: Math.ceil((roofUsableArea * 250) / annualEarnings), // Approx $250 per sq ft installation cost
  };
};

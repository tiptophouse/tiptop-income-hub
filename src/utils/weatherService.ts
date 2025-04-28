
interface FetchWeatherDataProps {
  location: { lat: number; lng: number };
  onSuccess: (data: any) => void;
  onError: (error: any) => void;  // Updated to accept an error parameter
}

export const fetchWeatherData = ({ location, onSuccess, onError }: FetchWeatherDataProps): void => {
  try {
    // This is a mock implementation - in a real app, you would call a weather API
    // For demo purposes, we'll return simulated data
    const mockWeatherData = {
      temperature: Math.floor(Math.random() * 30) + 10, // 10-40°C
      condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
      humidity: Math.floor(Math.random() * 50) + 30, // 30-80%
      wind: Math.floor(Math.random() * 30), // 0-30 km/h
      uvIndex: Math.floor(Math.random() * 10) + 1, // 1-10
      forecast: Array(5).fill(null).map(() => ({
        temp: Math.floor(Math.random() * 30) + 10,
        condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
      }))
    };
    
    // Simulate API delay
    setTimeout(() => {
      onSuccess(mockWeatherData);
    }, 500);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    onError(error);
  }
};

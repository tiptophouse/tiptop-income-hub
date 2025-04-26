
import React from 'react';

interface WeatherDisplayProps {
  temperature: string;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ temperature }) => {
  return (
    <div className="absolute bottom-4 left-4 bg-black/70 text-white rounded-full p-2 flex items-center justify-center">
      <span className="text-yellow-300 mr-1">☀</span>{temperature}
    </div>
  );
};

export default WeatherDisplay;

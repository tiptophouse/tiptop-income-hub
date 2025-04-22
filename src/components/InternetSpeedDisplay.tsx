import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Wifi, Info } from 'lucide-react';
import { measureInternetSpeed } from '@/utils/speedTest';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
const InternetSpeedDisplay = () => {
  const [speedTest, setSpeedTest] = useState<{
    download: number;
    upload: number;
    latency: number;
  } | null>(null);
  const [dataSource, setDataSource] = useState<string>("Simulated data");
  useEffect(() => {
    const runSpeedTest = async () => {
      try {
        const result = await measureInternetSpeed();
        setSpeedTest(result);
        // The source is hardcoded as "Simulated" since we're using mock data
        setDataSource("Simulated data");
      } catch (error) {
        console.error("Error measuring internet speed:", error);
      }
    };

    // Run initial speed test
    runSpeedTest();

    // Update speed test every 30 seconds
    const interval = setInterval(runSpeedTest, 30000);
    return () => clearInterval(interval);
  }, []);
  return <div className="fixed bottom-4 right-4 z-50">
      <Card className="bg-tiptop-accent text-white w-[220px]">
        
        
      </Card>
    </div>;
};
export default InternetSpeedDisplay;
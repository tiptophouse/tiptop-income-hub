
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Wifi, Info } from 'lucide-react';
import { measureInternetSpeed } from '@/utils/speedTest';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const InternetSpeedDisplay = () => {
  const [speedTest, setSpeedTest] = useState<{ download: number; upload: number; latency: number } | null>(null);
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

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="bg-tiptop-accent text-white w-[220px]">
        <CardHeader className="pb-1">
          <CardTitle className="flex items-center justify-between text-white text-sm">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4" />
              Internet Speed
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help">
                    <Info className="h-4 w-4 text-white/70 hover:text-white" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-800 text-white border-gray-700">
                  <p className="text-xs">Data source: {dataSource}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription className="text-white/70 text-xs">
            Source: {dataSource}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {speedTest ? (
            <div className="space-y-1">
              <div className="text-lg font-bold">{speedTest.download} Mbps</div>
              <div className="text-xs opacity-80">
                ↑ {speedTest.upload} Mbps | {speedTest.latency}ms
              </div>
            </div>
          ) : (
            <div className="text-sm">Testing speed...</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InternetSpeedDisplay;

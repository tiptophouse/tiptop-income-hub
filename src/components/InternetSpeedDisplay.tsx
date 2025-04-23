
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

  if (!speedTest) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="bg-tiptop-accent text-white w-[220px]">
        <CardHeader className="p-3 pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-1.5">
              <Wifi className="h-4 w-4" />
              Internet Speed
            </CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="rounded-full p-1 hover:bg-white/20">
                    <Info className="h-3.5 w-3.5" />
                    <span className="sr-only">Info</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-white text-tiptop-dark border-tiptop-tertiary text-xs p-2">
                  <p>Based on {dataSource}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent className="p-3 pt-2">
          <div className="grid grid-cols-3 gap-1 text-xs">
            <div>
              <p className="text-white/70">Download</p>
              <p className="font-semibold">{speedTest.download} Mbps</p>
            </div>
            <div>
              <p className="text-white/70">Upload</p>
              <p className="font-semibold">{speedTest.upload} Mbps</p>
            </div>
            <div>
              <p className="text-white/70">Latency</p>
              <p className="font-semibold">{speedTest.latency} ms</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InternetSpeedDisplay;

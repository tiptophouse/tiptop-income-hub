
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wifi } from 'lucide-react';
import { measureInternetSpeed } from '@/utils/speedTest';

const InternetSpeedDisplay = () => {
  const [speedTest, setSpeedTest] = useState<{ download: number; upload: number; latency: number } | null>(null);

  useEffect(() => {
    const runSpeedTest = async () => {
      const result = await measureInternetSpeed();
      setSpeedTest(result);
    };

    // Run initial speed test
    runSpeedTest();

    // Update speed test every 30 seconds
    const interval = setInterval(runSpeedTest, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="bg-tiptop-accent text-white w-[200px]">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-white text-sm">
            <Wifi className="h-4 w-4" />
            Internet Speed
          </CardTitle>
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

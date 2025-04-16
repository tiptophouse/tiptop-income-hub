
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getPropertyInsights } from '@/utils/openai';
import { Building, TrendingUp, Home, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PropertyInsightsProps {
  address: string;
  className?: string;
}

const PropertyInsights: React.FC<PropertyInsightsProps> = ({ address, className }) => {
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPropertyInsights(address);
      setInsights(data);
    } catch (error) {
      console.error("Error in PropertyInsights component:", error);
      setError("Failed to fetch property insights. Please try again later.");
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  useEffect(() => {
    if (!address) return;
    fetchInsights();
  }, [address]);

  const handleRetry = () => {
    setRetrying(true);
    fetchInsights();
  };

  if (!address) return null;

  return (
    <Card className={`${className} shadow-md hover:shadow-lg transition-shadow duration-300`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5 text-tiptop-accent" />
          Property Insights
        </CardTitle>
        <CardDescription>AI-generated analysis for {address}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[70%]" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : error ? (
          <div className="space-y-4">
            <Alert variant="destructive" className="bg-red-100 border-red-400">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
            <button 
              onClick={handleRetry}
              disabled={retrying}
              className="text-tiptop-accent hover:underline flex items-center gap-1 text-sm"
            >
              {retrying ? "Retrying..." : "Try Again"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm whitespace-pre-line">{insights}</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4 pt-2 border-t">
              <TrendingUp className="h-3 w-3" />
              <span>Analysis powered by AI</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyInsights;

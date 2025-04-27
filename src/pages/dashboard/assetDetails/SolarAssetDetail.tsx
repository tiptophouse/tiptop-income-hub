
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, FileText, Sun, Leaf, TrendingUp, Calendar, ArrowUpDown, Zap } from 'lucide-react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import { SolarAnalyticsService } from '@/utils/services/SolarAnalyticsService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { toast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';

// Example property analysis data
const examplePropertyAnalysis = {
  roofSize: 1200,
  solarPotentialKw: 5.8,
  solarFinancials: {
    installationCost: 14000,
    annualSavings: 1450,
    breakEvenYears: 9.6,
    lifetimeValue: 22500,
    billBeforeSolar: 2200,
    billAfterSolar: 750,
    monthlyIncome: 120.83,
    twentyYearProfit: 15000,
    systemSizeKw: 5.8,
    panelLifetimeYears: 25
  },
  solarPerformance: {
    yearlyEnergyKwh: 7800,
    maxSunshineHours: 2850,
    avgDailySunshine: 7.8,
    carbonOffsetKg: 3900,
    roofDirection: 175,
    roofSlope: 18,
    installationComplexity: 'Medium' as const,
    efficiencyRating: 82
  },
  locationData: {
    postalCode: "94103",
    regionCode: "US-CA",
    latitude: 37.773,
    longitude: -122.417
  },
  internetMbps: 100,
  parkingSpaces: 2,
  gardenSqFt: 300,
  hasPool: false,
  hasGarden: true,
  hasParking: true,
  hasEVCharging: false
};

const efficiencyLabels = {
  direction: {
    0: 'North',
    90: 'East',
    180: 'South',
    270: 'West',
    360: 'North'
  },
  slope: {
    0: 'Flat',
    15: 'Low',
    30: 'Medium',
    45: 'Steep'
  }
};

const getDirectionLabel = (degrees: number): string => {
  if (degrees >= 337.5 || degrees < 22.5) return 'North';
  if (degrees >= 22.5 && degrees < 67.5) return 'Northeast';
  if (degrees >= 67.5 && degrees < 112.5) return 'East';
  if (degrees >= 112.5 && degrees < 157.5) return 'Southeast';
  if (degrees >= 157.5 && degrees < 202.5) return 'South';
  if (degrees >= 202.5 && degrees < 247.5) return 'Southwest';
  if (degrees >= 247.5 && degrees < 292.5) return 'West';
  return 'Northwest';
};

const SolarAssetDetailPage = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('performance');
  const [analytics, setAnalytics] = useState(SolarAnalyticsService.generateAnalytics(examplePropertyAnalysis));
  
  useEffect(() => {
    // This would fetch real data in a production app
    setAnalytics(SolarAnalyticsService.generateAnalytics(examplePropertyAnalysis));
  }, []);
  
  const handleDownloadStatement = () => {
    toast({
      title: "Statement Downloaded",
      description: "Your solar performance statement has been downloaded."
    });
  };
  
  const handleViewContract = () => {
    toast({
      title: "Contract Viewed",
      description: "Opening your solar contract in a new window."
    });
  };
  
  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  return (
    <DashboardLayout onSignOut={() => {}}>
      <div className="p-2 sm:p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
          <div className="mb-2 sm:mb-0">
            <h1 className="text-xl sm:text-2xl font-medium">Solar Panel Asset</h1>
            <p className="text-muted-foreground text-sm">Monetized with SolarCity</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 mb-4 sm:mb-8">
          <Card className="md:col-span-1">
            <CardHeader className={`${isMobile ? 'p-3 pb-2' : ''}`}>
              <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
                <Sun className="h-5 w-5 text-amber-500" />
                System Details
              </CardTitle>
            </CardHeader>
            <CardContent className={`${isMobile ? 'p-3 pt-1' : ''}`}>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <p className="text-sm font-medium">System Size</p>
                  <p>{examplePropertyAnalysis.solarFinancials.systemSizeKw} kW</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Panels Installed</p>
                  <p>{analytics.installationMetrics.panelsCount} x {Math.round(examplePropertyAnalysis.solarFinancials.systemSizeKw * 1000 / analytics.installationMetrics.panelsCount)}W panels</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Installation Date</p>
                  <p>March 15, 2023</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Contract Length</p>
                  <p>{examplePropertyAnalysis.solarFinancials.panelLifetimeYears} years</p>
                </div>
                <div className="pt-2">
                  <p className="text-sm font-medium mb-1">Roof Coverage</p>
                  <div className="flex items-center gap-2">
                    <Progress value={analytics.installationMetrics.roofCoverage} className="h-2" />
                    <span className="text-sm">{analytics.installationMetrics.roofCoverage}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader className={`${isMobile ? 'p-3 pb-2' : ''}`}>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Financial Performance
                </CardTitle>
                <div className="text-right">
                  <span className="text-xs text-gray-500">Monthly Revenue</span>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(analytics.financialMetrics.monthlyRevenue)}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className={`${isMobile ? 'p-3 pt-1' : ''} h-48 sm:h-64`}>
              <Tabs defaultValue="monthly" className="w-full">
                <div className="flex justify-between mb-2">
                  <TabsList className="h-8">
                    <TabsTrigger 
                      value="monthly" 
                      className="text-xs px-3 py-1 h-8"
                    >
                      Monthly
                    </TabsTrigger>
                    <TabsTrigger 
                      value="yearly" 
                      className="text-xs px-3 py-1 h-8"
                    >
                      Yearly
                    </TabsTrigger>
                  </TabsList>
                  <div className="flex items-center text-xs text-gray-500 gap-4">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-[#AA94E2] rounded-full"></div>
                      <span>Revenue</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-[#4ADE80] rounded-full"></div>
                      <span>Cumulative</span>
                    </div>
                  </div>
                </div>
                
                <TabsContent value="monthly" className="h-36 sm:h-48">
                  <ChartContainer
                    className="w-full"
                    config={{
                      revenue: { color: "#AA94E2", label: "Monthly Revenue" },
                      cumulative: { color: "#4ADE80", label: "Cumulative Revenue" }
                    }}
                  >
                    <BarChart data={analytics.monthlyProjections}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: isMobile ? 8 : 10 }} 
                        tickLine={false}
                      />
                      <YAxis 
                        yAxisId="left" 
                        orientation="left" 
                        tick={{ fontSize: isMobile ? 8 : 10 }}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <YAxis 
                        yAxisId="right" 
                        orientation="right" 
                        tick={{ fontSize: isMobile ? 8 : 10 }}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Bar dataKey="revenue" fill="var(--color-revenue)" yAxisId="left" />
                      <Line 
                        type="monotone" 
                        dataKey="cumulativeRevenue" 
                        stroke="var(--color-cumulative)" 
                        yAxisId="right" 
                        strokeWidth={2}
                        dot={false}
                      />
                      <RechartsTooltip
                        content={
                          <ChartTooltipContent formatter={(value, name) => [`$${value}`, name === "revenue" ? "Monthly Revenue" : "Cumulative Revenue"]} />
                        }
                      />
                    </BarChart>
                  </ChartContainer>
                </TabsContent>
                
                <TabsContent value="yearly" className="h-36 sm:h-48">
                  <ChartContainer
                    className="w-full"
                    config={{
                      revenue: { color: "#AA94E2", label: "Yearly Revenue" },
                      cumulativeProfit: { color: "#4ADE80", label: "Cumulative Profit" }
                    }}
                  >
                    <LineChart data={analytics.yearlyProjections.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="year" 
                        tick={{ fontSize: isMobile ? 8 : 10 }} 
                        tickLine={false}
                      />
                      <YAxis 
                        tick={{ fontSize: isMobile ? 8 : 10 }}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="var(--color-revenue)" 
                        strokeWidth={2}
                        dot={{ r: 2 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="cumulativeProfit" 
                        stroke="var(--color-cumulativeProfit)" 
                        strokeWidth={2}
                        dot={{ r: 2 }}
                      />
                      <RechartsTooltip
                        content={
                          <ChartTooltipContent formatter={(value, name) => [`$${value}`, name === "revenue" ? "Yearly Revenue" : "Cumulative Profit"]} />
                        }
                      />
                    </LineChart>
                  </ChartContainer>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="performance" className="text-sm">Performance</TabsTrigger>
            <TabsTrigger value="environmental" className="text-sm">Environmental</TabsTrigger>
            <TabsTrigger value="details" className="text-sm">Installation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance">
            <Card>
              <CardHeader className={isMobile ? "p-4 pb-2" : "pb-3"}>
                <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                  System Performance
                </CardTitle>
                <CardDescription>Energy production and efficiency metrics</CardDescription>
              </CardHeader>
              <CardContent className={isMobile ? "p-4 pt-2" : ""}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Energy Production</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm">Yearly Production</p>
                          <span className="text-sm font-medium">{examplePropertyAnalysis.solarPerformance.yearlyEnergyKwh.toLocaleString()} kWh</span>
                        </div>
                        <Progress value={100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm">Average Daily</p>
                          <span className="text-sm font-medium">{(examplePropertyAnalysis.solarPerformance.yearlyEnergyKwh / 365).toFixed(1)} kWh</span>
                        </div>
                        <Progress value={80} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm">System Efficiency</p>
                          <span className="text-sm font-medium">{examplePropertyAnalysis.solarPerformance.efficiencyRating}%</span>
                        </div>
                        <Progress value={examplePropertyAnalysis.solarPerformance.efficiencyRating} className="h-2" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3">Financial Performance</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm">ROI</p>
                          <span className="text-sm font-medium">{analytics.financialMetrics.roi.toFixed(1)}%</span>
                        </div>
                        <Progress value={Math.min(100, analytics.financialMetrics.roi)} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm">Payback Progress</p>
                          <span className="text-sm font-medium">
                            {Math.min(100, (1 / analytics.financialMetrics.paybackPeriod * 100)).toFixed(1)}%
                          </span>
                        </div>
                        <Progress 
                          value={Math.min(100, (1 / analytics.financialMetrics.paybackPeriod * 100))} 
                          className="h-2"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm">Bill Reduction</p>
                          <span className="text-sm font-medium">
                            {(100 - (examplePropertyAnalysis.solarFinancials.billAfterSolar / examplePropertyAnalysis.solarFinancials.billBeforeSolar * 100)).toFixed(0)}%
                          </span>
                        </div>
                        <Progress 
                          value={100 - (examplePropertyAnalysis.solarFinancials.billAfterSolar / examplePropertyAnalysis.solarFinancials.billBeforeSolar * 100)}
                          className="h-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-3">Monthly Energy Production</h3>
                  <div className="h-48 sm:h-64">
                    <ChartContainer
                      className="w-full h-full"
                      config={{
                        energyProduction: { color: "#FDBA8C", label: "Energy (kWh)" }
                      }}
                    >
                      <AreaChart data={analytics.monthlyProjections}>
                        <defs>
                          <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FDBA8C" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#FDBA8C" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="month" 
                          tick={{ fontSize: isMobile ? 10 : 12 }}
                        />
                        <YAxis 
                          tick={{ fontSize: isMobile ? 10 : 12 }}
                          tickFormatter={(value) => `${value} kWh`}
                        />
                        <RechartsTooltip
                          content={
                            <ChartTooltipContent formatter={(value, name) => [`${value} kWh`, "Energy Production"]} />
                          }
                        />
                        <Area 
                          type="monotone" 
                          dataKey="energyProduction" 
                          stroke="var(--color-energyProduction)" 
                          fillOpacity={1} 
                          fill="url(#energyGradient)" 
                        />
                      </AreaChart>
                    </ChartContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="environmental">
            <Card>
              <CardHeader className={isMobile ? "p-4 pb-2" : "pb-3"}>
                <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  Environmental Impact
                </CardTitle>
                <CardDescription>Carbon reduction and environmental benefits</CardDescription>
              </CardHeader>
              <CardContent className={isMobile ? "p-4 pt-2" : ""}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card className="bg-green-50 border-green-100">
                    <CardContent className="p-4">
                      <h3 className="text-sm font-medium text-green-800 mb-1">Carbon Offset</h3>
                      <p className="text-2xl font-bold text-green-700">
                        {analytics.environmentalImpact.co2Saved.toLocaleString()} kg
                      </p>
                      <p className="text-xs text-green-600 mt-1">CO₂ per year</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-50 border-green-100">
                    <CardContent className="p-4">
                      <h3 className="text-sm font-medium text-green-800 mb-1">Tree Equivalent</h3>
                      <p className="text-2xl font-bold text-green-700">
                        {analytics.environmentalImpact.treesEquivalent} trees
                      </p>
                      <p className="text-xs text-green-600 mt-1">Annual CO₂ absorption</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-50 border-green-100">
                    <CardContent className="p-4">
                      <h3 className="text-sm font-medium text-green-800 mb-1">Car Miles Avoided</h3>
                      <p className="text-2xl font-bold text-green-700">
                        {analytics.environmentalImpact.milesNotDriven.toLocaleString()}
                      </p>
                      <p className="text-xs text-green-600 mt-1">Miles not driven</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-3">10-Year Environmental Impact</h3>
                  <div className="h-48 sm:h-64">
                    <ChartContainer
                      className="w-full h-full"
                      config={{
                        co2: { color: "#10B981", label: "CO₂ Offset (tons)" },
                        trees: { color: "#059669", label: "Tree Equivalent" }
                      }}
                    >
                      <LineChart 
                        data={analytics.yearlyProjections.slice(0, 10).map(y => ({
                          ...y,
                          co2: (analytics.environmentalImpact.co2Saved * y.year / 1000).toFixed(1),
                          trees: analytics.environmentalImpact.treesEquivalent * y.year
                        }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="year" 
                          tick={{ fontSize: isMobile ? 10 : 12 }}
                        />
                        <YAxis 
                          yAxisId="left"
                          tick={{ fontSize: isMobile ? 10 : 12 }}
                          tickFormatter={(value) => `${value}`}
                        />
                        <YAxis 
                          yAxisId="right"
                          orientation="right"
                          tick={{ fontSize: isMobile ? 10 : 12 }}
                          tickFormatter={(value) => `${value}`}
                        />
                        <RechartsTooltip
                          content={
                            <ChartTooltipContent />
                          }
                        />
                        <Line 
                          yAxisId="left"
                          type="monotone" 
                          dataKey="co2" 
                          stroke="var(--color-co2)" 
                          strokeWidth={2}
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="trees" 
                          stroke="var(--color-trees)" 
                          strokeWidth={2}
                        />
                        <Legend />
                      </LineChart>
                    </ChartContainer>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-2 text-gray-800">Environmental Certification</h3>
                  <p className="text-sm text-gray-600">
                    Your solar installation qualifies for Green Energy Certification. 
                    The system is estimated to reduce your carbon footprint by {analytics.environmentalImpact.co2Saved.toLocaleString()} kg of CO₂ annually,
                    equivalent to planting {analytics.environmentalImpact.treesEquivalent} trees each year.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="details">
            <Card>
              <CardHeader className={isMobile ? "p-4 pb-2" : "pb-3"}>
                <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
                  <Sun className="h-5 w-5 text-amber-500" />
                  Installation Details
                </CardTitle>
                <CardDescription>Technical specifications and placement</CardDescription>
              </CardHeader>
              <CardContent className={isMobile ? "p-4 pt-2" : ""}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">System Design</h3>
                    <div className="relative bg-white rounded-lg overflow-hidden h-48 sm:h-64 border">
                      <img 
                        src="/lovable-uploads/913daccf-062e-43c1-a1ea-61722735d206.jpg"
                        alt="Solar Panel Layout"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <p className="font-medium">Optimized Panel Layout</p>
                        <p className="text-sm opacity-90">
                          {analytics.installationMetrics.panelsCount} panels · {examplePropertyAnalysis.solarFinancials.systemSizeKw} kW total capacity
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-3">Placement Details</h3>
                      <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-gray-500">Roof Direction</p>
                            <p className="text-sm font-medium">
                              {getDirectionLabel(examplePropertyAnalysis.solarPerformance.roofDirection)} ({examplePropertyAnalysis.solarPerformance.roofDirection.toFixed(0)}°)
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Roof Slope</p>
                            <p className="text-sm font-medium">
                              {examplePropertyAnalysis.solarPerformance.roofSlope.toFixed(1)}°
                              {examplePropertyAnalysis.solarPerformance.roofSlope < 15 ? " (Low)" : 
                               examplePropertyAnalysis.solarPerformance.roofSlope < 30 ? " (Medium)" : " (Steep)"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Installation Complexity</p>
                            <p className="text-sm font-medium">
                              {examplePropertyAnalysis.solarPerformance.installationComplexity}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Roof Coverage</p>
                            <p className="text-sm font-medium">
                              {analytics.installationMetrics.roofCoverage}% of usable area
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3">Panel Specifications</h3>
                      <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
                        <div>
                          <p className="text-xs text-gray-500">Panel Type</p>
                          <p className="text-sm font-medium">
                            Monocrystalline High-Efficiency
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Panel Rating</p>
                          <p className="text-sm font-medium">
                            {Math.round(examplePropertyAnalysis.solarFinancials.systemSizeKw * 1000 / analytics.installationMetrics.panelsCount)}W per panel
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Inverter Type</p>
                          <p className="text-sm font-medium">
                            String Inverter with Power Optimizers
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Warranty</p>
                          <p className="text-sm font-medium">
                            25 years performance, 12 years product
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card className="mt-6">
          <CardHeader className={`${isMobile ? 'p-3 pb-2' : ''}`}>
            <CardTitle className="text-base sm:text-lg font-medium">Contract Details</CardTitle>
          </CardHeader>
          <CardContent className={`${isMobile ? 'p-3 pt-1' : ''}`}>
            <p className="mb-4">Your rooftop solar agreement with SolarCity generates passive income by selling excess energy back to the grid. The system is fully maintained by SolarCity at no cost to you.</p>
            <div className="flex flex-wrap justify-end gap-2">
              <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={handleViewContract}>
                <Eye className="mr-2 h-4 w-4" /> View Contract
              </Button>
              <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={handleDownloadStatement}>
                <FileText className="mr-2 h-4 w-4" /> Download Statement
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SolarAssetDetailPage;

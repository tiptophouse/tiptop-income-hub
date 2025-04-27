
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label 
} from 'recharts';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Brain, ArrowUpRight, AlertTriangle, Lightbulb } from 'lucide-react';

const mockUserGrowthData = [
  { month: 'Jan', users: 120, partners: 12 },
  { month: 'Feb', users: 145, partners: 15 },
  { month: 'Mar', users: 178, partners: 21 },
  { month: 'Apr', users: 213, partners: 28 },
  { month: 'May', users: 252, partners: 35 },
  { month: 'Jun', users: 293, partners: 42 },
  { month: 'Jul', users: 348, partners: 52 },
  { month: 'Aug', users: 420, partners: 65 },
  { month: 'Sep', users: 501, partners: 78 },
  { month: 'Oct', users: 580, partners: 92 },
  { month: 'Nov', users: 655, partners: 108 },
  { month: 'Dec', users: 732, partners: 126 }
];

const mockAssetPerformance = [
  { name: 'Solar', value: 42 },
  { name: 'Internet', value: 28 },
  { name: 'EV Charging', value: 15 },
  { name: 'Parking', value: 10 },
  { name: 'Storage', value: 5 }
];

const COLORS = ['#8b5cf6', '#4f46e5', '#06b6d4', '#22c55e', '#f59e0b'];

const AdminInsightsDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [partnerInsights, setPartnerInsights] = useState<string[]>([]);
  
  useEffect(() => {
    fetchInsights();
  }, []);
  
  const fetchInsights = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would call OpenAI API via Supabase edge function
      // For demo purposes, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setInsights([
        "User growth has increased by 26% in the last quarter, with most new users coming from referrals.",
        "Partner qualification rate has improved by 18% since implementing the new requirements system.",
        "Solar panel assets are generating the highest revenue per property at an average of $215/month.",
        "Properties in urban areas show 35% higher monetization potential than suburban properties."
      ]);
      
      setRecommendations([
        "Consider lowering the minimum roof size requirement by 10% to increase eligible properties while maintaining quality.",
        "Implement automatic notifications for partners when they're close to meeting all requirements.",
        "Target marketing efforts toward areas with higher internet speed availability for better conversion rates.",
        "Introduce a tiered commission structure based on property performance to incentivize partners."
      ]);
      
      setPartnerInsights([
        "Partners with complete property profiles are 4.2x more likely to monetize successfully.",
        "Technical verification of internet speeds improves qualification accuracy by 72%.",
        "The average time from partner approval to first revenue generation is 42 days.",
        "Partners who complete onboarding tutorials achieve 28% higher earnings in the first quarter."
      ]);
      
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      toast({
        title: 'Error',
        description: 'Failed to load AI insights',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRefreshInsights = async () => {
    setIsRefreshing(true);
    try {
      // In a real app, this would call OpenAI API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update with "new" insights
      setInsights([
        "User growth has increased by 26% in the last quarter, with most new users coming from referrals.",
        "Partner qualification rate has improved by 18% since implementing the new requirements system.",
        "Solar panel assets are generating the highest revenue per property at an average of $215/month.",
        "Properties in urban areas show 35% higher monetization potential than suburban properties.",
        "New insight: User retention is highest among property owners with multiple monetized assets."
      ]);
      
      toast({
        title: 'Insights Refreshed',
        description: 'AI insights have been updated with latest data',
      });
    } catch (error) {
      console.error('Error refreshing insights:', error);
      toast({
        title: 'Error',
        description: 'Failed to refresh AI insights',
        variant: 'destructive'
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                AI Platform Insights
              </CardTitle>
              <CardDescription>
                AI-powered analysis and recommendations for your platform
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshInsights}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-3.5 w-3.5 mr-1" />
                  Refresh Insights
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="insights">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="insights">Platform Insights</TabsTrigger>
              <TabsTrigger value="partners">Partner Analysis</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="insights" className="pt-4">
              {isLoading ? (
                <div className="flex justify-center py-16">
                  <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">User Growth Trends</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={mockUserGrowthData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Line type="monotone" dataKey="users" stroke="#8b5cf6" activeDot={{ r: 8 }} name="Users" />
                              <Line type="monotone" dataKey="partners" stroke="#06b6d4" name="Partners" />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Asset Performance</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={mockAssetPerformance}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {mockAssetPerformance.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => `${value}%`} />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-amber-500" />
                        Key Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {insights.map((insight, index) => (
                          <li key={index} className="flex gap-2 items-start">
                            <ArrowUpRight className="h-4 w-4 text-primary mt-0.5" />
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="partners" className="pt-4">
              {isLoading ? (
                <div className="flex justify-center py-16">
                  <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Partner Qualification Rate</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { month: 'Jul', approved: 18, rejected: 12 },
                              { month: 'Aug', approved: 22, rejected: 10 },
                              { month: 'Sep', approved: 26, rejected: 8 },
                              { month: 'Oct', approved: 31, rejected: 6 },
                              { month: 'Nov', approved: 35, rejected: 5 },
                              { month: 'Dec', approved: 40, rejected: 4 },
                            ]}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="approved" stackId="a" fill="#4ade80" name="Approved" />
                            <Bar dataKey="rejected" stackId="a" fill="#f87171" name="Rejected" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-amber-500" />
                        Partner Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {partnerInsights.map((insight, index) => (
                          <li key={index} className="flex gap-2 items-start">
                            <ArrowUpRight className="h-4 w-4 text-primary mt-0.5" />
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-amber-800 mb-1">Opportunity Alert</h4>
                      <p className="text-amber-700 text-sm">
                        42% of rejected partners failed on a single requirement: minimum roof size. 
                        Consider reviewing this requirement to potentially increase partner approval rates.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="recommendations" className="pt-4">
              {isLoading ? (
                <div className="flex justify-center py-16">
                  <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">AI Recommendations</CardTitle>
                      <CardDescription>
                        Actionable suggestions based on platform data analysis
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-4">
                        {recommendations.map((recommendation, index) => (
                          <li key={index} className="bg-muted/40 rounded-md p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="bg-primary/20 text-primary border-none">
                                Recommendation {index + 1}
                              </Badge>
                            </div>
                            <p>{recommendation}</p>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminInsightsDashboard;

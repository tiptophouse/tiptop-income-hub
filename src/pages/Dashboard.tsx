import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Plus, Car, FileText, Check, LogOut, Home, Sun, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import DashboardPropertyView from '@/components/DashboardPropertyView';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset
} from "@/components/ui/sidebar";

import DashboardOverview from './dashboard/DashboardOverview';
import SolarAssetDetail from './dashboard/assetDetails/SolarAssetDetail';
import InternetAssetDetail from './dashboard/assetDetails/InternetAssetDetail';
import EVAssetDetail from './dashboard/assetDetails/EVAssetDetail';
import AddAssetPage from './dashboard/AddAssetPage';
import { mockAssets } from './dashboard/dashboardData';

const Dashboard = () => {
  const [userName, setUserName] = useState('John');
  const [earnings, setEarnings] = useState({ daily: 0, monthly: 0, yearly: 0 });
  const [activeAssets, setActiveAssets] = useState(0);
  const [totalPotentialAssets, setTotalPotentialAssets] = useState(0);
  const [pendingActions, setPendingActions] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const active = mockAssets.filter(asset => asset.status === 'active').length;
    const pending = mockAssets.filter(asset => asset.action !== 'None').length;
    
    setActiveAssets(active);
    setTotalPotentialAssets(mockAssets.length);
    setPendingActions(pending);
    
    const dailyTotal = mockAssets.reduce((sum, asset) => sum + (asset.status === 'active' ? asset.revenue / 30 : 0), 0);
    const monthlyTotal = mockAssets.reduce((sum, asset) => sum + (asset.status === 'active' ? asset.revenue : 0), 0);
    
    setEarnings({
      daily: parseFloat(dailyTotal.toFixed(2)),
      monthly: monthlyTotal,
      yearly: monthlyTotal * 12
    });
  }, []);

  const renderStatusBadge = (status) => {
    if (status === 'active') {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><Check className="w-3 h-3 mr-1" /> Active</span>;
    } else if (status === 'pending') {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><AlertTriangle className="w-3 h-3 mr-1" /> Pending</span>;
    } else {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><Info className="w-3 h-3 mr-1" /> Inactive</span>;
    }
  };

  const aiRevenueDescription = `Today's solar generation was 12% above average due to clear skies. Your internet bandwidth was utilized at 78% capacity with peak usage during evening hours. The EV charging stations were used for 7.5 hours today.`;

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Exception signing out:', error);
    }
  };

  const navigateHome = () => {
    navigate('/');
  };

  const activeAssets = mockAssets.filter(asset => asset.status === 'active');

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-background flex w-full">
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <div className="flex items-center px-2">
              <span className="font-bold text-xl text-primary">Tiptop</span>
              <SidebarTrigger className="ml-auto" />
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={selectedView === 'dashboard'} 
                  onClick={() => setSelectedView('dashboard')}
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {activeAssets.map((asset) => (
                <SidebarMenuItem key={asset.id}>
                  <SidebarMenuButton 
                    isActive={selectedView === asset.type} 
                    onClick={() => setSelectedView(asset.type)}
                  >
                    {asset.type === 'rooftop' && <Sun className="h-4 w-4 mr-2" />}
                    {asset.type === 'internet' && <Wifi className="h-4 w-4 mr-2" />}
                    {asset.type === 'ev' && <Car className="h-4 w-4 mr-2" />}
                    {asset.type === 'storage' && <FileText className="h-4 w-4 mr-2" />}
                    {asset.type === 'garden' && <Check className="h-4 w-4 mr-2" />}
                    <span>
                      {asset.type === 'ev' ? 'EV Charging' : (asset.type.charAt(0).toUpperCase() + asset.type.slice(1))}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={selectedView === 'add'} 
                  onClick={() => setSelectedView('add')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <span>Add Asset</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter>
            <div className="p-2">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset className="flex-1">
          <div className="p-6 max-w-7xl mx-auto relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-6 right-6"
              onClick={navigateHome}
            >
              <Home className="h-5 w-5" />
            </Button>
            
            {selectedView === 'dashboard' && <DashboardOverview />}
            {selectedView === 'rooftop' && <SolarAssetDetail />}
            {selectedView === 'internet' && <InternetAssetDetail />}
            {selectedView === 'ev' && <EVAssetDetail />}
            {selectedView === 'add' && <AddAssetPage />}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Plus, Car, FileText, Check, LogOut, Home, Sun, Wifi, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
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
import { generatePropertyModels } from '@/utils/modelGeneration';

const Dashboard = () => {
  const [userName, setUserName] = useState('John');
  const [earnings, setEarnings] = useState({ daily: 0, monthly: 0, yearly: 0 });
  const [activeAssetCount, setActiveAssetCount] = useState(0);
  const [totalPotentialAssets, setTotalPotentialAssets] = useState(0);
  const [pendingActions, setPendingActions] = useState(0);
  const [selectedView, setSelectedView] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    const active = mockAssets.filter(asset => asset.status === 'active').length;
    const pending = mockAssets.filter(asset => asset.action !== 'None').length;
    
    setActiveAssetCount(active);
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

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session check error:', error);
        } else if (session) {
          // Check if we need to generate models after OAuth redirect
          const { data: { user } } = await supabase.auth.getUser();
          if (user && !user.user_metadata.propertyModelJobId) {
            await generatePropertyModels(user.user_metadata.propertyAddress || "123 Main St");
          }
        }
      } catch (error) {
        console.error('Session check exception:', error);
      }
    };
    
    checkSession();
  }, []);

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

  const renderMenuItems = (onItemClick = () => {}) => (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton 
          isActive={selectedView === 'dashboard'} 
          onClick={() => {
            setSelectedView('dashboard');
            onItemClick();
          }}
        >
          <LayoutDashboard className="h-4 w-4 mr-2" />
          <span>Dashboard</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      {activeAssets.map((asset) => (
        <SidebarMenuItem key={asset.id}>
          <SidebarMenuButton 
            isActive={selectedView === asset.type} 
            onClick={() => {
              setSelectedView(asset.type);
              onItemClick();
            }}
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
          onClick={() => {
            setSelectedView('add');
            onItemClick();
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          <span>Add Asset</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </>
  );

  return (
    <SidebarProvider defaultOpen={!isMobile}>
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
              {renderMenuItems()}
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
          <div className="p-4 md:p-6 max-w-7xl mx-auto relative">
            <div className="flex justify-between items-center mb-4">
              <div className="md:hidden">
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[240px] sm:w-[300px] p-0">
                    <div className="py-4 border-b border-border">
                      <div className="flex items-center px-4">
                        <span className="font-bold text-xl text-primary">Tiptop</span>
                      </div>
                    </div>
                    <div className="flex flex-col py-2">
                      <SidebarMenu>
                        {renderMenuItems(() => setMobileMenuOpen(false))}
                      </SidebarMenu>
                    </div>
                    <div className="border-t border-border mt-auto p-4">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start" 
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleSignOut();
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="ml-auto"
                onClick={navigateHome}
              >
                <Home className="h-5 w-5" />
              </Button>
            </div>
            
            {selectedView === 'dashboard' && <DashboardOverview 
              userName={userName} 
              earnings={earnings} 
              activeAssets={activeAssetCount}
              totalPotentialAssets={totalPotentialAssets} 
              pendingActions={pendingActions}
              aiRevenueDescription={aiRevenueDescription}
            />}
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

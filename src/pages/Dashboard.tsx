
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { generatePropertyModels } from '@/utils/modelGeneration';
import { DashboardLayout } from './dashboard/DashboardLayout';
import { DashboardHeader } from './dashboard/components/DashboardHeader';
import { MobileSidebar } from './dashboard/components/MobileSidebar';
import DashboardOverview from './dashboard/DashboardOverview';
import SolarAssetDetail from './dashboard/assetDetails/SolarAssetDetail';
import InternetAssetDetail from './dashboard/assetDetails/InternetAssetDetail';
import EVAssetDetail from './dashboard/assetDetails/EVAssetDetail';
import AddAssetPage from './dashboard/AddAssetPage';
import { mockAssets } from './dashboard/dashboardData';

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

  const aiRevenueDescription = `Today's solar generation was 12% above average due to clear skies. Your internet bandwidth was utilized at 78% capacity with peak usage during evening hours. The EV charging stations were used for 7.5 hours today.`;

  const renderContent = () => {
    switch (selectedView) {
      case 'dashboard':
        return (
          <DashboardOverview 
            userName={userName} 
            earnings={earnings} 
            activeAssets={activeAssetCount}
            totalPotentialAssets={totalPotentialAssets} 
            pendingActions={pendingActions}
            aiRevenueDescription={aiRevenueDescription}
          />
        );
      case 'rooftop':
        return <SolarAssetDetail />;
      case 'internet':
        return <InternetAssetDetail />;
      case 'ev':
        return <EVAssetDetail />;
      case 'add':
        return <AddAssetPage />;
      default:
        return <DashboardOverview 
          userName={userName} 
          earnings={earnings} 
          activeAssets={activeAssetCount}
          totalPotentialAssets={totalPotentialAssets} 
          pendingActions={pendingActions}
          aiRevenueDescription={aiRevenueDescription}
        />;
    }
  };

  return (
    <DashboardLayout onSignOut={handleSignOut}>
      <DashboardHeader />
      {isMobile && (
        <MobileSidebar
          isOpen={mobileMenuOpen}
          onOpenChange={setMobileMenuOpen}
          onSignOut={handleSignOut}
        />
      )}
      {renderContent()}
    </DashboardLayout>
  );
};

export default Dashboard;

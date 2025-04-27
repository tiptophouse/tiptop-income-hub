
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDashboard } from '@/hooks/useDashboard';
import { DashboardLayout } from './dashboard/DashboardLayout';
import { DashboardHeader } from './dashboard/components/DashboardHeader';
import { MobileSidebar } from './dashboard/components/MobileSidebar';
import DashboardOverview from './dashboard/DashboardOverview';
import SolarAssetDetail from './dashboard/assetDetails/SolarAssetDetail';
import InternetAssetDetail from './dashboard/assetDetails/InternetAssetDetail';
import EVAssetDetail from './dashboard/assetDetails/EVAssetDetail';
import AddAssetPage from './dashboard/AddAssetPage';

const Dashboard = () => {
  const {
    userName,
    earnings,
    activeAssetCount,
    totalPotentialAssets,
    pendingActions,
    selectedView,
    mobileMenuOpen,
    setMobileMenuOpen,
    handleSignOut,
    aiRevenueDescription
  } = useDashboard();
  
  const isMobile = useIsMobile();

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

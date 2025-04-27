
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { generatePropertyModels } from '@/utils/modelGeneration';
import { mockAssets } from '@/pages/dashboard/dashboardData';

export const useDashboard = () => {
  const [userName, setUserName] = useState('John');
  const [earnings, setEarnings] = useState({ daily: 0, monthly: 0, yearly: 0 });
  const [activeAssetCount, setActiveAssetCount] = useState(0);
  const [totalPotentialAssets, setTotalPotentialAssets] = useState(0);
  const [pendingActions, setPendingActions] = useState(0);
  const [selectedView, setSelectedView] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const active = mockAssets.filter(asset => asset.status === 'active').length;
    const pending = mockAssets.filter(asset => asset.action !== 'None').length;
    
    setActiveAssetCount(active);
    setTotalPotentialAssets(mockAssets.length);
    setPendingActions(pending);
    
    const dailyTotal = mockAssets.reduce((sum, asset) => 
      sum + (asset.status === 'active' ? asset.revenue / 30 : 0), 0);
    const monthlyTotal = mockAssets.reduce((sum, asset) => 
      sum + (asset.status === 'active' ? asset.revenue : 0), 0);
    
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

  return {
    userName,
    earnings,
    activeAssetCount,
    totalPotentialAssets,
    pendingActions,
    selectedView,
    setSelectedView,
    mobileMenuOpen,
    setMobileMenuOpen,
    handleSignOut,
    aiRevenueDescription
  };
};

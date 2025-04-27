import { Calendar, Home, Sun, Wifi, Car, Plus, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardMenuProps {
  onSignOut: () => void;
}

export const DashboardMenu = ({ onSignOut }: DashboardMenuProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const items = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Rooftop", url: "/dashboard/rooftop", icon: Sun },
    { title: "Internet", url: "/dashboard/internet", icon: Wifi },
    { title: "EV Charging", url: "/dashboard/ev-charging", icon: Car },
    { title: "Add Asset", url: "/dashboard/add-asset", icon: Plus },
    { title: "My Account", url: "/dashboard/account", icon: User },
  ];

  const buttonClasses = isMobile 
    ? "text-white hover:bg-white/10" 
    : "text-white hover:bg-tiptop-hover";

  const activeClasses = isMobile
    ? "bg-white/20 text-white"
    : "bg-tiptop-hover text-white";

  return (
    <>
      <div className="flex flex-col py-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild 
                className={location.pathname === item.url ? activeClasses : buttonClasses}
              >
                <button onClick={() => navigate(item.url)}>
                  <item.icon className="h-4 w-4 mr-2" />
                  <span>{item.title}</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </div>
      <div className="border-t border-white/20 mt-auto p-4">
        <Button 
          variant="outline" 
          className="w-full justify-start text-white border-white/40 hover:bg-white/10" 
          onClick={onSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </>
  );
};


import { Calendar, Home, Sun, Wifi, Car, Plus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { useNavigate, useLocation } from 'react-router-dom';

interface DashboardMenuProps {
  onSignOut: () => void;
}

export const DashboardMenu = ({ onSignOut }: DashboardMenuProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const items = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Rooftop", url: "/dashboard/rooftop", icon: Sun },
    { title: "Internet", url: "/dashboard/internet", icon: Wifi },
    { title: "EV Charging", url: "/dashboard/ev-charging", icon: Car },
  ];

  return (
    <>
      <div className="flex flex-col py-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild 
                className={location.pathname === item.url ? "bg-accent" : ""}
              >
                <button onClick={() => navigate(item.url)}>
                  <item.icon className="h-4 w-4 mr-2" />
                  <span>{item.title}</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => navigate('/dashboard/add-asset')}>
              <Plus className="h-4 w-4 mr-2" />
              <span>Add Asset</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
      <div className="border-t border-border mt-auto p-4">
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={onSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </>
  );
};

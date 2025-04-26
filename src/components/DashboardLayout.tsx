
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeSidebarItems: Array<{
    id: string;
    icon: React.ReactNode;
    label: string;
  }>;
  selectedView: string;
  onViewChange: (view: string) => void;
  onSignOut: () => void;
}

const DashboardLayout = ({ 
  children, 
  activeSidebarItems, 
  selectedView, 
  onViewChange,
  onSignOut 
}: DashboardLayoutProps) => {
  const navigate = useNavigate();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-background flex w-full">
        <Sidebar variant="default" className="transition-all duration-300 ease-in-out">
          <SidebarHeader>
            <div className="flex items-center px-2">
              <span className="font-bold text-xl text-primary">Tiptop</span>
              <SidebarTrigger className="ml-auto" />
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              {activeSidebarItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    data-active={selectedView === item.id}
                    onClick={() => onViewChange(item.id)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter>
            <div className="p-2">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={onSignOut}
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
              onClick={() => navigate('/')}
            >
              <Home className="h-5 w-5" />
            </Button>
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;


import { ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset
} from "@/components/ui/sidebar";
import { DashboardMenu } from './components/DashboardMenu';

interface DashboardLayoutProps {
  children: ReactNode;
  onSignOut: () => void;
}

export const DashboardLayout = ({ children, onSignOut }: DashboardLayoutProps) => {
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
            <DashboardMenu onSignOut={onSignOut} />
          </SidebarContent>
          
          <SidebarFooter />
        </Sidebar>
        
        <SidebarInset className="flex-1">
          <div className="p-4 md:p-6 max-w-7xl mx-auto relative">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

// Also export as default for backward compatibility
export default DashboardLayout;

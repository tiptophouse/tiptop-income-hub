
import { ReactNode } from 'react';
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
  SidebarInset
} from "@/components/ui/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DashboardMenu } from './components/DashboardMenu';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardLayoutProps {
  children: ReactNode;
  onSignOut: () => void;
}

export const DashboardLayout = ({ children, onSignOut }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen bg-background flex w-full">
        {/* Desktop Sidebar */}
        <Sidebar collapsible="icon" className="hidden md:flex">
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
          <div className="p-2 sm:p-4 md:p-6 max-w-7xl mx-auto relative">
            {/* Mobile Menu */}
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                    >
                      <path
                        d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[240px] p-0 bg-[#6E59A5] text-white overflow-y-auto">
                  <div className="p-3 border-b border-white/10">
                    <h2 className="text-lg font-bold text-white">Tiptop</h2>
                  </div>
                  <div className="py-2">
                    <DashboardMenu onSignOut={onSignOut} />
                  </div>
                </SheetContent>
              </Sheet>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/')}
                className="md:absolute md:top-0 md:right-0 md:p-4"
              >
                <Home className="h-5 w-5" />
              </Button>
            </div>
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;

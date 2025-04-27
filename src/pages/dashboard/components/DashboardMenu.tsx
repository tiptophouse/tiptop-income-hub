
import { Calendar, Home, Inbox, Search, Settings, Plus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

interface DashboardMenuProps {
  onItemClick?: () => void;
  onSignOut: () => void;
}

export const DashboardMenu = ({ onItemClick = () => {}, onSignOut }: DashboardMenuProps) => {
  const items = [
    { title: "Home", url: "#", icon: Home },
    { title: "Inbox", url: "#", icon: Inbox },
    { title: "Calendar", url: "#", icon: Calendar },
    { title: "Search", url: "#", icon: Search },
    { title: "Settings", url: "#", icon: Settings },
  ];

  return (
    <>
      <div className="flex flex-col py-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild 
                onClick={onItemClick}
              >
                <a href={item.url}>
                  <item.icon className="h-4 w-4 mr-2" />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => {
              onItemClick();
            }}>
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
          onClick={() => {
            onItemClick();
            onSignOut();
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </>
  );
};

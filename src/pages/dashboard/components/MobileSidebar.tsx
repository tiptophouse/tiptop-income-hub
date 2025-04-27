
import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { DashboardMenu } from './DashboardMenu';

interface MobileSidebarProps {
  onSignOut: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ onSignOut }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72">
        <DashboardMenu onSignOut={onSignOut} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;

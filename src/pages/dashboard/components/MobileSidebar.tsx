
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { DashboardMenu } from './DashboardMenu';

interface MobileSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSignOut: () => void;
}

export const MobileSidebar = ({ isOpen, onOpenChange, onSignOut }: MobileSidebarProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:w-[300px] p-0">
        <div className="py-4 border-b border-border">
          <div className="flex items-center px-4">
            <span className="font-bold text-xl text-primary">Tiptop</span>
          </div>
        </div>
        <DashboardMenu onItemClick={() => onOpenChange(false)} onSignOut={onSignOut} />
      </SheetContent>
    </Sheet>
  );
};

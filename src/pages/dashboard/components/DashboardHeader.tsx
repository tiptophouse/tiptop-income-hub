
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const DashboardHeader = () => {
  const navigate = useNavigate();

  const navigateHome = () => {
    navigate('/');
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="md:hidden">
        {/* Mobile header content is handled by parent */}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="ml-auto"
        onClick={navigateHome}
      >
        <Home className="h-5 w-5" />
      </Button>
    </div>
  );
};

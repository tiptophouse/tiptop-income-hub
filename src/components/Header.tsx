
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full flex justify-between items-center py-5 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto bg-[#FFFDED]">
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-[#AA94E2] flex items-center justify-center">
          <span className="text-white font-bold text-xl">T</span>
        </div>
        <span className="ml-2 font-bold text-xl font-fahkwang text-[#552B1B]">Tiptop</span>
      </div>
      <Button 
        variant="outline"
        className="border-[#AA94E2] text-[#6E59A5]"
        onClick={() => navigate('/login')}
      >
        <LogIn className="mr-2 h-4 w-4" />
        Sign In
      </Button>
    </header>
  );
};

export default Header;

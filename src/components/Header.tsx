
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full flex justify-between items-center py-6 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto bg-[#F8F6F0]">
      <div className="flex items-center">
        <span className="font-bold text-3xl text-[#7E69AB]">tiptop</span>
      </div>
      
      <div className="flex items-center space-x-8">
        <button className="text-[#2D2D2D] font-medium hover:text-[#7E69AB]">
          How it works
        </button>
        <button className="text-[#2D2D2D] font-medium hover:text-[#7E69AB]">
          About
        </button>
        <Button 
          variant="outline"
          className="border-[#7E69AB] text-[#7E69AB] hidden md:flex"
          onClick={() => navigate('/login')}
        >
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Button>
      </div>
    </header>
  );
};

export default Header;

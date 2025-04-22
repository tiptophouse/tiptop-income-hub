
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center py-4 px-4 md:px-6 lg:px-12 max-w-7xl mx-auto">
      <motion.div 
        className="flex items-center gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="h-10 w-10 rounded-full bg-tiptop-accent flex items-center justify-center">
          <span className="text-white font-bold text-xl">T</span>
        </div>
        <span className="font-bold text-xl">Tiptop</span>
      </motion.div>
      
      <motion.div
        className="hidden md:flex space-x-2 items-center"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Button 
          variant="outline"
          className="hidden sm:flex"
          onClick={() => navigate('/login')}
        >
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Button>
        <Button 
          className="bg-tiptop-accent hover:bg-tiptop-accent/90"
          onClick={() => navigate('/signup')}
        >
          Sign Up
        </Button>
      </motion.div>
      
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <LogIn className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[80%] max-w-sm">
          <div className="flex flex-col h-full pt-6">
            <div className="mt-auto space-y-2 pt-6">
              <Button 
                className="w-full bg-tiptop-accent hover:bg-tiptop-accent/90"
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/login')}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default Header;

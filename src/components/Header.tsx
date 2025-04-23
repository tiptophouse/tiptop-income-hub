
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, LogIn, Menu, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { CommandDialog, CommandInput } from '@/components/ui/command';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter a property address to search.",
      });
      return;
    }
    
    // Scroll to asset form section
    const formElement = document.getElementById('asset-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Update the address in AssetForm
    const addressInput = document.getElementById('address') as HTMLInputElement;
    if (addressInput) {
      addressInput.value = searchQuery;
      // Trigger a change event
      const event = new Event('change', { bubbles: true });
      addressInput.dispatchEvent(event);
      
      // Trigger a submit event on the form
      const submitButton = document.querySelector('#asset-form form button[type="submit"]');
      if (submitButton && submitButton instanceof HTMLElement) {
        submitButton.click();
      }
    }
  };

  // Navigation items for both desktop and mobile
  const navItems = [
    { label: "How It Works", onClick: () => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }) },
    { label: "Earning Quiz", onClick: () => document.getElementById('quiz-section')?.scrollIntoView({ behavior: 'smooth' }) },
    // Add 3D Models nav item
    { label: "3D Models", onClick: () => navigate('/models') },
  ];

  return (
    <header className="flex justify-between items-center py-4 px-4 md:px-6 lg:px-12 max-w-7xl mx-auto bg-[#FFFDED]">
      <motion.div 
        className="flex items-center gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="h-10 w-10 rounded-full bg-[#AA94E2] flex items-center justify-center">
          <span className="text-white font-bold text-xl">T</span>
        </div>
        <span className="font-bold text-xl font-fahkwang text-[#552B1B]">Tiptop</span>
      </motion.div>
      
      {/* Desktop search bar */}
      <motion.form
        className="hidden md:flex flex-1 max-w-md mx-auto"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSearch}
      >
        <div className="relative w-full">
          <Input
            type="text"
            placeholder="Search property address..."
            className="pl-10 pr-4 py-2 w-full bg-white/90 backdrop-blur-sm border-[#E5DEFF]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6E59A5]" />
          <Button 
            type="submit" 
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-[#AA94E2] hover:bg-[#9b87f5] h-8 text-white"
          >
            Search
          </Button>
        </div>
      </motion.form>
      
      {/* Desktop navigation */}
      <motion.div
        className="hidden md:flex space-x-2 items-center"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {navItems.map((item, index) => (
          <Button 
            key={index}
            variant="ghost" 
            className="hidden md:inline-flex text-[#552B1B] hover:text-[#6E59A5] hover:bg-[#F3ECFF]"
            onClick={item.onClick}
          >
            {item.label}
          </Button>
        ))}
        <Button 
          variant="outline"
          className="hidden sm:flex border-[#AA94E2] text-[#6E59A5]"
          onClick={() => navigate('/login')}
        >
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Button>
        <Button 
          className="bg-[#AA94E2] hover:bg-[#9b87f5] text-white"
          onClick={() => navigate('/signup')}
        >
          Sign Up
        </Button>
      </motion.div>
      
      {/* Mobile hamburger menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5 text-[#552B1B]" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[80%] max-w-sm bg-[#FFFDED] border-l border-[#E5DEFF]">
          <div className="flex flex-col h-full pt-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4 text-[#6E59A5] font-fahkwang">Search</h2>
              <form onSubmit={handleSearch} className="space-y-2">
                <Input
                  type="text"
                  placeholder="Search property address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-[#E5DEFF]"
                />
                <Button 
                  type="submit" 
                  className="w-full bg-[#AA94E2] hover:bg-[#9b87f5] text-white"
                >
                  Search
                </Button>
              </form>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#6E59A5] font-fahkwang">Navigation</h2>
              <div className="flex flex-col space-y-2">
                {navItems.map((item, index) => (
                  <Button 
                    key={index}
                    variant="ghost" 
                    className="justify-start text-[#552B1B] hover:text-[#6E59A5] hover:bg-[#F3ECFF]"
                    onClick={() => {
                      item.onClick();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="mt-auto space-y-2 pt-6">
              <Button 
                className="w-full bg-[#AA94E2] hover:bg-[#9b87f5] text-white"
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-[#AA94E2] text-[#6E59A5]"
                onClick={() => navigate('/login')}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      
      <CommandDialog open={isCommandOpen} onOpenChange={setIsCommandOpen}>
        <CommandInput placeholder="Search properties..." />
      </CommandDialog>
    </header>
  );
};

export default Header;

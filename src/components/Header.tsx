import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, LogIn } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { CommandDialog, CommandInput } from '@/components/ui/command';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCommandOpen, setIsCommandOpen] = useState(false);
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

  return (
    <header className="flex justify-between items-center py-4 px-6 md:px-12 max-w-7xl mx-auto">
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
      
      <motion.form
        className="flex-1 max-w-md mx-auto"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSearch}
      >
        <div className="relative">
          <Input
            type="text"
            placeholder="Search property address..."
            className="pl-10 pr-4 py-2 w-full bg-white/90 backdrop-blur-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Button 
            type="submit" 
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-tiptop-accent hover:bg-tiptop-accent/90 h-8"
          >
            Search
          </Button>
        </div>
      </motion.form>
      
      <motion.div
        className="space-x-2 flex items-center"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Button 
          variant="ghost" 
          className="hidden md:inline-flex"
          onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
        >
          How It Works
        </Button>
        <Button 
          variant="ghost" 
          className="hidden md:inline-flex"
          onClick={() => document.getElementById('quiz-section')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Earning Quiz
        </Button>
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
      
      <CommandDialog open={isCommandOpen} onOpenChange={setIsCommandOpen}>
        <CommandInput placeholder="Search properties..." />
      </CommandDialog>
    </header>
  );
};

export default Header;

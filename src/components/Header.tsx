
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const Header = () => {
  const scrollToForm = () => {
    const formElement = document.getElementById('asset-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
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
      <motion.div
        className="space-x-4"
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
          className="bg-tiptop-accent hover:bg-tiptop-accent/90 text-white"
          onClick={scrollToForm}
        >
          Get Started
        </Button>
      </motion.div>
    </header>
  );
};

export default Header;

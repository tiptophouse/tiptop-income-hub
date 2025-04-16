
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Hero = () => {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formElement = document.getElementById('asset-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 md:py-20 px-6 md:px-12 flex flex-col items-center text-center max-w-5xl mx-auto">
      <motion.h1 
        className="text-4xl md:text-6xl font-bold mb-6 leading-tight font-fahkwang text-tiptop-accent"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Discover Your Property's 
        <span className="block">Earning Potential</span>
      </motion.h1>
      
      <motion.p 
        className="text-xl md:text-2xl mb-10 text-[#552B1B] max-w-2xl font-work-sans"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        Monetize your rooftop, bandwidth, parking, and more — instantly.
      </motion.p>
      
      <motion.form
        className="w-full max-w-md mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        onSubmit={handleSearch}
      >
        <div className="relative">
          <Input
            type="text"
            placeholder="Enter your property address..."
            className="pl-10 pr-20 py-6 w-full rounded-lg text-lg"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Button 
            type="submit" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-tiptop-accent hover:bg-tiptop-accent/90 text-white px-4 py-2 rounded-md"
          >
            Analyze Property
          </Button>
        </div>
      </motion.form>
      
      <motion.div 
        className="mt-8 w-full max-w-3xl bg-white/50 backdrop-blur-sm rounded-3xl p-4 shadow-lg"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
      >
        <img 
          src="/lovable-uploads/4bc6d236-25b5-4fab-a4ef-10142c7c48e5.png"
          alt="Tiptop Dashboard Preview" 
          className="w-full h-auto md:h-72 object-cover rounded-2xl" 
        />
      </motion.div>
    </section>
  );
};

export default Hero;

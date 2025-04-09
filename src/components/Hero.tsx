
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const scrollToForm = () => {
    const formElement = document.getElementById('asset-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 md:py-20 px-6 md:px-12 flex flex-col items-center text-center max-w-5xl mx-auto">
      <motion.h1 
        className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Unlock Your Assets. 
        <span className="block text-tiptop-accent">Earn Passive Income.</span>
      </motion.h1>
      
      <motion.p 
        className="text-xl md:text-2xl mb-10 text-tiptop-dark/80 max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        Monetize your rooftop, bandwidth, parking, and more — instantly.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        <Button 
          className="bg-tiptop-accent hover:bg-tiptop-accent/90 text-white text-lg px-8 py-6"
          onClick={scrollToForm}
        >
          Get Started
        </Button>
      </motion.div>
      
      <motion.div 
        className="mt-16 w-full max-w-3xl bg-white/50 backdrop-blur-sm rounded-3xl p-4 shadow-lg"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
      >
        <img 
          src="/placeholder.svg" 
          alt="Income visualization" 
          className="w-full h-56 md:h-72 object-cover rounded-2xl" 
        />
      </motion.div>
    </section>
  );
};

export default Hero;

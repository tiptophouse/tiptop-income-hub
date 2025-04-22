
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GoogleMapsInit from './GoogleMapsInit';

const Hero = () => {
  return (
    <GoogleMapsInit>
      <section className="pt-16 pb-24 px-4 md:px-8 lg:px-12 flex flex-col items-center text-center max-w-6xl mx-auto">
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight font-poppins" 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.7 }}
        >
          Discover Your Property's 
          <span className="block">Earning Potential</span>
        </motion.h1>
        
        <motion.p 
          className="text-lg sm:text-xl mb-10 text-muted-foreground max-w-2xl" 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Monetize your rooftop, bandwidth, parking, and more — instantly.
        </motion.p>
        
        <AnimatePresence>
          <motion.div 
            key="house-image" 
            className="mt-4 w-full max-w-4xl bg-white rounded-2xl p-4 shadow-md" 
            initial={{ opacity: 0, y: 40 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.9 }} 
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <div className="relative">
              <img 
                alt="House with Assets" 
                className="w-full h-auto rounded-xl" 
                src="/lovable-uploads/913daccf-062e-43c1-a1ea-61722735d206.jpg" 
              />
              
              <div className="absolute top-[20%] right-[15%] bg-tiptop-accent text-white rounded-full p-2 shadow-lg animate-pulse">
                <span className="text-xs font-medium">Solar</span>
              </div>
              
              <div className="absolute top-[65%] left-[20%] bg-tiptop-accent text-white rounded-full p-2 shadow-lg animate-pulse">
                <span className="text-xs font-medium">Internet</span>
              </div>
              
              <div className="absolute bottom-[25%] right-[30%] bg-tiptop-accent text-white rounded-full p-2 shadow-lg animate-pulse">
                <span className="text-xs font-medium">Parking</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>
    </GoogleMapsInit>
  );
};

export default Hero;

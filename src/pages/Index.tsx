
import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import AssetForm from '@/components/AssetForm';
import EarningsQuiz from '@/components/EarningsQuiz';
import DashboardPreview from '@/components/DashboardPreview';
import Footer from '@/components/Footer';

const Index = () => {
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        duration: 0.8 
      } 
    }
  };
  
  const sectionVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7 } 
    }
  };
  
  return (
    <motion.div 
      className="min-h-screen flex flex-col bg-[#F8F3EA]"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <Header />
      <main className="flex-1">
        <motion.div variants={sectionVariants}>
          <Hero />
        </motion.div>
        
        <motion.div variants={sectionVariants}>
          <HowItWorks />
        </motion.div>
        
        <motion.div 
          variants={sectionVariants}
          className="py-8 md:py-12 px-4 md:px-8 bg-white"
        >
          <EarningsQuiz />
        </motion.div>
        
        <motion.div variants={sectionVariants}>
          <AssetForm />
        </motion.div>
        
        <motion.div 
          variants={sectionVariants}
          className="py-8 md:py-12 bg-[#F8F3EA]/70"
        >
          <DashboardPreview />
        </motion.div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default Index;

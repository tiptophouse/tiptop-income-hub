
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import HowItWorks from '@/components/HowItWorks';
import EarningsQuiz from '@/components/EarningsQuiz';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDED]">
      <Header />
      <main className="flex-1 overflow-x-hidden">
        <Hero />
        <div id="how-it-works">
          <HowItWorks />
        </div>
        <div id="quiz-section">
          <EarningsQuiz />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;

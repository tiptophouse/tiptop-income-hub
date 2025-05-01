
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDED]">
      <Header />
      <main className="flex-1 overflow-x-hidden">
        <Hero />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

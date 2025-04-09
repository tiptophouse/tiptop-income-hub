
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import AssetForm from '@/components/AssetForm';
import EarningsQuiz from '@/components/EarningsQuiz';
import DashboardPreview from '@/components/DashboardPreview';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-tiptop-light">
      <Header />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <EarningsQuiz />
        <AssetForm />
        <DashboardPreview />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

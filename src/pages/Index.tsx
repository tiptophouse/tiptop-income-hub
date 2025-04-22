
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import AssetForm from '@/components/AssetForm';
import DashboardPreview from '@/components/DashboardPreview';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 overflow-x-hidden">
        <Hero />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AssetForm />
          <DashboardPreview />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;

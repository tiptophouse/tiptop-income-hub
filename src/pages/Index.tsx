
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
      <main className="flex-1">
        <Hero />
        <AssetForm />
        <DashboardPreview />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

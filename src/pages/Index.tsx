
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to dashboard page when accessing the home page
    navigate('/dashboard');
  }, [navigate]);

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

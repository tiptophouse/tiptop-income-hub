
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ModelViewerScript from '@/components/ModelViewerScript';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <ModelViewerScript />
      <main className="flex-1 overflow-x-hidden">
        <Hero />
      </main>
      <div className="text-center p-4 text-sm text-gray-500">
        © 2025 Tiptop by Kolonia. All rights reserved.
      </div>
    </div>
  );
};

export default Index;

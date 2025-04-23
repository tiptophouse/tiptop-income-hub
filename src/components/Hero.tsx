
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GoogleMapsInit from './GoogleMapsInit';
import AddressSearchForm from './address/AddressSearchForm';
import PropertyAnalysisSection from './analysis/PropertyAnalysisSection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi, Sun, CarFront, TreeDeciduous } from 'lucide-react';

const Hero = () => {
  const [address, setAddress] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const assetCards = [
    {
      icon: <Sun className="h-8 w-8 text-yellow-500" />,
      title: "Rooftop Solar",
      description: "Generate clean energy and earn monthly income"
    },
    {
      icon: <Wifi className="h-8 w-8 text-blue-500" />,
      title: "Internet Bandwidth",
      description: "Share unused bandwidth capacity for passive income"
    },
    {
      icon: <CarFront className="h-8 w-8 text-purple-500" />,
      title: "Parking Space",
      description: "Rent out your unused parking space when not needed"
    },
    {
      icon: <TreeDeciduous className="h-8 w-8 text-green-500" />,
      title: "Garden Space",
      description: "Share your garden with the community for extra income"
    }
  ];

  return (
    <GoogleMapsInit>
      <section className="pt-10 md:pt-16 pb-16 md:pb-24 px-4 md:px-8 lg:px-12 flex flex-col items-center max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center w-full"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-[#AA94E2] font-fahkwang">
            Monetize Your Home Assets
          </h1>
          <p className="text-lg text-[#552B1B] max-w-2xl mx-auto mb-8 font-work-sans">
            Turn your property's untapped resources into monthly income
          </p>
          
          <AddressSearchForm
            address={address}
            setAddress={setAddress}
            isLocating={isLocating}
            setIsLocating={setIsLocating}
            setShowAnalysis={setShowAnalysis}
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mt-8"
        >
          {assetCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 bg-white border border-[#E5DEFF]">
                <CardHeader>
                  <div className="flex justify-center mb-2">
                    {card.icon}
                  </div>
                  <CardTitle className="text-lg truncate text-[#6E59A5]">{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-2 h-10 text-[#552B1B]">{card.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <PropertyAnalysisSection 
          address={address}
          show={showAnalysis}
        />
      </section>
    </GoogleMapsInit>
  );
};

export default Hero;

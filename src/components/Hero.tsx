
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GoogleMapsInit from './GoogleMapsInit';
import AddressAutocomplete from './AddressAutocomplete';
import PropertyInsights from './PropertyInsights';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi, Sun, CarFront, TreeDeciduous } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const [address, setAddress] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleAddressSelect = (selectedAddress: string) => {
    setAddress(selectedAddress);
    setShowAnalysis(true);
    
    const addressEvent = new CustomEvent('addressFound', {
      detail: { address: selectedAddress }
    });
    document.dispatchEvent(addressEvent);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      handleAddressSelect(address);
    }
  };

  const assetCards = [
    {
      icon: <Sun className="h-8 w-8 text-yellow-500" />,
      title: "Rooftop Solar",
      description: "Generate clean energy and earn monthly"
    },
    {
      icon: <Wifi className="h-8 w-8 text-blue-500" />,
      title: "Internet Bandwidth",
      description: "Share unused bandwidth capacity"
    },
    {
      icon: <CarFront className="h-8 w-8 text-purple-500" />,
      title: "Parking Space",
      description: "Rent out your unused parking space"
    },
    {
      icon: <TreeDeciduous className="h-8 w-8 text-green-500" />,
      title: "Garden Space",
      description: "Share your garden with the community"
    }
  ];

  return (
    <GoogleMapsInit>
      <section className="pt-16 pb-24 px-4 md:px-8 lg:px-12 flex flex-col items-center text-center max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center w-full"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-tiptop-accent font-poppins">
            Monetize Your Home Assets
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Turn your property's untapped resources into monthly income
          </p>
          
          <form onSubmit={handleSubmit} className="w-full">
            <AddressAutocomplete
              value={address}
              onChange={setAddress}
              onAddressSelect={handleAddressSelect}
            />
            <Button type="submit" className="hidden">Submit</Button>
          </form>
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
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {card.icon}
                  </div>
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{card.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {showAnalysis && (
          <PropertyInsights 
            address={address}
            className="w-full mt-8"
          />
        )}
      </section>
    </GoogleMapsInit>
  );
};

export default Hero;

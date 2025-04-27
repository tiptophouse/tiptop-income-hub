
import React from 'react';
import { DashboardLayout } from './DashboardLayout';
import { Sun, Wifi, Car, Droplet, Store, Camera, Home, Flower } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const monetizationOptions = [
  {
    id: 'solar',
    title: 'Solar Panels',
    icon: <Sun className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />,
    description: 'Monetize your rooftop with solar panel installation',
    earnings: '$100-$200/month'
  },
  {
    id: 'internet',
    title: 'Internet Bandwidth',
    icon: <Wifi className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />,
    description: 'Share your unused internet bandwidth',
    earnings: '$50-$150/month'
  },
  {
    id: 'ev',
    title: 'EV Charging',
    icon: <Car className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />,
    description: 'Install EV charging stations',
    earnings: '$75-$300/month'
  },
  {
    id: 'pool',
    title: 'Swimming Pool',
    icon: <Droplet className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />,
    description: 'Rent your pool hourly during summer months',
    earnings: '$200-$300/month'
  },
  {
    id: 'storage',
    title: 'Storage Space',
    icon: <Store className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />,
    description: 'Rent out unused garage or basement space',
    earnings: '$60-$90/month'
  },
  {
    id: 'items',
    title: 'Items & Equipment',
    icon: <Camera className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />,
    description: 'Rent out cameras, tools, and other equipment',
    earnings: '$40-$80/month'
  },
  {
    id: 'full-house',
    title: 'Full House Rental',
    icon: <Home className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />,
    description: 'Rent your entire home while away',
    earnings: '$500-$1000/month'
  },
  {
    id: 'garden',
    title: 'Garden Space',
    icon: <Flower className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />,
    description: 'Share your garden space for community use',
    earnings: '$50-$100/month'
  }
];

const AddAssetPage = () => (
  <DashboardLayout onSignOut={() => {}}>
    <div className="px-2 sm:px-4 md:px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <div>
          <h1 className="text-lg md:text-2xl font-medium">Add New Asset</h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground">Start monetizing a new property asset</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {monetizationOptions.map((option) => (
          <Card key={option.id} className="hover:border-primary hover:shadow-md cursor-pointer transition-all">
            <CardContent className="p-2 sm:p-3 md:p-4 flex flex-col items-center text-center space-y-1 sm:space-y-2 md:space-y-3 h-full">
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-primary/10 flex items-center justify-center mt-2 sm:mt-3">
                {option.icon}
              </div>
              <h3 className="text-xs sm:text-sm md:text-base font-medium">{option.title}</h3>
              <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground line-clamp-2">{option.description}</p>
              <p className="text-[10px] sm:text-xs md:text-sm text-primary font-medium">{option.earnings}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default AddAssetPage;


import React from 'react';
import { Droplet, Warehouse, Camera, Car, Zap, Home } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const additionalAssets = [
  {
    id: 'pool',
    title: 'Swimming Pool',
    icon: <Droplet className="h-5 w-5 text-blue-500" />,
    monthlyRange: '$200-300',
    description: 'Rent your pool hourly during summer months'
  },
  {
    id: 'storage',
    title: 'Storage Space',
    icon: <Warehouse className="h-5 w-5 text-green-500" />,
    monthlyRange: '$60-90',
    description: 'Unused garage or basement space can be rented'
  },
  {
    id: 'items',
    title: 'Items (Equipment)',
    icon: <Camera className="h-5 w-5 text-purple-500" />,
    monthlyRange: '$40-80',
    description: 'Rent out cameras, tools, and other equipment'
  },
  {
    id: 'car',
    title: 'Car Sharing',
    icon: <Car className="h-5 w-5 text-rose-500" />,
    monthlyRange: '$300-500',
    description: 'Share your vehicle when not in use'
  },
  {
    id: 'ev',
    title: 'EV Charger',
    icon: <Zap className="h-5 w-5 text-amber-500" />,
    monthlyRange: '$60-120',
    description: 'Allow others to use your EV charging station'
  },
  {
    id: 'house',
    title: 'Full House Rental',
    icon: <Home className="h-5 w-5 text-indigo-500" />,
    monthlyRange: '$500-1000',
    description: 'Rent your entire home on Airbnb while away'
  },
];

const AssetsCarousel: React.FC = () => {
  return (
    <div className="w-full py-6">
      <h2 className="text-2xl font-bold text-[#6E59A5] mb-4">Other Monetization Opportunities</h2>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {additionalAssets.map((asset) => (
            <CarouselItem key={asset.id} className="pl-2 md:pl-4 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
              <Card className="border border-[#E5DEFF] bg-white/50 backdrop-blur-sm hover:shadow-md transition-all">
                <CardContent className="p-2 sm:p-3">
                  <div className="flex items-start gap-2">
                    <Checkbox id={`asset-${asset.id}`} className="mt-1.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <div className="rounded-full bg-white p-1.5 shadow-sm">
                          {asset.icon}
                        </div>
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <h3 className="font-medium text-sm text-gray-900">{asset.title}</h3>
                          <p className="text-sm font-semibold text-[#8B5CF6]">{asset.monthlyRange}/month</p>
                          <p className="text-xs text-gray-500 line-clamp-2">{asset.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default AssetsCarousel;


import { Sun, Wifi, Car, Droplet, Store, Camera, Home, Flower } from 'lucide-react';

export const monetizationOptions = [
  {
    id: 'solar',
    title: 'Solar Panels',
    icon: Sun,
    description: 'Monetize your rooftop with solar panel installation',
    earnings: '$100-$200/month'
  },
  {
    id: 'internet',
    title: 'Internet Bandwidth',
    icon: Wifi,
    description: 'Share your unused internet bandwidth',
    earnings: '$50-$150/month'
  },
  {
    id: 'ev',
    title: 'EV Charging',
    icon: Car,
    description: 'Install EV charging stations',
    earnings: '$75-$300/month'
  },
  {
    id: 'pool',
    title: 'Swimming Pool',
    icon: Droplet,
    description: 'Rent your pool hourly during summer months',
    earnings: '$200-$300/month'
  },
  {
    id: 'storage',
    title: 'Storage Space',
    icon: Store,
    description: 'Rent out unused garage or basement space',
    earnings: '$60-$90/month'
  },
  {
    id: 'items',
    title: 'Items & Equipment',
    icon: Camera,
    description: 'Rent out cameras, tools, and other equipment',
    earnings: '$40-$80/month'
  },
  {
    id: 'full-house',
    title: 'Full House Rental',
    icon: Home,
    description: 'Rent your entire home while away',
    earnings: '$500-$1000/month'
  },
  {
    id: 'garden',
    title: 'Garden Space',
    icon: Flower,
    description: 'Share your garden space for community use',
    earnings: '$50-$100/month'
  }
] as const;


import React from 'react';
import { Sun, Wifi, Car, FileText, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const AddAssetPage = () => (
  <div className="p-6 max-w-7xl mx-auto">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-medium">Add New Asset</h1>
        <p className="text-muted-foreground">Start monetizing a new property asset</p>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Solar Panel Card */}
      <Card className="hover:border-primary hover:shadow-md cursor-pointer transition-all">
        <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Sun className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium text-center">Solar Panels</h3>
          <p className="text-sm text-center text-muted-foreground">Monetize your rooftop with solar panel installation</p>
          <p className="text-primary font-medium">$100-$200/month</p>
        </CardContent>
      </Card>
      
      {/* Internet Bandwidth Card */}
      <Card className="hover:border-primary hover:shadow-md cursor-pointer transition-all">
        <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Wifi className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium text-center">Internet Bandwidth</h3>
          <p className="text-sm text-center text-muted-foreground">Share your unused internet bandwidth</p>
          <p className="text-primary font-medium">$50-$150/month</p>
        </CardContent>
      </Card>
      
      {/* EV Charging Card */}
      <Card className="hover:border-primary hover:shadow-md cursor-pointer transition-all">
        <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Car className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium text-center">EV Charging</h3>
          <p className="text-sm text-center text-muted-foreground">Install EV charging stations</p>
          <p className="text-primary font-medium">$75-$300/month</p>
        </CardContent>
      </Card>
      
      {/* Storage Space Card */}
      <Card className="hover:border-primary hover:shadow-md cursor-pointer transition-all">
        <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium text-center">Storage Space</h3>
          <p className="text-sm text-center text-muted-foreground">Rent out unused storage space</p>
          <p className="text-primary font-medium">$50-$200/month</p>
        </CardContent>
      </Card>
      
      {/* Garden Space Card */}
      <Card className="hover:border-primary hover:shadow-md cursor-pointer transition-all">
        <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium text-center">Garden Space</h3>
          <p className="text-sm text-center text-muted-foreground">Rent your garden for urban farming</p>
          <p className="text-primary font-medium">$40-$120/month</p>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default AddAssetPage;

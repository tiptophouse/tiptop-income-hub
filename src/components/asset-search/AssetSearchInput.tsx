
import React from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface AssetSearchInputProps {
  address: string;
  isLocating: boolean;
  onAddressChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDetectLocation: () => void;
}

const AssetSearchInput: React.FC<AssetSearchInputProps> = ({
  address,
  isLocating,
  onAddressChange,
  onSubmit,
  onDetectLocation,
}) => (
  <motion.form 
    className="w-full mb-8"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay: 0.2 }}
    onSubmit={onSubmit}
    style={{ overflow: 'visible' }}
  >
    <div className="relative" style={{ overflow: 'visible' }}>
      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-muted-foreground" />
      </div>
      <Input 
        type="text" 
        placeholder="Enter your property address..." 
        className="pl-12 pr-28 py-5 w-full rounded-full text-base sm:text-lg shadow-lg border-none bg-white/95 backdrop-blur-sm focus:ring-4 focus:ring-[#9b87f5]/50 transition-all duration-300 placeholder:text-gray-400"
        value={address}
        onChange={(e) => onAddressChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onSubmit(e);
          }
        }}
        aria-label="Property address"
        autoComplete="street-address"
        spellCheck="false"
      />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          className="p-1 h-9 w-9 rounded-full hover:bg-[#9b87f5]/10 text-[#9b87f5]"
          onClick={onDetectLocation}
          disabled={isLocating}
          aria-label="Detect current location"
        >
          {isLocating ? (
            <svg className="animate-spin h-4 w-4 text-[#9b87f5]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <MapPin className="h-4 w-4 text-[#9b87f5]" />
          )}
        </Button>
        <Button 
          type="submit" 
          className="bg-[#9b87f5] hover:bg-[#8B5CF6] px-4 sm:px-6 py-3 h-auto rounded-full text-xs sm:text-sm font-semibold shadow-lg transition-all duration-300 hover:shadow-xl text-white whitespace-nowrap"
          aria-label="Analyze address"
        >
          Analyze Now
        </Button>
      </div>
    </div>
  </motion.form>
);

export default AssetSearchInput;

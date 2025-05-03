
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAddressAutocomplete } from '@/hooks/useAddressAutocomplete';
import { useAddressSearch } from '@/hooks/useAddressSearch';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AddressSearchFormProps {
  address: string;
  setAddress: (address: string) => void;
  isLocating: boolean;
  setIsLocating: (isLocating: boolean) => void;
  setShowAnalysis: (show: boolean) => void;
}

const AddressSearchForm = ({
  address,
  setAddress,
  isLocating,
  setIsLocating,
  setShowAnalysis
}: AddressSearchFormProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  
  // Initialize Google Places autocomplete
  useAddressAutocomplete(inputRef, setAddress, setShowAnalysis);
  
  // Handle form submission and location detection
  const { handleSearch, handleLocationDetection } = useAddressSearch(
    address, 
    setAddress, 
    setIsLocating, 
    setShowAnalysis
  );

  return (
    <motion.form 
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      onSubmit={handleSearch}
    >
      <div className="relative flex flex-col gap-4">
        <div className="glass-card rounded-xl relative">
          <div className="absolute inset-y-0 left-4 flex items-center">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search your address"
            className="w-full bg-transparent text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        
        <Button
          type="submit"
          className="bg-tiptop-accent hover:bg-tiptop-accent/90 text-white font-semibold py-3 px-6 rounded-xl"
          disabled={isLocating}
        >
          {isLocating ? 'Locating...' : 'Analyze now'}
        </Button>
      </div>
    </motion.form>
  );
};

export default AddressSearchForm;

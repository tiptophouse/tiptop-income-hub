
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileAddressForm from './MobileAddressForm';
import DesktopAddressForm from './DesktopAddressForm';
import { useAddressAutocomplete } from '@/hooks/useAddressAutocomplete';
import { useAddressSearch } from '@/hooks/useAddressSearch';

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
      className="w-full max-w-xl mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4 }}
      onSubmit={handleSearch}
      style={{ overflow: 'visible' }}
    >
      <div className="relative" style={{ overflow: 'visible' }}>
        {isMobile ? (
          <MobileAddressForm
            inputRef={inputRef}
            address={address}
            setAddress={setAddress}
            isLocating={isLocating}
            handleLocationDetection={handleLocationDetection}
          />
        ) : (
          <DesktopAddressForm
            inputRef={inputRef}
            address={address}
            setAddress={setAddress}
            isLocating={isLocating}
            handleLocationDetection={handleLocationDetection}
          />
        )}
      </div>
    </motion.form>
  );
};

export default AddressSearchForm;

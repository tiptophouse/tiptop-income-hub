
import React from 'react';
import LocationDetectButton from './LocationDetectButton';
import AddressInput from './AddressInput';
import AnalyzeButton from './AnalyzeButton';

interface MobileAddressFormProps {
  inputRef: React.RefObject<HTMLInputElement>;
  address: string;
  setAddress: (address: string) => void;
  isLocating: boolean;
  handleLocationDetection: () => void;
}

const MobileAddressForm: React.FC<MobileAddressFormProps> = ({
  inputRef,
  address,
  setAddress,
  isLocating,
  handleLocationDetection
}) => {
  return (
    <div className="flex items-center gap-2" style={{ overflow: 'visible' }}>
      <LocationDetectButton 
        onClick={handleLocationDetection}
        isLocating={isLocating}
        isMobile={true}
      />
      <div className="relative flex-1" style={{ overflow: 'visible' }}>
        <AddressInput
          ref={inputRef}
          value={address}
          onChange={setAddress}
          isMobile={true}
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <AnalyzeButton isMobile={true} />
        </div>
      </div>
    </div>
  );
};

export default MobileAddressForm;

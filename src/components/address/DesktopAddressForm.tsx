
import React from 'react';
import LocationDetectButton from './LocationDetectButton';
import AddressInput from './AddressInput';
import AnalyzeButton from './AnalyzeButton';

interface DesktopAddressFormProps {
  inputRef: React.RefObject<HTMLInputElement>;
  address: string;
  setAddress: (address: string) => void;
  isLocating: boolean;
  handleLocationDetection: () => void;
}

const DesktopAddressForm: React.FC<DesktopAddressFormProps> = ({
  inputRef,
  address,
  setAddress,
  isLocating,
  handleLocationDetection
}) => {
  return (
    <div className="relative" style={{ overflow: 'visible' }}>
      <AddressInput
        ref={inputRef}
        value={address}
        onChange={setAddress}
      />
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
        <LocationDetectButton 
          onClick={handleLocationDetection}
          isLocating={isLocating}
        />
        <AnalyzeButton />
      </div>
    </div>
  );
};

export default DesktopAddressForm;

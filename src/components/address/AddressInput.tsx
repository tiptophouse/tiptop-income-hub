
import React, { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  isMobile?: boolean;
}

const AddressInput = forwardRef<HTMLInputElement, AddressInputProps>(
  ({ value, onChange, isMobile = false }, ref) => {
    return (
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <Input 
          ref={ref}
          type="text" 
          placeholder="Enter your property address..." 
          className={`pl-10 pr-24 py-6 w-full rounded-full text-base ${
            isMobile ? '' : 'sm:text-lg'
          } shadow-lg border-none bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-tiptop-accent/50 transition-all duration-300`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="street-address"
          inputMode="text"
          spellCheck="false"
        />
      </div>
    );
  }
);

AddressInput.displayName = 'AddressInput';

export default AddressInput;

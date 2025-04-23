
import React from 'react';

interface GoogleMapsInitProps {
  children: React.ReactNode;
}

const GoogleMapsInit: React.FC<GoogleMapsInitProps> = ({ children }) => {
  return <>{children}</>;
};

export default GoogleMapsInit;

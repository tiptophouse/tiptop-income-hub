
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'partner' | 'user';
  status: 'active' | 'inactive';
  last_login: Date | null;
  created_at: Date;
  avatar_url: string | null;
}

export interface SolarSystemData {
  id: string;
  propertyId: string;
  systemSizeKw: number;
  panelsCount: number;
  yearlyEnergyKwh: number;
  installationDate: Date;
  installationCost: number;
  monthlyRevenue: number;
  breakEvenYears: number;
  carbonOffsetKg: number;
  efficiency: number;
  lastMaintenanceDate: Date | null;
  nextMaintenanceDate: Date | null;
}

export interface PropertyAsset {
  id: string;
  userId: string;
  address: string;
  type: 'solar' | 'parking' | 'bandwidth' | 'garden';
  status: 'active' | 'pending' | 'inactive';
  revenue: {
    monthly: number;
    annual: number;
  };
  metadata: {
    solar?: SolarSystemData;
    [key: string]: any;
  };
  created_at: Date;
  updated_at: Date;
}

// Mock data for the dashboard
export const assetTypes = ['rooftop', 'internet', 'parking', 'storage', 'garden'];
export const assetStatuses = ['active', 'pending', 'inactive'];

export const mockAssets = [
  { id: 1, type: 'rooftop', status: 'active', revenue: 150, partner: 'SolarCity', action: 'None', description: 'Solar panel installation' },
  { id: 2, type: 'internet', status: 'active', revenue: 120, partner: 'FastNet', action: 'Update bandwidth settings', description: 'Internet bandwidth sharing' },
  { id: 3, type: 'ev', status: 'active', revenue: 90, partner: 'ChargePro', action: 'None', description: 'EV charging stations' },
  { id: 4, type: 'storage', status: 'pending', revenue: 0, partner: 'StoreBox', action: 'Sign contract', description: 'Garage storage space' },
  { id: 5, type: 'garden', status: 'inactive', revenue: 0, partner: 'None', action: 'Complete registration', description: 'Backyard garden space' },
];

export const distributionData = [
  { name: 'Solar', value: 150, color: '#AA94E2' },
  { name: 'Internet', value: 120, color: '#4A3F68' },
  { name: 'EV Charging', value: 90, color: '#B5EAD7' },
  { name: 'Other', value: 40, color: '#FFD7BA' },
];

export const earningsData = [
  { month: 'Jan', solar: 120, internet: 100, ev: 80, storage: 0 },
  { month: 'Feb', solar: 130, internet: 110, ev: 85, storage: 0 },
  { month: 'Mar', solar: 140, internet: 115, ev: 90, storage: 0 },
  { month: 'Apr', solar: 150, internet: 120, ev: 90, storage: 0 },
  { month: 'May', solar: 145, internet: 125, ev: 95, storage: 0 },
  { month: 'Jun', solar: 155, internet: 130, ev: 100, storage: 20 },
];

export const connectedAccounts = [
  { name: 'SolarCity', status: 'Connected', lastSync: '2023-04-22' },
  { name: 'FastNet', status: 'Connected', lastSync: '2023-04-20' },
  { name: 'ChargePro', status: 'Connected', lastSync: '2023-04-18' },
  { name: 'StoreBox', status: 'Pending', lastSync: 'N/A' },
];

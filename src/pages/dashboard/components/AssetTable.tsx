
import React from 'react';
import { renderStatusBadge } from '../utils';

interface AssetTableProps {
  propertyInsights?: any;
}

export const AssetTable: React.FC<AssetTableProps> = ({ propertyInsights }) => {
  const assets = [
    { id: 1, name: 'Rooftop Solar Panels', status: 'active', monthlyRevenue: '$250' },
    { id: 2, name: 'Shared Internet Bandwidth', status: 'active', monthlyRevenue: '$180' },
    { id: 3, name: 'Parking Space Rental', status: 'pending', monthlyRevenue: '$120' },
    { id: 4, name: 'Community Garden Plot', status: 'inactive', monthlyRevenue: '$80' },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Asset
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Monthly Revenue
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {assets.map((asset) => (
            <tr key={asset.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {asset.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {renderStatusBadge(asset.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {asset.monthlyRevenue}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <a href="#" className="text-indigo-600 hover:text-indigo-900">Edit</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Add a default export that points to the AssetTable component
export default AssetTable;

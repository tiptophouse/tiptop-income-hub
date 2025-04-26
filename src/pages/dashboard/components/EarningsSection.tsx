import React from 'react';
import { Calendar, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockAssets } from '../dashboardData';
import { renderStatusBadge } from '../utils';

export const EarningsSection = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-medium">Earnings</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-1" /> Filter Date
          </Button>
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-1" /> Asset Type
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAssets
                    .filter(asset => asset.status === 'active')
                    .map((asset) => (
                      <TableRow key={`earning-${asset.id}`}>
                        <TableCell className="font-medium">
                          {asset.type === 'ev' ? 'EV Charging' : (asset.type.charAt(0).toUpperCase() + asset.type.slice(1))}
                        </TableCell>
                        <TableCell>${asset.revenue}</TableCell>
                        <TableCell>April 2023</TableCell>
                        <TableCell>{renderStatusBadge(asset.status)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
          
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base md:text-lg font-medium">Earnings Chart</CardTitle>
            <CardDescription>Last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 md:h-64">
              {/* Add your chart component here */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

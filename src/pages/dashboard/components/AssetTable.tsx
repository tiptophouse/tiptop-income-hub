import React from 'react';
import { Sun, Wifi, Car, FileText, Check, AlertTriangle, Edit, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { renderStatusBadge } from '../utils';
import { mockAssets } from '../dashboardData';

export const AssetTable = () => {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Actions</TableHead>
                <TableHead>Manage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAssets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <div className="mr-2 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {asset.type === 'rooftop' && <Sun className="h-4 w-4 text-primary" />}
                        {asset.type === 'internet' && <Wifi className="h-4 w-4 text-primary" />}
                        {asset.type === 'ev' && <Car className="h-4 w-4 text-primary" />}
                        {asset.type === 'storage' && <FileText className="h-4 w-4 text-primary" />}
                        {asset.type === 'garden' && <Check className="h-4 w-4 text-primary" />}
                      </div>
                      {asset.type === 'ev' ? 'EV Charging' : (asset.type.charAt(0).toUpperCase() + asset.type.slice(1))}
                    </div>
                  </TableCell>
                  <TableCell>{renderStatusBadge(asset.status)}</TableCell>
                  <TableCell>
                    {asset.status === 'active' ? (
                      <span className="font-medium">${asset.revenue}/mo</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>{asset.partner}</TableCell>
                  <TableCell>
                    {asset.action !== 'None' ? (
                      <Button variant="ghost" size="sm" className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 p-0">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        {asset.action}
                      </Button>
                    ) : (
                      <span className="text-green-600 flex items-center">
                        <Check className="h-4 w-4 mr-1" /> 
                        All set
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

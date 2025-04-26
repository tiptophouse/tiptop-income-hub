
import React from 'react';
import { Check, AlertTriangle, Info } from 'lucide-react';

export const renderStatusBadge = (status: string) => {
  if (status === 'active') {
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><Check className="w-3 h-3 mr-1" /> Active</span>;
  } else if (status === 'pending') {
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><AlertTriangle className="w-3 h-3 mr-1" /> Pending</span>;
  } else {
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><Info className="w-3 h-3 mr-1" /> Inactive</span>;
  }
};

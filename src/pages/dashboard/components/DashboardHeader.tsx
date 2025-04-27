
import React from 'react';

interface DashboardHeaderProps {
  userName: string;
}

const DashboardHeader = ({ userName }: DashboardHeaderProps) => (
  <div>
    <h1 className="text-xl md:text-2xl">Dashboard</h1>
    <p className="text-muted-foreground mt-1">Hello, {userName}! Here's your property summary.</p>
  </div>
);

export default DashboardHeader;


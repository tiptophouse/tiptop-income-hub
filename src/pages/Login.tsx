
import React from 'react';
import Login from '@/components/Login';
import { SidebarProvider } from '@/components/ui/sidebar';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-tiptop-light">
      <SidebarProvider>
        <div className="min-h-screen w-full">
          <Login />
        </div>
      </SidebarProvider>
    </div>
  );
};

export default LoginPage;

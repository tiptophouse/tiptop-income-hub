
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/pages/dashboard/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { UploadCloud, Users, FileSpreadsheet, Plus, Save, Trash2 } from 'lucide-react';
import AdminUserManagement from '@/components/admin/AdminUserManagement';
import AdminRequirementsList from '@/components/admin/AdminRequirementsList';
import AdminPartnersList from '@/components/admin/AdminPartnersList';
import AdminCsvImport from '@/components/admin/AdminCsvImport';
import AdminInsightsDashboard from '@/components/admin/AdminInsightsDashboard';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('requirements');
  const [isLoading, setIsLoading] = useState(false);
  const [adminUser, setAdminUser] = useState(false);
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // In a real application, check if user is admin from the database
          // For demo purposes, we're assuming the user is an admin
          setAdminUser(true);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        toast({
          title: "Error",
          description: "Failed to verify admin credentials",
          variant: "destructive"
        });
      }
    };
    
    checkAdminStatus();
  }, []);
  
  if (!adminUser) {
    return (
      <DashboardLayout onSignOut={() => {}}>
        <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                You don't have permission to access the admin dashboard.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout onSignOut={() => {}}>
      <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        <Card className="border-none shadow-none">
          <CardHeader className="px-0">
            <CardTitle className="text-2xl font-bold">Admin Dashboard</CardTitle>
            <CardDescription>
              Manage qualification requirements, partners, and user accounts
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="partners">Partners</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="import">Import CSV</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="requirements" className="space-y-4">
            <AdminRequirementsList />
          </TabsContent>
          
          <TabsContent value="partners" className="space-y-4">
            <AdminPartnersList />
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <AdminUserManagement />
          </TabsContent>
          
          <TabsContent value="import" className="space-y-4">
            <AdminCsvImport />
          </TabsContent>
          
          <TabsContent value="insights" className="space-y-4">
            <AdminInsightsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminPage;

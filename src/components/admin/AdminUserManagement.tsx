
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { UserPlus } from 'lucide-react';
import UserListTable from './users/UserListTable';
import UserEditDialog from './users/UserEditDialog';
import UserSearch from './users/UserSearch';
import type { User } from './users/types';

const AdminUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  useEffect(() => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      setFilteredUsers(
        users.filter(user => 
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.role.toLowerCase().includes(searchLower)
        )
      );
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);
  
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from Supabase
      // For demo purposes, we'll use mock data
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          status: 'active',
          last_login: new Date(),
          created_at: new Date(2023, 1, 15),
          avatar_url: null
        },
        ...Array(15).fill(null).map((_, index) => ({
          id: `${index + 2}`,
          name: `User ${index + 2}`,
          email: `user${index + 2}@example.com`,
          role: ['partner', 'user'][Math.floor(Math.random() * 2)] as 'partner' | 'user',
          status: ['active', 'inactive'][Math.floor(Math.random() * 2)] as 'active' | 'inactive',
          last_login: Math.random() > 0.2 ? new Date() : null,
          created_at: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          avatar_url: null
        }))
      ];
      
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleToggleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };
  
  const handleSelectAllUsers = (selected: boolean) => {
    if (selected) {
      setSelectedUsers(filteredUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };
  
  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setIsEditDialogOpen(true);
  };
  
  const handleUpdateUser = () => {
    if (!currentUser) return;
    
    try {
      // In a real app, this would update in Supabase
      const updatedUsers = users.map(u => 
        u.id === currentUser.id ? currentUser : u
      );
      
      setUsers(updatedUsers);
      setIsEditDialogOpen(false);
      
      toast({
        title: 'Success',
        description: 'User updated successfully',
      });
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user',
        variant: 'destructive'
      });
    }
  };
  
  const handleDeleteSelectedUsers = async () => {
    if (selectedUsers.length === 0) return;
    
    try {
      // In a real app, this would delete from Supabase
      const remainingUsers = users.filter(user => !selectedUsers.includes(user.id));
      setUsers(remainingUsers);
      setSelectedUsers([]);
      
      toast({
        title: 'Success',
        description: `${selectedUsers.length} user(s) deleted successfully`,
      });
    } catch (error) {
      console.error('Error deleting users:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete users',
        variant: 'destructive'
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Manage user accounts and permissions
            </CardDescription>
          </div>
          <Button variant="outline">
            <UserPlus className="h-4 w-4 mr-1" />
            Add User
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <UserSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedUsers={selectedUsers}
          onDeleteSelected={handleDeleteSelectedUsers}
        />
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
          </div>
        ) : filteredUsers.length > 0 ? (
          <UserListTable
            users={filteredUsers}
            selectedUsers={selectedUsers}
            onToggleSelectUser={handleToggleSelectUser}
            onSelectAllUsers={handleSelectAllUsers}
            onEditUser={handleEditUser}
          />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No users found matching your search criteria.
          </div>
        )}

        <UserEditDialog
          user={currentUser}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onUpdateUser={handleUpdateUser}
          onUserChange={setCurrentUser}
        />
      </CardContent>
    </Card>
  );
};

export default AdminUserManagement;

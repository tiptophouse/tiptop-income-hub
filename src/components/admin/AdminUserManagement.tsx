
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Search, 
  MoreHorizontal, 
  UserPlus, 
  UserMinus, 
  Shield, 
  Mail, 
  Lock 
} from 'lucide-react';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'partner' | 'user';
  status: 'active' | 'inactive';
  last_login: Date | null;
  created_at: Date;
  avatar_url: string | null;
};

const AdminUserManagement: React.FC = () => {
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
        ...Array(15).fill(null).map((_, index) => {
          const roles = ['partner', 'user'] as const;
          const statuses = ['active', 'inactive'] as const;
          const randomRole = roles[Math.floor(Math.random() * roles.length)];
          const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
          const randomDate = new Date();
          randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));
          
          return {
            id: `${index + 2}`,
            name: `User ${index + 2}`,
            email: `user${index + 2}@example.com`,
            role: randomRole,
            status: randomStatus,
            last_login: Math.random() > 0.2 ? randomDate : null,
            created_at: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
            avatar_url: null
          };
        })
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
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          {selectedUsers.length > 0 && (
            <Button 
              variant="destructive"
              size="sm"
              onClick={handleDeleteSelectedUsers}
              className="self-end"
            >
              <UserMinus className="h-4 w-4 mr-1" />
              Delete Selected ({selectedUsers.length})
            </Button>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="border rounded-md">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="p-2 text-left">
                    <Checkbox
                      checked={selectedUsers.length === filteredUsers.length}
                      onCheckedChange={handleSelectAllUsers}
                      aria-label="Select all users"
                    />
                  </th>
                  <th className="p-2 text-left">User</th>
                  <th className="p-2 text-left hidden md:table-cell">Role</th>
                  <th className="p-2 text-left hidden md:table-cell">Status</th>
                  <th className="p-2 text-left hidden md:table-cell">Last Login</th>
                  <th className="p-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t hover:bg-muted/30">
                    <td className="p-2">
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => handleToggleSelectUser(user.id)}
                        aria-label={`Select ${user.name}`}
                      />
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          {user.avatar_url ? (
                            <AvatarImage src={user.avatar_url} alt={user.name} />
                          ) : null}
                          <AvatarFallback>
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-2 hidden md:table-cell">
                      <Badge 
                        variant={
                          user.role === 'admin' ? 'secondary' : 
                          user.role === 'partner' ? 'outline' : 
                          'default'
                        }
                        className="text-xs"
                      >
                        {user.role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </td>
                    <td className="p-2 hidden md:table-cell">
                      <Badge 
                        variant={user.status === 'active' ? 'default' : 'secondary'}
                        className={`text-xs ${user.status === 'inactive' ? 'bg-gray-200 text-gray-700' : ''}`}
                      >
                        {user.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="p-2 text-xs text-muted-foreground hidden md:table-cell">
                      {user.last_login 
                        ? new Date(user.last_login).toLocaleString() 
                        : 'Never logged in'}
                    </td>
                    <td className="p-2 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            {user.status === 'active' ? 'Deactivate' : 'Activate'}
                          </DropdownMenuItem>
                          <DropdownMenuItem>Reset Password</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No users found matching your search criteria.
          </div>
        )}
      </CardContent>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions
            </DialogDescription>
          </DialogHeader>
          
          {currentUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  {currentUser.avatar_url ? (
                    <AvatarImage src={currentUser.avatar_url} alt={currentUser.name} />
                  ) : null}
                  <AvatarFallback>
                    {currentUser.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{currentUser.email}</h4>
                  <p className="text-sm text-muted-foreground">
                    Created on {new Date(currentUser.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  value={currentUser.name}
                  onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <select
                    value={currentUser.role}
                    onChange={(e) => setCurrentUser({
                      ...currentUser, 
                      role: e.target.value as 'admin' | 'partner' | 'user'
                    })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="admin">Admin</option>
                    <option value="partner">Partner</option>
                    <option value="user">User</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select
                    value={currentUser.status}
                    onChange={(e) => setCurrentUser({
                      ...currentUser, 
                      status: e.target.value as 'active' | 'inactive'
                    })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="gap-2">
                  <Mail className="h-4 w-4" />
                  Send Password Reset Email
                </Button>
                <Button variant="outline" className="gap-2">
                  <Lock className="h-4 w-4" />
                  Reset Password Manually
                </Button>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AdminUserManagement;

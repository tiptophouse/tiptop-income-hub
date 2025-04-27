
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Shield, MoreHorizontal } from 'lucide-react';
import { User } from './types';

interface UserListTableProps {
  users: User[];
  selectedUsers: string[];
  onToggleSelectUser: (userId: string) => void;
  onSelectAllUsers: (selected: boolean) => void;
  onEditUser: (user: User) => void;
}

const UserListTable = ({
  users,
  selectedUsers,
  onToggleSelectUser,
  onSelectAllUsers,
  onEditUser,
}: UserListTableProps) => {
  return (
    <div className="border rounded-md">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/50">
            <th className="p-2 text-left">
              <Checkbox
                checked={selectedUsers.length === users.length}
                onCheckedChange={onSelectAllUsers}
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
          {users.map((user) => (
            <tr key={user.id} className="border-t hover:bg-muted/30">
              <td className="p-2">
                <Checkbox
                  checked={selectedUsers.includes(user.id)}
                  onCheckedChange={() => onToggleSelectUser(user.id)}
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
                    <DropdownMenuItem onClick={() => onEditUser(user)}>
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
  );
};

export default UserListTable;

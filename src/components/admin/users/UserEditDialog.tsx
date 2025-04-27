
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Mail, Lock } from 'lucide-react';
import { User } from './types';

interface UserEditDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateUser: () => void;
  onUserChange: (user: User) => void;
}

const UserEditDialog = ({
  user,
  open,
  onOpenChange,
  onUpdateUser,
  onUserChange,
}: UserEditDialogProps) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information and permissions
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              {user.avatar_url ? (
                <AvatarImage src={user.avatar_url} alt={user.name} />
              ) : null}
              <AvatarFallback>
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium">{user.email}</h4>
              <p className="text-sm text-muted-foreground">
                Created on {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <Input
              value={user.name}
              onChange={(e) => onUserChange({...user, name: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <select
                value={user.role}
                onChange={(e) => onUserChange({
                  ...user, 
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
                value={user.status}
                onChange={(e) => onUserChange({
                  ...user, 
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
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onUpdateUser}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserEditDialog;

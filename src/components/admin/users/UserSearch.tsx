
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, UserMinus } from 'lucide-react';

interface UserSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedUsers: string[];
  onDeleteSelected: () => void;
}

const UserSearch = ({
  searchTerm,
  onSearchChange,
  selectedUsers,
  onDeleteSelected
}: UserSearchProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
      {selectedUsers.length > 0 && (
        <Button 
          variant="destructive"
          size="sm"
          onClick={onDeleteSelected}
          className="self-end"
        >
          <UserMinus className="h-4 w-4 mr-1" />
          Delete Selected ({selectedUsers.length})
        </Button>
      )}
    </div>
  );
};

export default UserSearch;

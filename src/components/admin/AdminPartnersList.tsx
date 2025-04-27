
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
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  X, 
  Building, 
  UserCheck,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

type Partner = {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'active' | 'pending' | 'rejected';
  created_at: Date;
  requirements_met: number;
  total_requirements: number;
};

const AdminPartnersList: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const partnersPerPage = 10;
  
  useEffect(() => {
    fetchPartners();
  }, []);
  
  useEffect(() => {
    filterPartners();
  }, [searchTerm, statusFilter, partners]);
  
  const fetchPartners = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from Supabase
      // For demo purposes, we'll use mock data
      const mockPartners: Partner[] = Array(25).fill(null).map((_, index) => {
        const statuses = ['active', 'pending', 'rejected'] as const;
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const totalReqs = Math.floor(Math.random() * 10) + 5;
        const metReqs = randomStatus === 'active' 
          ? totalReqs 
          : Math.floor(Math.random() * (totalReqs - 2)) + 2;
        
        return {
          id: `partner-${index + 1}`,
          name: `Partner ${index + 1}`,
          email: `partner${index + 1}@example.com`,
          company: `Company ${String.fromCharCode(65 + (index % 26))}`,
          status: randomStatus,
          created_at: new Date(Date.now() - Math.random() * 10000000000),
          requirements_met: metReqs,
          total_requirements: totalReqs
        };
      });
      
      setPartners(mockPartners);
      setFilteredPartners(mockPartners);
    } catch (error) {
      console.error('Error fetching partners:', error);
      toast({
        title: 'Error',
        description: 'Failed to load partners data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const filterPartners = () => {
    let filtered = [...partners];
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.email.toLowerCase().includes(searchLower) ||
        p.company.toLowerCase().includes(searchLower)
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }
    
    setFilteredPartners(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };
  
  const handleUpdateStatus = async (partnerId: string, newStatus: 'active' | 'pending' | 'rejected') => {
    try {
      // In a real app, this would update in Supabase
      const updatedPartners = partners.map(p => 
        p.id === partnerId ? { ...p, status: newStatus } : p
      );
      
      setPartners(updatedPartners);
      
      toast({
        title: 'Success',
        description: `Partner status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating partner status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update partner status',
        variant: 'destructive'
      });
    }
  };
  
  // Calculate pagination
  const indexOfLastPartner = currentPage * partnersPerPage;
  const indexOfFirstPartner = indexOfLastPartner - partnersPerPage;
  const currentPartners = filteredPartners.slice(indexOfFirstPartner, indexOfLastPartner);
  const totalPages = Math.ceil(filteredPartners.length / partnersPerPage);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Partners</CardTitle>
        <CardDescription>
          Manage partner accounts and their qualification status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search partners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
          </div>
        ) : filteredPartners.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No partners found matching your search criteria.
          </div>
        ) : (
          <>
            <div className="border rounded-md overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Requirements Met</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPartners.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{partner.name}</div>
                          <div className="text-sm text-muted-foreground">{partner.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          {partner.company}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {partner.requirements_met === partner.total_requirements ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                          )}
                          {partner.requirements_met}/{partner.total_requirements}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            partner.status === 'active' ? 'default' : 
                            partner.status === 'pending' ? 'outline' : 
                            'destructive'
                          }
                        >
                          {partner.status === 'active' && <Check className="h-3 w-3 mr-1" />}
                          {partner.status === 'pending' && <Shield className="h-3 w-3 mr-1" />}
                          {partner.status === 'rejected' && <X className="h-3 w-3 mr-1" />}
                          {partner.status.charAt(0).toUpperCase() + partner.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {partner.status !== 'active' && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => handleUpdateStatus(partner.id, 'active')}
                            >
                              <UserCheck className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                          )}
                          {partner.status !== 'rejected' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleUpdateStatus(partner.id, 'rejected')}
                            >
                              <X className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {indexOfFirstPartner + 1} to {Math.min(indexOfLastPartner, filteredPartners.length)} of {filteredPartners.length} partners
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous Page</span>
                  </Button>
                  <div className="text-sm">
                    Page {currentPage} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next Page</span>
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminPartnersList;

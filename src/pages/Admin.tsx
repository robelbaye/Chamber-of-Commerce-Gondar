import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Users, CheckCircle, Clock, XCircle, LogOut, Newspaper, Calendar, Image, Settings, Receipt } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import NewsForm from '@/components/NewsForm';
import NewsList from '@/components/NewsList';
import EventManagement from './EventManagement';
import GalleryManagement from './GalleryManagement';
import ServiceManagement from './ServiceManagement';
import ReceiptVerification from '@/components/ReceiptVerification';
import AdminPasswordReset from '@/components/AdminPasswordReset';

interface Registration {
  id: string;
  created_at: string;
  name: string;
  business_name: string;
  email: string;
  phone?: string;
  sector?: string;
  membership_type: string;
  status: string;
}

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [activeTab, setActiveTab] = useState('members');
  const [newsView, setNewsView] = useState<'list' | 'create' | 'edit'>('list');
  const [editingArticle, setEditingArticle] = useState<any>();
  const [refreshNews, setRefreshNews] = useState(false);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRegistrations(data || []);
      
      const total = data?.length || 0;
      const pending = data?.filter(r => r.status === 'pending').length || 0;
      const approved = data?.filter(r => r.status === 'approved').length || 0;
      const rejected = data?.filter(r => r.status === 'rejected').length || 0;
      
      setStats({ total, pending, approved, rejected });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch registrations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Registration status changed to ${newStatus}`
      });

      fetchRegistrations();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      approved: 'default',
      rejected: 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome, {user?.name}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchRegistrations}>Refresh</Button>
          <Button variant="outline" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="members">
            <Users className="h-4 w-4 mr-2" />
            Members
          </TabsTrigger>
          <TabsTrigger value="news">
            <Newspaper className="h-4 w-4 mr-2" />
            News
          </TabsTrigger>
          <TabsTrigger value="events">
            <Calendar className="h-4 w-4 mr-2" />
            Events
          </TabsTrigger>
          <TabsTrigger value="gallery">
            <Image className="h-4 w-4 mr-2" />
            Gallery
          </TabsTrigger>
          <TabsTrigger value="services">
            <Settings className="h-4 w-4 mr-2" />
            Services
          </TabsTrigger>
          <TabsTrigger value="receipts">
            <Receipt className="h-4 w-4 mr-2" />
            Receipts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pending}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.approved}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.rejected}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Member Registrations</CardTitle>
              <CardDescription>Manage membership applications and reset passwords</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((registration) => (
                    <TableRow key={registration.id}>
                      <TableCell className="font-medium">{registration.name}</TableCell>
                      <TableCell>{registration.business_name}</TableCell>
                      <TableCell>{registration.email}</TableCell>
                      <TableCell>{registration.membership_type}</TableCell>
                      <TableCell>{getStatusBadge(registration.status)}</TableCell>
                      <TableCell>{new Date(registration.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Select
                            value={registration.status}
                            onValueChange={(value) => updateStatus(registration.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                          <AdminPasswordReset 
                            memberEmail={registration.email}
                            memberName={registration.name}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news" className="space-y-6">
          {newsView === 'list' && (
            <NewsList
              onEdit={(article) => {
                setEditingArticle(article);
                setNewsView('edit');
              }}
              onNew={() => {
                setEditingArticle(undefined);
                setNewsView('create');
              }}
              refresh={refreshNews}
            />
          )}
          {(newsView === 'create' || newsView === 'edit') && (
            <NewsForm
              article={editingArticle}
              onSave={() => {
                setNewsView('list');
                setEditingArticle(undefined);
                setRefreshNews(prev => !prev);
              }}
              onCancel={() => {
                setNewsView('list');
                setEditingArticle(undefined);
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <EventManagement />
        </TabsContent>

        <TabsContent value="gallery" className="space-y-6">
          <GalleryManagement />
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <ServiceManagement />
        </TabsContent>

        <TabsContent value="receipts" className="space-y-6">
          <ReceiptVerification />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Admin = () => {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  );
};

export default Admin;
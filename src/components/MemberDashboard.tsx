import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Clock, XCircle, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import EventReceiptUpload from './EventReceiptUpload';

interface MemberDashboardProps {
  memberData: any;
  onLogout: () => void;
}

const MemberDashboard: React.FC<MemberDashboardProps> = ({ memberData: initialData, onLogout }) => {
  const [memberData, setMemberData] = useState(initialData);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
    fetchMemberData();
  }, []);

  const fetchMemberData = async () => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .eq('id', memberData.id)
        .single();

      if (data) {
        setMemberData(data);
      }
    } catch (err) {
      console.error('Error fetching member data:', err);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('member_messages')
        .select('*')
        .eq('member_email', memberData.email)
        .order('created_at', { ascending: false });

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching messages:', error);
      } else if (data) {
        setMessages(data);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'verified':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Member Dashboard</h1>
        <Button onClick={onLogout} variant="outline">
          Logout
        </Button>
      </div>

      {/* Verification Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(memberData.verification_status)}
            Verification Status
          </CardTitle>
          <CardDescription>Your current membership verification status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Badge className={getStatusColor(memberData.verification_status || 'pending')}>
              {memberData.verification_status || 'Pending'}
            </Badge>
            {memberData.verification_reason && (
              <p className="text-sm text-gray-600">{memberData.verification_reason}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Receipt Upload */}
      <EventReceiptUpload 
        memberData={memberData} 
        onUploadSuccess={fetchMemberData}
      />

      {/* Registration Details */}
      <Card>
        <CardHeader>
          <CardTitle>Registration Information</CardTitle>
          <CardDescription>Your registration details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">{memberData.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{memberData.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium">{memberData.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Username</p>
              <p className="font-medium">{memberData.username || 'Not set'}</p>
            </div>
          </div>
          {memberData.business_name && (
            <div>
              <p className="text-sm text-gray-600">Business Name</p>
              <p className="font-medium">{memberData.business_name}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Messages from Admin */}
      <Card>
        <CardHeader>
          <CardTitle>Messages from Admin</CardTitle>
          <CardDescription>Important updates and notifications</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((message) => (
                <Alert key={message.id}>
                  <AlertDescription>
                    <div className="space-y-2">
                      <p>{message.message}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(message.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No messages yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberDashboard;
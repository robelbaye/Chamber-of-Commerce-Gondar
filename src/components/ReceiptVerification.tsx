import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Eye, Download } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const ReceiptVerification: React.FC = () => {
  const [receipts, setReceipts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPendingReceipts();
  }, []);

  const fetchPendingReceipts = async () => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .not('receipt_url', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReceipts(data || []);
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to fetch receipts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (memberId: string, status: 'verified' | 'rejected', reason?: string) => {
    setProcessingId(memberId);
    
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ 
          verification_status: status,
          verification_reason: reason || null
        })
        .eq('id', memberId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Receipt ${status} successfully`,
      });

      fetchPendingReceipts();
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to update verification status",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const downloadReceipt = async (receiptUrl: string, memberName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('receipts')
        .download(receiptUrl);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt_${memberName}_${receiptUrl}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to download receipt",
        variant: "destructive",
      });
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

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Receipt Verification</h2>
      
      {receipts.length === 0 ? (
        <Alert>
          <AlertDescription>No receipts to review at this time.</AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-4">
          {receipts.map((member) => (
            <Card key={member.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <p className="text-sm text-gray-600">{member.email}</p>
                  </div>
                  <Badge className={getStatusColor(member.verification_status || 'pending')}>
                    {member.verification_status || 'Pending'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Phone:</span> {member.phone}
                  </div>
                  <div>
                    <span className="font-medium">Business:</span> {member.business_name || 'N/A'}
                  </div>
                </div>

                {member.verification_reason && (
                  <Alert>
                    <AlertDescription>
                      <strong>Reason:</strong> {member.verification_reason}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadReceipt(member.receipt_url, member.name)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download Receipt
                  </Button>
                </div>

                {member.verification_status === 'pending' && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => handleVerification(member.id, 'verified')}
                      disabled={processingId === member.id}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Verify
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        const reason = prompt('Enter rejection reason (optional):');
                        handleVerification(member.id, 'rejected', reason || undefined);
                      }}
                      disabled={processingId === member.id}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReceiptVerification;
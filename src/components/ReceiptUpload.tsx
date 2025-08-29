import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface ReceiptUploadProps {
  memberData: any;
  onUploadSuccess: () => void;
}

const ReceiptUpload: React.FC<ReceiptUploadProps> = ({ memberData, onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Please upload a PDF, JPG, or PNG file.');
        return;
      }
      
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB.');
        return;
      }
      
      setFile(selectedFile);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setError('');

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${memberData.id}_${Date.now()}.${fileExt}`;
      
      // Upload file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Update member record with receipt URL
      const { error: updateError } = await supabase
        .from('registrations')
        .update({ 
          receipt_url: fileName,
          verification_status: 'pending'
        })
        .eq('id', memberData.id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Receipt uploaded successfully!",
        description: "Your receipt is now pending admin verification.",
      });

      onUploadSuccess();
    } catch (err: any) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Membership Receipt
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {memberData.receipt_url ? (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Receipt uploaded successfully. Status: {memberData.verification_status || 'Pending'}
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div>
              <Label htmlFor="receipt">Upload Receipt (PDF, JPG, PNG - Max 5MB)</Label>
              <Input
                id="receipt"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="mt-1"
              />
            </div>
            
            {file && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="h-4 w-4" />
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Button 
              onClick={handleUpload} 
              disabled={!file || uploading}
              className="w-full"
            >
              {uploading ? 'Uploading...' : 'Upload Receipt'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ReceiptUpload;
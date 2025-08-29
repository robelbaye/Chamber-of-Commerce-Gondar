import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, CheckCircle, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import OTPVerification from './OTPVerification';

interface Event {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
}

interface EventReceiptUploadProps {
  memberData: any;
  onUploadSuccess: () => void;
}

const ETHIOPIAN_BANKS = [
  'Commercial Bank of Ethiopia (CBE)',
  'Development Bank of Ethiopia (DBE)',
  'Awash Bank',
  'Dashen Bank',
  'Bank of Abyssinia',
  'Wegagen Bank',
  'Nib International Bank',
  'Hibret Bank (United Bank)',
  'Lion International Bank',
  'Zemen Bank',
  'Oromia International Bank',
  'Cooperative Bank of Oromia',
  'Berhan Bank',
  'Abay Bank',
  'Bunna International Bank',
  'Debub Global Bank',
  'Enat Bank',
  'Addis International Bank',
  'Gadaa Bank',
  'Siinqee Bank',
  'Shabelle Bank',
  'Hijra Bank',
  'ZamZam Bank',
  'Rammis Bank',
  'Tsehay Bank',
  'Ahadu Bank',
  'Amhara Bank',
  'Goh Betoch Bank',
  'Sheger Bank',
  'Telebirr',
  'M-Pesa Ethiopia'
];

const EventReceiptUpload: React.FC<EventReceiptUploadProps> = ({ memberData, onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('events')
        .select('id, title, start_date, end_date')
        .gte('end_date', today)
        .order('start_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Please upload a PDF, JPG, or PNG file.');
        return;
      }
      
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB.');
        return;
      }
      
      setFile(selectedFile);
      setError('');
    }
  };

  const handleUploadClick = () => {
    if (!file || !selectedEvent || !selectedBank) {
      setError('Please select an event, bank, and upload a receipt file.');
      return;
    }
    
    if (!otpVerified) {
      setShowOTP(true);
      return;
    }
    
    handleUpload();
  };

  const handleUpload = async () => {
    if (!file || !selectedEvent || !selectedBank) return;
    
    setUploading(true);
    setError('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${memberData.id}_${selectedEvent}_${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase
        .from('receipt_uploads')
        .insert({
          member_id: memberData.id,
          event_id: selectedEvent,
          bank_name: selectedBank,
          receipt_url: fileName,
          status: 'pending'
        });

      if (insertError) throw insertError;

      toast({
        title: "Receipt uploaded successfully!",
        description: "Your receipt is now pending admin verification.",
      });

      setFile(null);
      setSelectedEvent('');
      setSelectedBank('');
      setOtpVerified(false);
      onUploadSuccess();
    } catch (err: any) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (showOTP && !otpVerified) {
    return (
      <OTPVerification
        phoneNumber={memberData.phone}
        purpose="receipt_upload"
        onVerified={() => {
          setOtpVerified(true);
          setShowOTP(false);
          handleUpload();
        }}
        onCancel={() => setShowOTP(false)}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Event Payment Receipt
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="event">Select Event</Label>
          <Select value={selectedEvent} onValueChange={setSelectedEvent}>
            <SelectTrigger>
              <SelectValue placeholder="Choose an event" />
            </SelectTrigger>
            <SelectContent>
              {events.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {event.title} ({new Date(event.start_date).toLocaleDateString()})
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="bank">Payment Method / Bank</Label>
          <Select value={selectedBank} onValueChange={setSelectedBank}>
            <SelectTrigger>
              <SelectValue placeholder="Select bank or payment method" />
            </SelectTrigger>
            <SelectContent>
              {ETHIOPIAN_BANKS.map((bank) => (
                <SelectItem key={bank} value={bank}>
                  {bank}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
          onClick={handleUploadClick} 
          disabled={!file || !selectedEvent || !selectedBank || uploading}
          className="w-full"
        >
          {uploading ? 'Uploading...' : otpVerified ? 'Upload Receipt' : 'Verify & Upload Receipt'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EventReceiptUpload;
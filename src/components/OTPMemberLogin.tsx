import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, User, Phone } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import OTPVerification from './OTPVerification';

interface OTPMemberLoginProps {
  onLogin: (memberData: any) => void;
  onBack: () => void;
}

const OTPMemberLogin: React.FC<OTPMemberLoginProps> = ({ onLogin, onBack }) => {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [memberData, setMemberData] = useState<any>(null);
  const [showOTP, setShowOTP] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your phone number or email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Check if member exists
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .or(`phone.eq.${identifier},email.eq.${identifier}`)
        .single();

      if (error || !data) {
        throw new Error('Member not found. Please check your phone number or email.');
      }

      if (!data.phone) {
        throw new Error('Phone number not found for this account. Please contact admin.');
      }

      setMemberData(data);
      setShowOTP(true);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerified = () => {
    toast({
      title: "Login Successful",
      description: "Welcome to your member dashboard!",
    });
    onLogin(memberData);
  };

  if (showOTP && memberData) {
    return (
      <OTPVerification
        phoneNumber={memberData.phone}
        purpose="login"
        onVerified={handleOTPVerified}
        onCancel={() => {
          setShowOTP(false);
          setMemberData(null);
        }}
      />
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Secure Member Login
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="identifier">Phone Number or Email</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter phone number or email"
                className="pl-10"
                required
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Verifying...' : 'Continue with OTP'}
            </Button>
            
            <Button type="button" variant="outline" onClick={onBack} className="w-full">
              Back to Login Options
            </Button>
          </div>
        </form>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <Phone className="h-4 w-4" />
            <span>We'll send a verification code to your registered phone number</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OTPMemberLogin;
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { ArrowLeft } from 'lucide-react';

interface OTPPhonePasswordResetProps {
  onBack: () => void;
}

const OTPPhonePasswordReset: React.FC<OTPPhonePasswordResetProps> = ({ onBack }) => {
  const [step, setStep] = useState<'phone' | 'otp' | 'password'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const sendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const trimmedPhone = phone.trim();
    if (!trimmedPhone) {
      setError('Please enter a valid phone number.');
      setLoading(false);
      return;
    }

    try {
      console.log('Sending OTP to phone:', trimmedPhone);

      const { data, error: funcError } = await supabase.functions.invoke('send-otp', {
        body: { phoneNumber: trimmedPhone, purpose: 'password_reset' }
      });

      console.log('Function response:', { data, funcError });

      if (funcError) {
        throw funcError;
      }

      setMessage(data?.message || 'OTP sent to your phone. Please check your messages.');
      setStep('otp');
    } catch (err: any) {
      console.error('Send OTP error:', err);
      setError(err?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTPAndReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { data, error: funcError } = await supabase.functions.invoke('reset-password', {
        body: { phone: phone.trim(), otp, newPassword }
      });

      if (funcError) {
        throw funcError;
      }

      setMessage('Password reset successfully! You can now log in with your new password.');
      setTimeout(() => onBack(), 2000);
    } catch (err: any) {
      console.error('Reset password error:', err);
      setError(err?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              {step === 'phone' && 'Enter your phone number to receive OTP'}
              {step === 'otp' && 'Enter the OTP sent to your phone'}
              {step === 'password' && 'Enter your new password'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {step === 'phone' && (
          <form onSubmit={sendOTP} className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+251912345678"
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Sending...' : 'Send OTP'}
            </Button>
          </form>
        )}

        {step === 'otp' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep('password');
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="otp">Enter OTP</Label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                required
              />
            </div>
            <Button type="submit" disabled={!otp || otp.length !== 6} className="w-full">
              Verify OTP
            </Button>
          </form>
        )}

        {step === 'password' && (
          <form onSubmit={verifyOTPAndReset} className="space-y-4">
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        )}

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {message && (
          <Alert className="mt-4">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default OTPPhonePasswordReset;

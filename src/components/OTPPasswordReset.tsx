import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { ArrowLeft } from 'lucide-react';

interface OTPPasswordResetProps {
  onBack: () => void;
}

const OTPPasswordReset: React.FC<OTPPasswordResetProps> = ({ onBack }) => {
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [email, setEmail] = useState('');
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

    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { email }
      });

      if (error) throw error;

      setMessage('OTP sent to your email. Please check your inbox.');
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTPAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.functions.invoke('reset-password', {
        body: { email, otp, newPassword }
      });

      if (error) throw error;

      setMessage('Password reset successfully! You can now login with your new password.');
      setTimeout(() => onBack(), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
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
              {step === 'email' && 'Enter your email to receive OTP'}
              {step === 'otp' && 'Enter the OTP sent to your email'}
              {step === 'password' && 'Enter your new password'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {step === 'email' && (
          <form onSubmit={sendOTP} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Sending...' : 'Send OTP'}
            </Button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={() => setStep('password')} className="space-y-4">
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

export default OTPPasswordReset;
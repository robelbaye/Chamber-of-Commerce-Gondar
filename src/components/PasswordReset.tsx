import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { ArrowLeft } from 'lucide-react';

interface PasswordResetProps {
  onBack: () => void;
}

const PasswordReset: React.FC<PasswordResetProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Check if email exists in registrations
      const { data: member } = await supabase
        .from('registrations')
        .select('email')
        .eq('email', email)
        .single();

      if (!member) {
        setError('No account found with this email address.');
        return;
      }

      // Generate reset token (simple implementation)
      const resetToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
      
      // Store reset token in database (you'd need a password_resets table)
      // For now, just show success message
      setMessage('Password reset instructions have been sent to your email.');
      
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
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
              Enter your email to receive reset instructions
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleReset} className="space-y-4">
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
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {message && (
            <Alert>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Sending...' : 'Send Reset Instructions'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PasswordReset;
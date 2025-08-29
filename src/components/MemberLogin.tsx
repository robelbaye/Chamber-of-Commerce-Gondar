import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import OTPPhonePasswordReset from './OTPPhonePasswordReset';
import OTPMemberLogin from './OTPMemberLogin';
interface MemberLoginProps {
  onLogin: (memberData: any) => void;
}

const MemberLogin: React.FC<MemberLoginProps> = ({ onLogin }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showOTPLogin, setShowOTPLogin] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const isEmail = identifier.includes('@');
      let query = supabase.from('registrations').select('*');
      
      if (isEmail) {
        query = query.eq('email', identifier);
      } else {
        query = query.eq('username', identifier);
      }

      const { data, error } = await query.single();

      if (error || !data) {
        setError('Invalid credentials. Please check your email/username and password.');
        return;
      }

      // Simple password comparison - in production use proper hashing
      const hashedPassword = btoa(password);
      if (data.password !== hashedPassword) {
        setError('Invalid credentials. Please check your email/username and password.');
        return;
      }

      onLogin(data);
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showPasswordReset) {
    return <OTPPhonePasswordReset onBack={() => setShowPasswordReset(false)} />;
  }

  if (showOTPLogin) {
    return <OTPMemberLogin onLogin={onLogin} onBack={() => setShowOTPLogin(false)} />;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Member Login</CardTitle>
        <CardDescription>
          Enter your email/username and password to access your dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="identifier">Email or Username</Label>
            <Input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter email or username"
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="flex flex-col space-y-3">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Logging in...' : 'Login'}
            </Button>
            
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setShowOTPLogin(true)}
              className="w-full flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Secure Login with OTP
            </Button>
            
            <Button 
              type="button" 
              variant="link" 
              onClick={() => setShowPasswordReset(true)}
              className="text-sm text-muted-foreground"
            >
              Forgot your password?
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            <Link to="/register" className="w-full">
              <Button variant="outline" className="w-full">
                Become a Member
              </Button>
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MemberLogin;
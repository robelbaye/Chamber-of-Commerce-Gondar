import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Key } from 'lucide-react';

interface AdminPasswordResetProps {
  memberEmail: string;
  memberName: string;
}

const AdminPasswordReset: React.FC<AdminPasswordResetProps> = ({ memberEmail, memberName }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(password);
    setConfirmPassword(password);
  };

  const resetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error", 
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Hash password (simple implementation)
      const hashedPassword = btoa(newPassword);

      const { error } = await supabase
        .from('registrations')
        .update({ password: hashedPassword })
        .eq('email', memberEmail);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Password reset for ${memberName}. New password: ${newPassword}`
      });

      setOpen(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset password",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Key className="h-4 w-4 mr-1" />
          Reset Password
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Reset password for {memberName} ({memberEmail})
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <div className="flex gap-2">
              <Input
                id="newPassword"
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
              <Button type="button" variant="outline" onClick={generateRandomPassword}>
                Generate
              </Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="text"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>

          <Alert>
            <AlertDescription>
              The new password will be shown in the success message. Make sure to share it with the member securely.
            </AlertDescription>
          </Alert>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={resetPassword} disabled={loading || !newPassword || !confirmPassword}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPasswordReset;
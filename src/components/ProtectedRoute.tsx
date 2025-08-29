import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLogin from '@/components/AdminLogin';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
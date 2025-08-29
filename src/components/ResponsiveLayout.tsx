import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import AppLayout from './AppLayout';
import MobileLayout from './MobileLayout';

const ResponsiveLayout: React.FC = () => {
  const isMobile = useIsMobile();

  // Show loading state while determining device type
  if (isMobile === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isMobile ? <MobileLayout /> : <AppLayout />;
};

export default ResponsiveLayout;
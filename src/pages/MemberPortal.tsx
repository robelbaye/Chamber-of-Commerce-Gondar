import React, { useState } from 'react';
import MemberLogin from '@/components/MemberLogin';
import MemberDashboard from '@/components/MemberDashboard';

const MemberPortal: React.FC = () => {
  const [memberData, setMemberData] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (data: any) => {
    setMemberData(data);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setMemberData(null);
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {!isLoggedIn ? (
          <div className="text-center space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Member Portal</h1>
              <p className="mt-2 text-gray-600">
                Check your registration status and view messages from admin
              </p>
            </div>
            <MemberLogin onLogin={handleLogin} />
          </div>
        ) : (
          <MemberDashboard memberData={memberData} onLogout={handleLogout} />
        )}
      </div>
    </div>
  );
};

export default MemberPortal;
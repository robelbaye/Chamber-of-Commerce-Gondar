import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Home, Info, Calendar, Users, Settings, LogOut } from 'lucide-react';

const MobileNav = () => {
  const { user, logout } = useAuth();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50 md:hidden">
      <div className="flex justify-around items-center">
        <Link to="/" className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600">
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link to="/about" className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600">
          <Info className="h-5 w-5" />
          <span className="text-xs mt-1">About</span>
        </Link>
        
        <Link to="/events" className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600">
          <Calendar className="h-5 w-5" />
          <span className="text-xs mt-1">Events</span>
        </Link>
        
        <Link to="/register" className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600">
          <Users className="h-5 w-5" />
          <span className="text-xs mt-1">Join</span>
        </Link>
        
        {user ? (
          <button onClick={logout} className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600">
            <LogOut className="h-5 w-5" />
            <span className="text-xs mt-1">Logout</span>
          </button>
        ) : (
          <Link to="/admin" className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600">
            <Settings className="h-5 w-5" />
            <span className="text-xs mt-1">Admin</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default MobileNav;
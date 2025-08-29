import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, Search, Bell } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const MobileHeader = () => {
  const { user } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 md:hidden">
      <div className="flex items-center justify-between">
          <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
            <img src="/placeholder.svg" alt="Logo" className="h-14 w-auto" />
            <span className="text-xl font-bold text-blue-600">GCCCSA</span>
          </Link>

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 text-gray-600 hover:text-blue-600"
          >
            <Search className="h-5 w-5" />
          </button>
          
          {user && (
            <button className="p-2 text-gray-600 hover:text-blue-600">
              <Bell className="h-5 w-5" />
            </button>
          )}
          
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 text-gray-600 hover:text-blue-600">
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="py-6">
                <nav className="space-y-4">
                  <Link to="/services" className="block py-2 text-gray-700 hover:text-blue-600">
                    Services
                  </Link>
                  <Link to="/news" className="block py-2 text-gray-700 hover:text-blue-600">
                    News
                  </Link>
                  <Link to="/gallery" className="block py-2 text-gray-700 hover:text-blue-600">
                    Gallery
                  </Link>
                  <Link to="/contact" className="block py-2 text-gray-700 hover:text-blue-600">
                    Contact
                  </Link>
                  <Link to="/history" className="block py-2 text-gray-700 hover:text-blue-600">
                    History
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {isSearchOpen && (
        <div className="mt-3">
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </header>
  );
};

export default MobileHeader;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, ChevronDown, LogOut } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [membershipOpen, setMembershipOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleMembershipEnter = () => setMembershipOpen(true);
  const handleMembershipLeave = () => {
    setTimeout(() => setMembershipOpen(false), 200);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
                <img src="/placeholder.svg" alt="Logo" className="h-14 w-auto" />
                <span className="text-xl font-bold text-blue-600">GCCCSA</span>
              </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            <Link to="/" className="text-gray-700 hover:text-blue-600 px-2 py-2 text-sm font-medium">Home</Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 px-2 py-2 text-sm font-medium">About</Link>
            
            {/* Membership Dropdown */}
            <div className="relative" onMouseEnter={handleMembershipEnter} onMouseLeave={handleMembershipLeave}>
              <button className="text-gray-700 hover:text-blue-600 px-2 py-2 text-sm font-medium flex items-center">
                Membership <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {membershipOpen && (
                <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                  <Link to="/our-members" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Our Members</Link>
                  <Link to="/business-info" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Business Information</Link>
                  <Link to="/member-portal" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Member Portal</Link>
                </div>
              )}
            </div>
            
            <Link to="/services" className="text-gray-700 hover:text-blue-600 px-2 py-2 text-sm font-medium">Services</Link>
            <Link to="/events" className="text-gray-700 hover:text-blue-600 px-2 py-2 text-sm font-medium">Events</Link>
            <Link to="/news" className="text-gray-700 hover:text-blue-600 px-2 py-2 text-sm font-medium">News</Link>
            <Link to="/gallery" className="text-gray-700 hover:text-blue-600 px-2 py-2 text-sm font-medium">Gallery</Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 px-2 py-2 text-sm font-medium">Contact</Link>
            
            {user ? (
              <>
                <Link to="/admin" className="text-gray-700 hover:text-blue-600 px-2 py-2 text-sm font-medium">Admin</Link>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/admin" className="text-gray-700 hover:text-blue-600 px-2 py-2 text-sm font-medium">Admin Login</Link>
            )}
            
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link to="/register">Join Now</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 hover:text-blue-600">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <Link to="/" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">Home</Link>
            <Link to="/about" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">About</Link>
            <Link to="/our-members" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">Our Members</Link>
            <Link to="/member-portal" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">Member Portal</Link>
            <Link to="/services" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">Services</Link>
            <Link to="/events" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">Events</Link>
            <Link to="/news" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">News</Link>
            <Link to="/gallery" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">Gallery</Link>
            <Link to="/contact" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">Contact</Link>
            
            {user ? (
              <>
                <Link to="/admin" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">Admin</Link>
                <button onClick={logout} className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/admin" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">Admin Login</Link>
            )}
            
            <div className="px-3 py-2">
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link to="/register">Join Now</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
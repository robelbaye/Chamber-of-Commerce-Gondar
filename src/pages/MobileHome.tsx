import React from 'react';
import { Link } from 'react-router-dom';
import MobileCard from '@/components/MobileCard';
import { Calendar, Users, FileText, Phone, Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MobileHome: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Chamber of Commerce</h1>
        <p className="text-blue-100 mb-4">Supporting local businesses and economic growth</p>
        <Button asChild variant="secondary" size="sm">
          <Link to="/register">Join Today</Link>
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Quick Actions</h2>
        
        <MobileCard
          title="Upcoming Events"
          description="View and register for chamber events"
          icon={<Calendar className="h-6 w-6" />}
          onClick={() => window.location.href = '/events'}
          action="View Events"
        />
        
        <MobileCard
          title="Member Directory"
          description="Connect with other chamber members"
          icon={<Users className="h-6 w-6" />}
          onClick={() => window.location.href = '/our-members'}
          action="Browse Members"
        />
        
        <MobileCard
          title="Business Resources"
          description="Access guides and tools for your business"
          icon={<FileText className="h-6 w-6" />}
          onClick={() => window.location.href = '/services'}
          action="View Resources"
        />
        
        <MobileCard
          title="Contact Support"
          description="Get help from our team"
          icon={<Phone className="h-6 w-6" />}
          onClick={() => window.location.href = '/contact'}
          action="Contact Us"
        />
      </div>

      {/* Stats */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-3">Chamber Impact</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="h-5 w-5 text-blue-600 mr-1" />
              <span className="text-2xl font-bold text-blue-600">500+</span>
            </div>
            <p className="text-sm text-gray-600">Members</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-5 w-5 text-green-600 mr-1" />
              <span className="text-2xl font-bold text-green-600">25%</span>
            </div>
            <p className="text-sm text-gray-600">Growth</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileHome;
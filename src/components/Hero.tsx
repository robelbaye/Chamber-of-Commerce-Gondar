import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Building, TrendingUp } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Empowering Business Growth
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Join our thriving community of businesses and unlock opportunities for growth, networking, and success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link to="/register">
                Join Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Link to="/about">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <Users className="h-12 w-12 mx-auto mb-4" />
            <div className="text-3xl font-bold">500+</div>
            <div className="text-lg">Active Members</div>
          </div>
          <div className="text-center">
            <Building className="h-12 w-12 mx-auto mb-4" />
            <div className="text-3xl font-bold">50+</div>
            <div className="text-lg">Industry Sectors</div>
          </div>
          <div className="text-center">
            <TrendingUp className="h-12 w-12 mx-auto mb-4" />
            <div className="text-3xl font-bold">25+</div>
            <div className="text-lg">Years of Excellence</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
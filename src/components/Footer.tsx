import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Clock, Facebook, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-3">Chamber of Commerce Gondar</h3>
            <p className="text-gray-300 text-sm">
              Empowering businesses through advocacy, networking, and comprehensive support services.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-md font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-1 text-sm">
              <li><Link to="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-white">Services</Link></li>
              <li><Link to="/events" className="text-gray-300 hover:text-white">Events</Link></li>
              <li><Link to="/register" className="text-gray-300 hover:text-white">Join Now</Link></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-md font-semibold mb-3">Contact Info</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-gray-300">+251 XXX XXX XXX</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-gray-300">info@gondarchamber.et</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-gray-300">Mon–Fri | 8:30 AM – 5:00 PM</span>
              </div>
              <div className="flex items-center space-x-3 mt-3">
                <span className="text-gray-300 text-sm">Follow Us:</span>
                <Facebook className="h-4 w-4 text-gray-400 hover:text-white cursor-pointer" />
                <Linkedin className="h-4 w-4 text-gray-400 hover:text-white cursor-pointer" />
                <Twitter className="h-4 w-4 text-gray-400 hover:text-white cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-6 pt-4 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Chamber of Commerce Gondar. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm">
            By Robel Baye
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
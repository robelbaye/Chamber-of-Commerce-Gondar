import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MobileHeader from './MobileHeader';
import MobileNav from './MobileNav';
import ProtectedRoute from './ProtectedRoute';
import MobileHome from '../pages/MobileHome';
import About from '../pages/About';
import Services from '../pages/Services';
import Events from '../pages/Events';
import Registration from '../pages/Registration';
import Admin from '../pages/Admin';
import OurMembers from '../pages/OurMembers';
import MemberPortal from '../pages/MemberPortal';

const MobileLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col md:hidden">
      <MobileHeader />
      
      <main className="flex-1 pb-16 overflow-y-auto">
        <Routes>
          <Route path="/" element={
            <div className="px-4 py-6">
              <MobileHome />
            </div>
          } />
          
          <Route path="/about" element={
            <div className="px-4 py-6">
              <About />
            </div>
          } />
          
          <Route path="/services" element={
            <div className="px-4 py-6">
              <Services />
            </div>
          } />
          
          <Route path="/events" element={
            <div className="px-4 py-6">
              <Events />
            </div>
          } />
          
          <Route path="/our-members" element={
            <div className="px-4 py-6">
              <OurMembers />
            </div>
          } />
          
          <Route path="/register" element={
            <div className="px-4 py-6">
              <Registration />
            </div>
          } />
          
          <Route path="/member-portal" element={
            <div className="px-4 py-6">
              <MemberPortal />
            </div>
          } />
          
          <Route path="/admin" element={
            <ProtectedRoute>
              <div className="px-4 py-6">
                <Admin />
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/contact" element={
            <div className="px-4 py-6">
              <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">Phone</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">Email</h3>
                  <p className="text-gray-600">info@chamber.com</p>
                </div>
              </div>
            </div>
          } />
          
          <Route path="*" element={
            <div className="px-4 py-6 text-center">
              <h1 className="text-xl font-bold mb-2">Coming Soon</h1>
              <p className="text-gray-600">This page is under development.</p>
            </div>
          } />
        </Routes>
      </main>
      
      <MobileNav />
    </div>
  );
};

export default MobileLayout;
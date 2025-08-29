import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Hero from './Hero';
import Footer from './Footer';
import ProtectedRoute from './ProtectedRoute';
import ContactForm from './ContactForm';
import Home from '../pages/Home';
import About from '../pages/About';
import Services from '../pages/Services';
import Events from '../pages/Events';
import Registration from '../pages/Registration';
import Admin from '../pages/Admin';
import News from '../pages/News';
import Gallery from '../pages/Gallery';
import MemberPortal from '../pages/MemberPortal';
import OurMembers from '../pages/OurMembers';
import BusinessInfo from '../pages/BusinessInfo';

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <div className="py-16">
                <Home />
              </div>
            </>
          } />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/events" element={<Events />} />
          <Route path="/our-members" element={<OurMembers />} />
          <Route path="/business-info" element={<BusinessInfo />} />
          <Route path="/register" element={
            <div className="py-16">
              <Registration />
            </div>
          } />
          <Route path="/member-portal" element={<MemberPortal />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <Admin />
              </div>
            </ProtectedRoute>
          } />
          <Route path="/news" element={<News />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Office Address:</h2>
                    <p className="text-gray-600 leading-relaxed">Gondar City Chamber of Commerce & Sectoral Association<br />Central Business District, Gondar, Ethiopia</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Phone:</h3>
                    <p className="text-gray-600">+251 XXX XXX XXX</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Email:</h3>
                    <p className="text-gray-600">info@gondarchamber.et</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Office Hours:</h3>
                    <p className="text-gray-600">Mon–Fri | 8:30 AM – 5:00 PM</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Follow Us:</h3>
                    <div className="flex space-x-4">
                      <a href="#" className="text-blue-600 hover:text-blue-800">Facebook</a>
                      <span className="text-gray-400">|</span>
                      <a href="#" className="text-blue-600 hover:text-blue-800">LinkedIn</a>
                      <span className="text-gray-400">|</span>
                      <a href="#" className="text-blue-600 hover:text-blue-800">Twitter</a>
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Send us a Message</h2>
                  <ContactForm />
                </div>
              </div>
            </div>
          } />
          <Route path="*" element={
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
              <h1 className="text-4xl font-bold mb-4">Page Coming Soon</h1>
              <p className="text-gray-600">This page is under development.</p>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
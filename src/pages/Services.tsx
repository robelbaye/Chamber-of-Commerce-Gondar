import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Handshake, Users, GraduationCap, TrendingUp, FileText, Globe, Phone, Award, Scale, Building, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

const iconMap: { [key: string]: React.ComponentType<any> } = {
  Building,
  Users,
  Scale,
  Globe,
  GraduationCap,
  FileText,
  Handshake,
  TrendingUp,
  Calendar,
  Award
};

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) throw error;
        setServices(data || []);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const testimonials = [
    {
      name: 'Jennifer Wilson',
      company: 'Tech Solutions Inc.',
      quote: 'The Chamber\'s networking events helped us connect with key partners that transformed our business.'
    },
    {
      name: 'Robert Chen',
      company: 'Global Manufacturing',
      quote: 'Their trade facilitation services opened doors to international markets we never thought possible.'
    },
    {
      name: 'Maria Rodriguez',
      company: 'Local Retail Group',
      quote: 'The advocacy work they do has directly benefited our industry and saved us thousands in compliance costs.'
    }
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">Loading services...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Services</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Comprehensive business support services designed to help your organization thrive in today's competitive marketplace.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {services.map((service) => {
          const IconComponent = iconMap[service.icon] || Building;
          return (
            <Card key={service.id} className="hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <IconComponent className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="bg-blue-600 text-white rounded-lg p-8 mb-16">
        <div className="text-center">
          <Phone className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Need Personalized Support?</h2>
          <p className="text-xl mb-6">
            Our team of business experts is ready to help you find the right solutions for your specific needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Schedule Consultation
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Contact Us
            </Button>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-8">What Our Members Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <Award className="h-8 w-8 text-yellow-500 mb-2" />
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.company}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
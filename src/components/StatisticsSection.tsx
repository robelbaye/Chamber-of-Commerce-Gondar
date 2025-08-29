import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Building2, Calendar, Award } from 'lucide-react';

const StatisticsSection = () => {
  const stats = [
    {
      icon: Users,
      number: '500+',
      label: 'Active Members',
      description: 'Growing business community'
    },
    {
      icon: Building2,
      number: '150+',
      label: 'Partner Companies',
      description: 'Trusted business network'
    },
    {
      icon: Calendar,
      number: '50+',
      label: 'Annual Events',
      description: 'Networking opportunities'
    },
    {
      icon: Award,
      number: '10+',
      label: 'Years of Excellence',
      description: 'Serving the business community'
    }
  ];

  return (
    <section className="bg-blue-600 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Our Impact in Numbers
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            See how we're making a difference in the business community
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-colors">
                <CardContent className="p-6 text-center">
                  <IconComponent className="h-12 w-12 mx-auto mb-4 text-blue-200" />
                  <div className="text-3xl font-bold mb-2">{stat.number}</div>
                  <div className="text-lg font-semibold mb-1">{stat.label}</div>
                  <div className="text-sm text-blue-200">{stat.description}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
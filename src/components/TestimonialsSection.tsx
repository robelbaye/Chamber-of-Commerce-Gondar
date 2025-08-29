import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      company: 'Tech Solutions Inc.',
      content: 'Joining this chamber has been transformative for our business. The networking opportunities and support have been invaluable.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      company: 'Green Energy Co.',
      content: 'The advocacy work and business resources provided have helped us navigate challenges and grow our market presence.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      company: 'Local Retail Group',
      content: 'The connections I\'ve made through chamber events have led to several successful partnerships and collaborations.',
      rating: 5
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Members Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hear from business leaders who have experienced the benefits of membership
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-blue-600 mb-4" />
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                
                <div className="flex items-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.company}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
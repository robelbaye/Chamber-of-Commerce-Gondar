import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Award, Building, Globe, CheckCircle, Download, FileText, CreditCard } from 'lucide-react';

const OurMembers: React.FC = () => {
  const memberStats = [
    { icon: Users, label: 'Total Members', value: '500+' },
    { icon: Building, label: 'Local Businesses', value: '350+' },
    { icon: Globe, label: 'International Partners', value: '50+' },
    { icon: Award, label: 'Years of Service', value: '25+' }
  ];

  const whyJoinBenefits = [
    { icon: CheckCircle, text: 'Influence policy decisions' },
    { icon: CheckCircle, text: 'Access exclusive business resources' },
    { icon: CheckCircle, text: 'Expand your network' },
    { icon: CheckCircle, text: 'Get listed in our Business Directory' }
  ];

  const membershipCategories = [
    { title: 'Individual Entrepreneurs', description: 'For solo business owners and freelancers' },
    { title: 'SMEs', description: 'Small and Medium Enterprises' },
    { title: 'Corporations', description: 'Large enterprises and corporations' },
    { title: 'Sectoral Associations', description: 'Industry and trade associations' }
  ];

  const joinSteps = [
    { icon: Download, title: 'Download Membership Form (PDF)', description: 'Get the official membership application form' },
    { icon: FileText, title: 'Fill and submit online or in person', description: 'Complete the form with your business details' },
    { icon: CreditCard, title: 'Pay the annual fee based on category', description: 'Submit payment according to your membership type' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Membership</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Join our thriving community of businesses and organizations committed to economic growth and community development.
        </p>
      </div>

      {/* Member Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {memberStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <Icon className="h-8 w-8 mx-auto mb-4 text-blue-600" />
                <div className="text-2xl font-bold mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Why Join Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Why Join?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {whyJoinBenefits.map((benefit, index) => (
            <div key={index} className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
              <span className="text-lg">{benefit.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Membership Categories */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Membership Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {membershipCategories.map((category, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{category.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* How to Join */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">How to Join</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {joinSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <Icon className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Member Login Section */}
      <div className="bg-blue-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Join?</h2>
        <p className="text-gray-600 mb-6">
          Start your membership journey today and become part of Gonder's leading business community.
        </p>
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Link to="/register">
            <Button size="lg" className="w-full sm:w-auto">
              Become a Member
            </Button>
          </Link>
          <Link to="/member-portal">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Member Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OurMembers;
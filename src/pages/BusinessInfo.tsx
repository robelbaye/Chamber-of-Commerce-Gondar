import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const BusinessInfo = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Business Information & Resources</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Essential information and resources for businesses in Gondar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Business Registration
              <Badge variant="secondary">Required</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Complete guide to registering your business in Gondar region.
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Required documents</li>
              <li>• Registration process</li>
              <li>• Fees and timelines</li>
              <li>• Legal requirements</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tax Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Understanding tax obligations and benefits for businesses.
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• VAT registration</li>
              <li>• Income tax rates</li>
              <li>• Tax incentives</li>
              <li>• Filing procedures</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Licensing & Permits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Information on various business licenses and permits required.
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Trade licenses</li>
              <li>• Sector-specific permits</li>
              <li>• Environmental clearances</li>
              <li>• Import/export licenses</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Investment Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Explore investment opportunities in Gondar's growing economy.
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Priority sectors</li>
              <li>• Investment incentives</li>
              <li>• Industrial parks</li>
              <li>• Partnership opportunities</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Market insights and business intelligence for informed decisions.
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Market research</li>
              <li>• Industry trends</li>
              <li>• Consumer behavior</li>
              <li>• Competitive analysis</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Support Services</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Business support services available through the Chamber.
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Business counseling</li>
              <li>• Training programs</li>
              <li>• Networking events</li>
              <li>• Advocacy services</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Need More Information?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Contact our business development team for personalized assistance.
            </p>
            <div className="space-y-2 text-sm">
              <p><strong>Phone:</strong> +251 XXX XXX XXX</p>
              <p><strong>Email:</strong> business@gondarchamber.et</p>
              <p><strong>Office Hours:</strong> Mon-Fri, 8:30 AM - 5:00 PM</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessInfo;
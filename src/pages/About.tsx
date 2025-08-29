import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Target, Eye, CheckCircle, History, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About GCCCSA</h1>
        <p className="text-2xl text-blue-600 font-semibold mb-4">Empowering Business, Driving Growth</p>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
          The Gonder City Chamber of Commerce and Sectoral Associations (GCCCSA) is a leading business membership organization dedicated to promoting trade, investment, and economic development in Gonder. As a bridge between the private sector, government, and development partners, we work to create a vibrant and inclusive business environment where enterprises of all sizes can thrive.
        </p>
      </div>

      {/* History Section */}
      <div className="mb-16">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <History className="h-8 w-8 text-blue-600" />
              <CardTitle className="text-3xl">Our History</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <p>
              The roots of Ethiopia's Chamber movement go back to 1943, when the first Chamber of Commerce was introduced to support the country's recovery from the economic crisis caused by the Italian occupation. Its early role focused on managing the distribution of scarce commodities like cotton, yarn, and wool, ensuring stability in a distressed market.
            </p>
            <p>
              Recognizing its success, the government granted the Chamber legal recognition through Charter No. 90/47 in 1947, and made membership mandatory. This marked the beginning of a strong institutional presence for the private sector in national economic development.
            </p>
            <p>
              The Gonder Chamber was officially established in 1956 E.C. (1963/64 G.C.) under the name Chamber of Trade, Industry, and Agriculture. Since then, it has evolved alongside Ethiopia's political and economic landscape:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Under the Dergue regime, the Chamber was restructured under a centralized economic system by Proclamation No. 148/1974, continuing its service as a mandatory-membership body.</li>
              <li>With the shift to a free-market economy, the current government revitalized and redefined the Chamber's mission through Proclamation No. 341/2003, emphasizing voluntary membership, sectoral representation, and private-sector leadership.</li>
            </ul>
            <p className="font-semibold text-blue-600">
              Today, we are proud to serve the community as the Gonder City Chamber of Commerce and Sectoral Associations (GCCCSA).
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Mission, Vision, What We Do */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardHeader>
            <Target className="h-12 w-12 mx-auto text-blue-600 mb-4" />
            <CardTitle className="text-2xl">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base text-gray-700">
              To promote and support a competitive, responsible, and innovative private sector that contributes to the sustainable economic development of Gonder City and the surrounding region.
            </CardDescription>
          </CardContent>
        </Card>
        
        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardHeader>
            <Eye className="h-12 w-12 mx-auto text-blue-600 mb-4" />
            <CardTitle className="text-2xl">Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base text-gray-700">
              To be a leading voice of the private sector in Gonder — driving inclusive growth, investment, and prosperity through innovation, collaboration, and sustainable business practices.
            </CardDescription>
          </CardContent>
        </Card>
        
        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardHeader>
            <Building2 className="h-12 w-12 mx-auto text-blue-600 mb-4" />
            <CardTitle className="text-2xl">What We Do</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-left">
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Advocate for pro-business policies and regulations</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Facilitate dialogue between businesses and government</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Support entrepreneurs through training, advisory services, and market access</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Connect members with local and international partners</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Promote investment and sectoral development opportunities</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
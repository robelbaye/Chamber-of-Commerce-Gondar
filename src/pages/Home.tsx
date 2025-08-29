import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, Newspaper, ArrowRight, Handshake, Users, Award, ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import GallerySlider from '@/components/GallerySlider';
import StatisticsSection from '@/components/StatisticsSection';
import TestimonialsSection from '@/components/TestimonialsSection';

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  created_at: string;
}

interface EventItem {
  id: number;
  title: string;
  event_date: string;
  location: string;
}

const Home = () => {
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch latest 3 news items
        const { data: newsData } = await supabase
          .from('news')
          .select('id, title, excerpt, created_at')
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(3);

        // Fetch upcoming 3 events
        const { data: eventsData } = await supabase
          .from('events')
          .select('id, title, event_date, location')
          .gte('event_date', new Date().toISOString())
          .order('event_date', { ascending: true })
          .limit(3);

        setLatestNews(newsData || []);
        setUpcomingEvents(eventsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-16">
      {/* Introduction Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Gateway to Business Success
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We connect, support, and advocate for businesses of all sizes, creating opportunities 
              for growth and collaboration in our thriving business community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Handshake className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                <CardTitle>Business Advocacy</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  We represent your interests at local, regional, and national levels, 
                  ensuring your voice is heard in policy decisions.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                <CardTitle>Networking Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Connect with like-minded professionals, potential partners, 
                  and industry leaders through our exclusive events and programs.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Award className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                <CardTitle>Business Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Access resources, training, and expert guidance to help your 
                  business thrive in today's competitive marketplace.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center justify-center">
            <ImageIcon className="h-6 w-6 mr-2 text-blue-600" />
            Featured Gallery
          </h3>
          <p className="text-gray-600 mt-2">Explore moments from our events and community activities</p>
        </div>
        <GallerySlider />
        <div className="text-center mt-6">
          <Button asChild variant="outline">
            <Link to="/gallery">View Full Gallery <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      {/* Statistics Section */}
      <StatisticsSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Latest News & Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Latest News */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <Newspaper className="h-6 w-6 mr-2 text-blue-600" />
                Latest News
              </h3>
              <Button asChild variant="outline">
                <Link to="/news">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : latestNews.length > 0 ? (
                latestNews.map((article) => (
                  <Card key={article.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{article.title}</CardTitle>
                      <CardDescription className="text-sm text-gray-500">
                        {formatDate(article.created_at)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-3">{article.excerpt}</p>
                      <Button asChild variant="link" className="p-0 h-auto">
                        <Link to={`/news/${article.id}`}>Read More <ArrowRight className="ml-1 h-3 w-3" /></Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">No news available</div>
              )}
            </div>
          </div>
          
          {/* Upcoming Events */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <Calendar className="h-6 w-6 mr-2 text-blue-600" />
                Upcoming Events
              </h3>
              <Button asChild variant="outline">
                <Link to="/events">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <Card key={event.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <CardDescription className="text-sm text-gray-500">
                        {formatDate(event.event_date)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-3">{event.location}</p>
                      <Button asChild variant="link" className="p-0 h-auto">
                        <Link to={`/events/${event.id}`}>Learn More <ArrowRight className="ml-1 h-3 w-3" /></Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">No upcoming events</div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { Calendar, MapPin, Users } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  category: string;
  status: 'draft' | 'published' | 'cancelled';
  max_attendees?: number;
  created_at: string;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'published')
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Upcoming Events</h1>
        <p className="text-gray-600">Join us for networking, workshops, and business development opportunities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No upcoming events at this time.</p>
          </div>
        ) : (
          events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <Badge variant="secondary">{event.category}</Badge>
                </div>
                <CardDescription className="line-clamp-2">{event.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(event.event_date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.location}
                  </div>
                  {event.max_attendees && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      Max {event.max_attendees} attendees
                    </div>
                  )}
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">View Details</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{event.title}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge>{event.category}</Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(event.event_date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{event.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Date & Time</h4>
                          <p className="text-sm text-gray-600">
                            {new Date(event.event_date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Location</h4>
                          <p className="text-sm text-gray-600">{event.location}</p>
                        </div>
                      </div>
                      {event.max_attendees && (
                        <div>
                          <h4 className="font-semibold mb-2">Capacity</h4>
                          <p className="text-sm text-gray-600">Maximum {event.max_attendees} attendees</p>
                        </div>
                      )}
                      <div className="pt-4">
                        <Button className="w-full">Register for Event</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Events;
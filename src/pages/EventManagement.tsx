import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Plus, Edit, Trash2 } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  category: string;
  status: 'draft' | 'published' | 'cancelled';
  max_attendees?: number;
  image_url?: string;
  created_at: string;
}

const EventForm: React.FC<{event?: Event; onSave: () => void; onCancel: () => void}> = ({ event, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    event_date: event?.event_date || '',
    location: event?.location || '',
    category: event?.category || '',
    status: event?.status || 'draft' as const,
    max_attendees: event?.max_attendees || undefined,
    image_url: event?.image_url || ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const eventData = { ...formData, max_attendees: formData.max_attendees || null };

      if (event) {
        const { error } = await supabase.from('events').update(eventData).eq('id', event.id);
        if (error) throw error;
        toast({ title: "Event updated successfully" });
      } else {
        const { error } = await supabase.from('events').insert([eventData]);
        if (error) throw error;
        toast({ title: "Event created successfully" });
      }
      onSave();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to save event", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{event ? 'Edit Event' : 'Create New Event'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
          <ImageUpload onImageUpload={(url) => setFormData({...formData, image_url: url})} currentImage={formData.image_url} bucket="gallery" />
          <Textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <Input type="datetime-local" value={formData.event_date} onChange={(e) => setFormData({...formData, event_date: e.target.value})} required />
            <Input placeholder="Location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input placeholder="Category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
            <Input type="number" placeholder="Max Attendees" value={formData.max_attendees || ''} onChange={(e) => setFormData({...formData, max_attendees: e.target.value ? parseInt(e.target.value) : undefined})} />
          </div>
          <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Event'}</Button>
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

const EventManagement = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [editingEvent, setEditingEvent] = useState<Event | undefined>();
  const { toast } = useToast();

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase.from('events').select('*').order('event_date', { ascending: false });
      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch events", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Event deleted successfully" });
      fetchEvents();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete event", variant: "destructive" });
    }
  };

  if (loading) return <div className="flex justify-center py-8">Loading...</div>;

  if (view === 'create' || view === 'edit') {
    return <EventForm event={editingEvent} onSave={() => { setView('list'); setEditingEvent(undefined); fetchEvents(); }} onCancel={() => { setView('list'); setEditingEvent(undefined); }} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Event Management</h2>
        <Button onClick={() => setView('create')}><Plus className="h-4 w-4 mr-2" />Create Event</Button>
      </div>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>{event.title}</TableCell>
                  <TableCell>{new Date(event.event_date).toLocaleDateString()}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell><Badge>{event.status}</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => { setEditingEvent(event); setView('edit'); }}><Edit className="h-4 w-4" /></Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(event.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventManagement;
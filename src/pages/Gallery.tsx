import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  created_at: string;
  status: 'draft' | 'published';
}

const Gallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching gallery:', error);
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
        <h1 className="text-4xl font-bold mb-4">Gallery</h1>
        <p className="text-gray-600">Explore our collection of events and activities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No gallery items available yet.</p>
          </div>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 relative overflow-hidden">
                {item.image_url ? (
                  <img 
                    src={item.image_url} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary">{item.category}</Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{item.title}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {item.image_url && (
                          <img 
                            src={item.image_url} 
                            alt={item.title}
                            className="w-full rounded-lg"
                          />
                        )}
                        <p className="text-gray-700">{item.description}</p>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <Badge>{item.category}</Badge>
                          <span>{new Date(item.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Gallery;
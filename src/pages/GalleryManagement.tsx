import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { uploadImage } from '@/lib/storage';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  status: 'draft' | 'published';
  created_at: string;
}

const GalleryForm: React.FC<{item?: GalleryItem; onSave: () => void; onCancel: () => void}> = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: item?.title || '',
    description: item?.description || '',
    category: item?.category || '',
    status: item?.status || 'draft' as const
  });
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(item?.image_url || '');
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File too large", description: "Please select an image smaller than 5MB", variant: "destructive" });
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !item?.image_url) {
      toast({ title: "Image required", description: "Please select an image to upload", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      let imageUrl = item?.image_url || '';
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile, 'gallery');
      }

      const dataToSave = { ...formData, image_url: imageUrl };

      if (item) {
        const { error } = await supabase.from('gallery').update(dataToSave).eq('id', item.id);
        if (error) throw error;
        toast({ title: "Gallery item updated successfully" });
      } else {
        const { error } = await supabase.from('gallery').insert([dataToSave]);
        if (error) throw error;
        toast({ title: "Gallery item created successfully" });
      }
      onSave();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to save gallery item", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{item ? 'Edit Gallery Item' : 'Create New Gallery Item'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
          <Textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          <div>
            <Input type="file" accept="image/*" onChange={handleFileSelect} />
            {previewUrl && <img src={previewUrl} alt="Preview" className="w-32 h-32 object-cover mt-2 rounded" />}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input placeholder="Category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required />
            <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Item'}</Button>
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

const GalleryManagement = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [editingItem, setEditingItem] = useState<GalleryItem | undefined>();
  const { toast } = useToast();

  useEffect(() => { fetchGalleryItems(); }, []);

  const fetchGalleryItems = async () => {
    try {
      const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch gallery items", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this gallery item?')) return;
    try {
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Gallery item deleted successfully" });
      fetchGalleryItems();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete gallery item", variant: "destructive" });
    }
  };

  if (loading) return <div className="flex justify-center py-8">Loading...</div>;

  if (view === 'create' || view === 'edit') {
    return <GalleryForm item={editingItem} onSave={() => { setView('list'); setEditingItem(undefined); fetchGalleryItems(); }} onCancel={() => { setView('list'); setEditingItem(undefined); }} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gallery Management</h2>
        <Button onClick={() => setView('create')}><Plus className="h-4 w-4 mr-2" />Add Gallery Item</Button>
      </div>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <img src={item.image_url} alt={item.title} className="w-16 h-16 object-cover rounded" />
                  </TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell><Badge>{item.status}</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => { setEditingItem(item); setView('edit'); }}><Edit className="h-4 w-4" /></Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
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

export default GalleryManagement;
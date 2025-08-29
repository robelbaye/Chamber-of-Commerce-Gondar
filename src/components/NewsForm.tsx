import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Save, ArrowLeft } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

interface NewsArticle {
  id?: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  status: 'draft' | 'published' | 'archived';
  slug: string;
  tags: string[];
  image_url?: string;
}

interface NewsFormProps {
  article?: NewsArticle;
  onSave: () => void;
  onCancel: () => void;
}

const NewsForm: React.FC<NewsFormProps> = ({ article, onSave, onCancel }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<NewsArticle>({
    title: '',
    content: '',
    excerpt: '',
    author: '',
    status: 'draft',
    slug: '',
    tags: [],
    image_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    if (article) {
      setFormData(article);
      setTagsInput(article.tags.join(', '));
    }
  }, [article]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleTagsChange = (value: string) => {
    setTagsInput(value);
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, image_url: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSave = {
        ...formData,
        updated_at: new Date().toISOString(),
        ...(formData.status === 'published' && !article?.id && {
          published_at: new Date().toISOString()
        })
      };

      if (article?.id) {
        const { error } = await supabase
          .from('news')
          .update(dataToSave)
          .eq('id', article.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('news')
          .insert([dataToSave]);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Article ${article?.id ? 'updated' : 'created'} successfully`
      });
      onSave();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save article",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{article?.id ? 'Edit Article' : 'Create New Article'}</CardTitle>
          <Button variant="outline" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                required
              />
            </div>
          </div>

          <ImageUpload
            onImageUpload={handleImageUpload}
            currentImage={formData.image_url}
            label="Featured Image"
            bucket="gallery"
          />

          <div>
            <Label htmlFor="slug">URL Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={8}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={tagsInput}
                onChange={(e) => handleTagsChange(e.target.value)}
                placeholder="business, events, community"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : 'Save Article'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewsForm;
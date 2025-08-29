import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Edit, Trash2, Plus, Eye } from 'lucide-react';

interface NewsArticle {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  status: 'draft' | 'published' | 'archived';
  slug: string;
  tags: string[];
  published_at?: string;
}

interface NewsListProps {
  onEdit: (article: NewsArticle) => void;
  onNew: () => void;
  refresh: boolean;
}

const NewsList: React.FC<NewsListProps> = ({ onEdit, onNew, refresh }) => {
  const { toast } = useToast();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0, archived: 0 });

  useEffect(() => {
    fetchArticles();
  }, [refresh]);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      setArticles(data || []);
      
      const total = data?.length || 0;
      const published = data?.filter(a => a.status === 'published').length || 0;
      const draft = data?.filter(a => a.status === 'draft').length || 0;
      const archived = data?.filter(a => a.status === 'archived').length || 0;
      
      setStats({ total, published, draft, archived });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch articles",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Article deleted successfully"
      });
      fetchArticles();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete article",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: 'secondary',
      published: 'default',
      archived: 'outline'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading articles...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.published}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draft}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Archived</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.archived}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>News Articles</CardTitle>
            </div>
            <Button onClick={onNew}>
              <Plus className="h-4 w-4 mr-2" />
              New Article
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{article.title}</div>
                      {article.excerpt && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {article.excerpt}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{article.author}</TableCell>
                  <TableCell>{getStatusBadge(article.status)}</TableCell>
                  <TableCell>{new Date(article.updated_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(article)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteArticle(article.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {articles.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No articles found. Create your first article!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsList;
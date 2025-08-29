import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { Search, Calendar, User, Tag } from 'lucide-react';

interface NewsArticle {
  id: string;
  created_at: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  slug: string;
  tags: string[];
  published_at: string;
}

const News = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  useEffect(() => {
    fetchPublishedArticles();
  }, []);

  const fetchPublishedArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="text-lg">Loading news...</div>
        </div>
      </div>
    );
  }

  if (selectedArticle) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button 
          variant="outline" 
          onClick={() => setSelectedArticle(null)}
          className="mb-6"
        >
          ← Back to News
        </Button>
        
        <article className="prose prose-lg max-w-none">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{selectedArticle.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{selectedArticle.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(selectedArticle.published_at)}</span>
              </div>
            </div>
            {selectedArticle.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedArticle.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </header>
          
          <div className="whitespace-pre-wrap leading-relaxed">
            {selectedArticle.content}
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Latest News</h1>
        <p className="text-gray-600 mb-6">
          Stay updated with the latest news and announcements from our chamber.
        </p>
        
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredArticles.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            {searchTerm ? 'No articles found matching your search.' : 'No news articles published yet.'}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(article.published_at)}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.excerpt || article.content.substring(0, 150) + '...'}
                </p>
                
                {article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {article.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{article.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedArticle(article)}
                >
                  Read More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default News;
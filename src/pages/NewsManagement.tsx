import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NewsForm from '@/components/NewsForm';
import NewsList from '@/components/NewsList';
import ProtectedRoute from '@/components/ProtectedRoute';

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  status: 'draft' | 'published' | 'archived';
  slug: string;
  tags: string[];
}

const NewsManagementPage = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [editingArticle, setEditingArticle] = useState<NewsArticle | undefined>();
  const [refreshList, setRefreshList] = useState(false);

  const handleEdit = (article: NewsArticle) => {
    setEditingArticle(article);
    setActiveTab('form');
  };

  const handleNew = () => {
    setEditingArticle(undefined);
    setActiveTab('form');
  };

  const handleSave = () => {
    setActiveTab('list');
    setEditingArticle(undefined);
    setRefreshList(prev => !prev);
  };

  const handleCancel = () => {
    setActiveTab('list');
    setEditingArticle(undefined);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">News Management</h1>
        <p className="text-gray-600">Create, edit, and publish news articles</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">Articles</TabsTrigger>
          <TabsTrigger value="form">
            {editingArticle ? 'Edit Article' : 'New Article'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <NewsList
            onEdit={handleEdit}
            onNew={handleNew}
            refresh={refreshList}
          />
        </TabsContent>

        <TabsContent value="form" className="mt-6">
          <NewsForm
            article={editingArticle}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const NewsManagement = () => {
  return (
    <ProtectedRoute>
      <NewsManagementPage />
    </ProtectedRoute>
  );
};

export default NewsManagement;
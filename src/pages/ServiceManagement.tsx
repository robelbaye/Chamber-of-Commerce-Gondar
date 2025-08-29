import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface Service {
  id?: number;
  title: string;
  description: string;
  icon: string;
  features: string[];
  is_active: boolean;
  display_order: number;
}

const iconOptions = [
  'Building', 'Users', 'Scale', 'Globe', 'GraduationCap', 'FileText', 
  'Handshake', 'TrendingUp', 'Calendar', 'Award'
];

const ServiceManagement = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const emptyService: Service = {
    title: '',
    description: '',
    icon: 'Building',
    features: [''],
    is_active: true,
    display_order: 0
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch services',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (service: Service) => {
    try {
      const serviceData = {
        ...service,
        features: service.features.filter(f => f.trim() !== '')
      };

      if (service.id) {
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', service.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('services')
          .insert([serviceData]);
        if (error) throw error;
      }

      toast({
        title: 'Success',
        description: `Service ${service.id ? 'updated' : 'created'} successfully`
      });

      setEditingService(null);
      setIsCreating(false);
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      toast({
        title: 'Error',
        description: 'Failed to save service',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Service deleted successfully'
      });

      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete service',
        variant: 'destructive'
      });
    }
  };

  const updateFeature = (service: Service, index: number, value: string) => {
    const newFeatures = [...service.features];
    newFeatures[index] = value;
    return { ...service, features: newFeatures };
  };

  const addFeature = (service: Service) => {
    return { ...service, features: [...service.features, ''] };
  };

  const removeFeature = (service: Service, index: number) => {
    const newFeatures = service.features.filter((_, i) => i !== index);
    return { ...service, features: newFeatures };
  };

  const ServiceForm = ({ service, onSave, onCancel }: {
    service: Service;
    onSave: (service: Service) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState(service);

    return (
      <Card>
        <CardHeader>
          <CardTitle>{service.id ? 'Edit Service' : 'Create New Service'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Service title"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Service description"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="icon">Icon</Label>
            <Select
              value={formData.icon}
              onValueChange={(value) => setFormData({ ...formData, icon: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((icon) => (
                  <SelectItem key={icon} value={icon}>
                    {icon}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Features</Label>
            {formData.features.map((feature, index) => (
              <div key={index} className="flex gap-2 mt-2">
                <Input
                  value={feature}
                  onChange={(e) => setFormData(updateFeature(formData, index, e.target.value))}
                  placeholder="Feature description"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData(removeFeature(formData, index))}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setFormData(addFeature(formData))}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Feature
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>

          <div>
            <Label htmlFor="display_order">Display Order</Label>
            <Input
              id="display_order"
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={() => onSave(formData)}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Loading services...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Service Management</h1>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      {isCreating && (
        <ServiceForm
          service={emptyService}
          onSave={handleSave}
          onCancel={() => setIsCreating(false)}
        />
      )}

      {editingService && (
        <ServiceForm
          service={editingService}
          onSave={handleSave}
          onCancel={() => setEditingService(null)}
        />
      )}

      <div className="grid gap-4">
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {service.title}
                    {!service.is_active && (
                      <span className="text-sm bg-gray-200 px-2 py-1 rounded">Inactive</span>
                    )}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingService(service)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => service.id && handleDelete(service.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">
                <p><strong>Icon:</strong> {service.icon}</p>
                <p><strong>Features:</strong> {service.features.join(', ')}</p>
                <p><strong>Order:</strong> {service.display_order}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServiceManagement;
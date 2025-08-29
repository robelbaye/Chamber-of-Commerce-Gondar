import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

interface GalleryImage {
  id: number;
  title: string;
  image_url: string;
  description?: string;
}

const GallerySlider = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data } = await supabase
          .from('gallery')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6);
        
        setImages(data || []);
      } catch (error) {
        console.error('Error fetching gallery images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  if (loading) {
    return (
      <div className="relative h-96 bg-gray-200 rounded-lg animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500">Loading gallery...</div>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="relative h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">No images available</div>
      </div>
    );
  }

  return (
    <div className="relative h-96 rounded-lg overflow-hidden group">
      <div className="relative h-full">
        <img
          src={images[currentIndex]?.image_url}
          alt={images[currentIndex]?.title}
          className="w-full h-full object-cover transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
          <div className="p-6 text-white">
            <h3 className="text-xl font-bold mb-2">{images[currentIndex]?.title}</h3>
            {images[currentIndex]?.description && (
              <p className="text-sm opacity-90">{images[currentIndex].description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={goToNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default GallerySlider;
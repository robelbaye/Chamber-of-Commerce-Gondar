import { supabase } from './supabase';

export const uploadImage = async (file: File, bucket: string = 'gallery'): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `images/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
};

export const deleteImage = async (url: string, bucket: string = 'gallery'): Promise<void> => {
  try {
    const path = url.split('/').slice(-2).join('/');
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    if (error) {
      console.warn('Failed to delete image:', error.message);
    }
  } catch (error) {
    console.warn('Error deleting image:', error);
  }
};
'use client';
import { toastHelper } from '@/components';
import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';

export const useUploadImage = ({
  id,
  onUpload,
}: {
  id?: string;
  onUpload: (imageUrls: string[]) => void;
}) => {
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);

  const uploadImages: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    if (!id) return;
    try {
      setUploading(true);
      const imageUrls: string[] = [];

      if (!event.target.files || event.target.files.length === 0) {
        toastHelper.error('You must select an image to upload.');
        return;
      }

      for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i];
        const fileExt = file.name.split('.').pop();
        const filePath = `${id}/${Date.now()}-${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('restaurants-images')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }
        const {
          data: { publicUrl },
        } = supabase.storage.from('restaurants-images').getPublicUrl(filePath);
        imageUrls.push(publicUrl);
      }
      onUpload(imageUrls);
    } catch (error) {
      toastHelper.error('Error uploading images!');
    } finally {
      setUploading(false);
    }
  };

  return { uploading, imageFiles, setImageFiles, uploadImages };
};

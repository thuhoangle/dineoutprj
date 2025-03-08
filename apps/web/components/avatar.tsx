'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import { toastHelper } from './toast-helper';
import { useUserStore } from '@/stores';

export const Avatar = ({
  url,
  size,
  onUpload,
}: {
  url: string | null;
  size: number;
  onUpload: (url: string) => void;
}) => {
  const authInfo = useUserStore((state) => state.authInfo);
  const supabase = createClient();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(url);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage
          .from('avatars')
          .download(path);
        if (error) {
          throw error;
        }
        const url = URL.createObjectURL(data);
        setAvatarUrl(url);
      } catch (error) {
        console.log('Error downloading image: ', error);
      }
    }

    if (url) downloadImage(url);
  }, [url, supabase]);

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        toastHelper.error('You must select an image to upload.');
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${authInfo?.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath);
    } catch (error) {
      toastHelper.error('Error uploading avatar!');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {avatarUrl ? (
        <Image
          width={size}
          height={size}
          src={avatarUrl}
          alt="Avatar"
          className="avatar image"
          style={{
            height: size,
            width: size,
            borderRadius: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            border: '1px solid #E5E5E5',
            boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.25)',
          }}
        />
      ) : (
        <div
          className="avatar no-image"
          style={{ height: size, width: size }}
        />
      )}
      <div className="self-center">
        <label htmlFor="single">{uploading ? 'Uploading ...' : 'Upload'}</label>
        <input
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  );
};

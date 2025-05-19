'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { GlobalLoading } from 'dineout-ui';

import { createClient } from '@/utils/supabase/client';

export default function AuthSetSessionPage() {
  const router = useRouter();

  useEffect(() => {
    setSession();
  }, []);

  const setSession = async () => {
    const supabase = await createClient();

    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');

    if (access_token && refresh_token) {
      supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
        if (error) {
          console.error('Failed to set session', error);
        } else {
          router.replace('/dashboard');
        }
      });
    }
  };

  return <GlobalLoading />;
}

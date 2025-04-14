'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import toast from 'react-hot-toast';

export const useSetPasswordFromInvite = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    authenticateAccessToken();
  }, []);

  const authenticateAccessToken = async () => {
    const supabase = await createClient();
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');

    if (access_token && refresh_token) {
      supabase.auth
        .setSession({ access_token, refresh_token })
        .then(({ error }) => {
          if (error) {
            setError('Failed to authenticate: ' + error.message);
          } else {
            setIsAuthenticated(true);
          }
          setFetching(false);
        });
    } else {
      setError('No tokens found in URL');
      setFetching(false);
    }
  };

  const setAccPassword = async () => {
    const supabase = await createClient();
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        return toast.error(error.message);
      }
      toast.success('Password set successfully');
      return null;
    } catch (error) {
      return toast.error('Failed to set password');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const pwError = useMemo(() => {
    if (password.length < 4) {
      return 'Password must be at least 4 characters long';
    }
    return '';
  }, [password]);

  return {
    pwError,
    fetching,
    error,
    password,
    handlePasswordChange,
    isAuthenticated,
    setAccPassword,
  };
};

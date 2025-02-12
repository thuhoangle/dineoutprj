'use client';

import { toastHelper } from '@/components';
import { useUserStore } from '@/stores/useUserStore';
import { createClient } from '@/utils/supabase/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { useState } from 'react';

export const useLoginSignup = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [fetchingLogin, setFetchingLogin] = useState(false);
  const [fetchingSignup, setFetchingSignup] = useState(false);

  const [password, setPassword] = useState('');
  const [errorPassword, setErrorPassword] = useState('');

  const _validate = () => {
    let isError = false;
    if (!email) {
      setErrorEmail('Please enter your email');
      isError = true;
    }
    if (!password) {
      setErrorPassword('Please enter your password');
      isError = true;
    }
    return !isError;
  };

  const onLogin = async () => {
    const supabase = await createClient();

    if (!_validate()) return;

    const dataInput = {
      email,
      password,
    };
    try {
      setFetchingLogin(true);
      await supabase.auth.signInWithPassword(dataInput);
      useUserStore.getState().getAuthInfo();
      // revalidatePath('/', 'layout');
      // redirect('/venues');
      router.push('/venues');
    } catch (error: any) {
      setFetchingLogin(false);
      toastHelper.error(error.message);
    }
    // if (!error) {
    //   revalidatePath('/', 'layout');
    //   // router.push('/venues');
    //   redirect('/venues');
    // } else {
    //   // redirect('/error');
    //   toastHelper.error(error.message);
    // }
  };

  const onSignup = async () => {
    const supabase = await createClient();

    if (!_validate()) return;

    const dataInput = {
      email,
      password,
    };

    const { error } = await supabase.auth.signUp(dataInput);

    if (!error) {
      revalidatePath('/', 'layout');
      redirect('/account');
    } else {
      redirect('/error');
    }
  };

  const onLogout = async () => {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      toastHelper.error(error.message);
      return;
    }
    localStorage.clear(); // Clear local storage
    sessionStorage.clear(); // Clear session storage
    toastHelper.success('Logout successfully');
    window.location.reload();
    // revalidatePath('/', 'layout');
    // redirect('/venues');
  };

  return {
    email,
    setEmail,
    errorEmail,
    password,
    setPassword,
    errorPassword,
    fetchingLogin,
    fetchingSignup,
    onLogin,
    onSignup,
    onLogout,
  };
};

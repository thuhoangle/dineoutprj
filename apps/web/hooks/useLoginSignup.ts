'use client';

import { createClient } from '@/utils/supabase/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { useState } from 'react';

export const useLoginSignup = () => {
  const [email, setEmail] = useState('');
  const [errorEmail, setErrorEmail] = useState('');

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

    const { error } = await supabase.auth.signInWithPassword(dataInput);

    if (!error) {
      revalidatePath('/', 'layout');
      redirect('/account');
    } else {
      redirect('/error');
    }
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

  return {
    email,
    setEmail,
    errorEmail,
    password,
    setPassword,
    errorPassword,
    onLogin,
    onSignup,
  };
};

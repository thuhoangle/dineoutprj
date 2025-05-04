'use client';

import { toastHelper } from '@/components';
// import { AppSocket } from '@/services/supa-socket';
import {
  useAvailableSeatsStore,
  useVenueInfoStore,
  useUserStore,
  useTablesStore,
} from '@/stores';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';

export const useLogin = (goToHomePage?: boolean) => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [fetchingLogin, setFetchingLogin] = useState(false);
  const [fetchingSignup, setFetchingSignup] = useState(false);

  const [password, setPassword] = useState('');
  const [errorPassword, setErrorPassword] = useState('');

  useEffect(() => {
    router.prefetch('/dashboard');
  }, []);

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
      await useUserStore.getState().getAuthInfo();
      await useUserStore.getState().getPortfolioDetail();
      await useTablesStore.getState().getTables();
      await useAvailableSeatsStore.getState().getAvailableSlots();
      const userId = useUserStore.getState().authInfo?.id;
      // if (userId) {
      //   AppSocket.subscribeToCustomerUpdates(userId);
      //   AppSocket.subscribeToReservationUpdates(userId);
      // }
      setFetchingLogin(false);

      // revalidatePath('/', 'layout');
      // redirect('/venues');
      if (goToHomePage) {
        router.push('/dashboard');
      }
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

  const onLogout = async () => {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      toastHelper.error(error.message);
      return;
    }
    localStorage.clear(); // Clear local storage
    sessionStorage.clear(); // Clear session storage
    useVenueInfoStore.getState().clearFavRestaurants();
    useUserStore.getState().logOut();
    toastHelper.success('Logout successfully');
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
    onLogout,
  };
};

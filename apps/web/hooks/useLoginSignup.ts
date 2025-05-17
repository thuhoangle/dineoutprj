'use client';

import { toastHelper } from '@/components';
import { AppSocket } from '@/services/supa-socket';
import { useVenueInfoStore } from '@/stores';
import { useUserStore } from '@/stores/useUserStore';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

import { useState } from 'react';
import { silentlyLinkGuestReservationsToUser } from './useLinkGuestToUser';

export const useLoginSignup = (goToHomePage?: boolean) => {
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
      await useUserStore.getState().getAuthInfo();
      await useUserStore.getState().getPortfolioDetail();
      await useVenueInfoStore.getState().getFavRestaurants();
      await silentlyLinkGuestReservationsToUser(useUserStore.getState().authInfo);
      const userId = useUserStore.getState().authInfo?.id;
      if (userId) {
        AppSocket.subscribeToCustomerUpdates(userId);
        AppSocket.subscribeToReservationUpdates(userId);
      }
      setFetchingLogin(false);

      // revalidatePath('/', 'layout');
      // redirect('/venues');
      if (goToHomePage) {
        router.push('/');
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

  const onSignup = async () => {
    setFetchingSignup(true);
    const supabase = await createClient();

    if (!_validate()) return;

    const dataInput = {
      email,
      password,
      options: {
        data: {
          role: 'customer',
        },
      },
    };

    const { error } = await supabase.auth.signUp(dataInput);

    if (!error) {
      router.refresh();
      router.push('/account/profile');
    } else {
      setFetchingSignup(false);
      router.push('/error');
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
    useVenueInfoStore.getState().clearFavRestaurants();
    useUserStore.getState().logOut();
    toastHelper.success('Logout successfully');
    // router.refresh();
    // router.push('/venues');
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

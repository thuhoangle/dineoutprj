'use client';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/stores';
import { toastHelper } from '@/components';
import { supabase } from '@/utils';
import { handleError } from '@/services';
import { UserInfo } from '@/services';

export const useUpdateUser = () => {
  const authInfo = useUserStore((state) => state.authInfo);
  const portfolioDetail = useUserStore((state) => state.portfolioDetail);
  const [userProfile, setUserProfile] = useState<UserInfo>({
    name: '',
    email: '',
    phone: '',
    profile_image: '',
    bio: '',
    additional_info: '',
    allergies: [],
    auth_id: '',
  });

  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!authInfo) return;
    _handleGetInitialProfile();
  }, [portfolioDetail, authInfo]);

  const _handleGetInitialProfile = async () => {
    if (!portfolioDetail) {
      useUserStore.getState().getPortfolioDetail();
    } else {
      setUserProfile({
        name: portfolioDetail.name || '',
        email: portfolioDetail.email || '',
        phone: portfolioDetail.phone,
        profile_image: portfolioDetail.profile_image || '',
        bio: portfolioDetail.bio || '',
        additional_info: portfolioDetail.additional_info || '',
        allergies: portfolioDetail.allergies || [],
        auth_id: portfolioDetail.auth_id || '',
      });
    }
  };

  const updateUser = async () => {
    if (!portfolioDetail?.auth_id) {
      toastHelper.error('User not found');
      return;
    }

    const updateData = {
      profile_image: userProfile.profile_image || '',
      name: userProfile.name,
      email: userProfile.email,
      phone: userProfile.phone,
      bio: userProfile.bio,
      allergies: userProfile.allergies,
      additional_info: userProfile.additional_info,
    };

    try {
      setFetching(true);
      const { error } = await supabase
        .from('customers')
        .update(updateData)
        .eq('auth_id', portfolioDetail.auth_id);

      if (error) {
        toastHelper.error(error.message);
        return;
      }
      toastHelper.success('Profile updated successfully');
      setFetching(false);
    } catch (error: any) {
      setFetching(false);
      handleError(error);
      return;
    }
  };

  const updateField = (field: keyof UserInfo, value: any) => {
    setUserProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return {
    updateUser,
    fetching,
    userProfile,
    updateField,
  };
};

import { useState } from 'react';
import { useUserStore } from '@/stores';
import { toastHelper } from '@/components';
import { supabase } from '@/utils';
import { handleError } from '@/services';

export const useUpdateUser = () => {
  const portfolioDetail = useUserStore((state) => state.portfolioDetail);

  const [name, setName] = useState(portfolioDetail?.name || '');
  const [email, setEmail] = useState(portfolioDetail?.email || '');
  const [phone, setPhone] = useState(portfolioDetail?.phone || '');
  const [img, setImg] = useState(portfolioDetail?.profile_image || '');
  const [bio, setBio] = useState(portfolioDetail?.bio || '');
  const [moreInfo, setMoreInfo] = useState(
    portfolioDetail?.additional_info || ''
  );
  const [allergies, setAllergies] = useState<string[]>(
    portfolioDetail?.allergies || []
  );

  const [fetching, setFetching] = useState(false);

  const updateUser = async () => {
    if (!portfolioDetail?.auth_id) {
      toastHelper.error('User not found');
      return;
    }

    const updateData = {
      profile_image: img,
      name,
      email,
      phone,
      bio,
      allergies,
      additional_info: moreInfo,
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

  return {
    updateUser,
    fetching,
    name,
    setName,
    email,
    setEmail,
    phone,
    setPhone,
    bio,
    setBio,
    allergies,
    setAllergies,
    img,
    setImg,
    moreInfo,
    setMoreInfo,
  };
};

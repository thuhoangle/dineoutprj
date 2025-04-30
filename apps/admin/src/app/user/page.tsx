import { FC } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { ProfilePanel } from '@/modules/profile/account-panel';
import { OverlayRestrict } from '@/components';

const Profile = () => (
  <>
    <ProfilePanel />
    <OverlayRestrict />
  </>
);

export default Profile;

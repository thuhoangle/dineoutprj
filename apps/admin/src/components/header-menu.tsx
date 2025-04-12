'use client';

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarBrand,
} from '@nextui-org/navbar';
import { Button } from '@nextui-org/button';
import NextLink from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { useUserStore } from '@/stores/useUserStore';
import { useLoginSignup } from '@/hooks';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/dropdown';

interface HeaderMenuProps {
  onGoSamePath?: () => void;
}

export const Navbar: FC<HeaderMenuProps> = ({ onGoSamePath }) => {
  const router = useRouter();
  const portfolioDetail = useUserStore((state) => state.portfolioDetail);
  const { onLogout } = useLoginSignup();

  // const restaurantList = useVenueInfoStore((state) => state.restaurantList);

  // useEffect(() => {
  //   useVenueInfoStore.getState().getRestaurantList();
  // }, []);

  return (
    <NextUINavbar isBordered maxWidth="full" position="sticky">
      <NavbarContent
        className="flex items-cente justify-betweenr"
        justify="start"
      >
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Image
              height={32}
              width={40}
              src="/logo.png"
              priority
              style={{ width: 'auto', height: 'auto' }}
              alt="logo"
            />
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="pl-4" justify="end">
        {!portfolioDetail && (
          <Button
            onPress={() => router.push('/login')}
            variant="flat"
            radius="md"
            className="bg-red-500 text-white text-medium"
          >
            Login
          </Button>
        )}
        {portfolioDetail && (
          <Dropdown>
            <DropdownTrigger>
              <Button variant="flat" className="bg-red-500 text-white">
                {portfolioDetail.name
                  ? portfolioDetail.name
                  : useUserStore.getState().authInfo?.email}
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem key={'profile'} href="/account/profile">
                Restaurant Management
              </DropdownItem>
              <DropdownItem key={'logout'} onPress={onLogout}>
                Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </NavbarContent>
    </NextUINavbar>
  );
};

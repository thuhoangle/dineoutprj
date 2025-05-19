'use client';

import NextLink from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FC, useEffect } from 'react';
import { useUserStore } from '@/stores/useUserStore';
import { useLogin } from '@/hooks';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarContent,
  NavbarBrand,
  Button,
} from '@heroui/react';

interface HeaderMenuProps {
  onGoSamePath?: () => void;
}

export const HeaderMenu: FC<HeaderMenuProps> = ({ onGoSamePath }) => {
  const router = useRouter();
  const portfolioDetail = useUserStore((state) => state.portfolioDetail);
  const { onLogout } = useLogin();

  useEffect(() => {
    router.prefetch('/auth/login');
    router.prefetch('/user');
  }, []);

  return (
    <Navbar isBordered maxWidth="full" position="sticky">
      <NavbarContent className="flex items-center justify-between" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Image
              height={32}
              width={40}
              src="/logo.png"
              priority
              // style={}
              alt="logo"
            />
            <div className="text-2xl font-bold text-red-600">DineOut</div>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="pl-4" justify="end">
        {!portfolioDetail && (
          <Button
            onPress={() => router.push('/auth/login')}
            variant="flat"
            radius="md"
            className="!bg-transparent font-semibold !border-2 !border-red-500 !text-red-500 text-medium"
          >
            Login
          </Button>
        )}
        {portfolioDetail && (
          <Dropdown>
            <DropdownTrigger>
              <Button variant="flat" className="!bg-transparent font-semibold !border-2 !border-red-500 !text-red-500">
                {portfolioDetail.name ? portfolioDetail.name : useUserStore.getState().authInfo?.email}
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem key={'profile'} onPress={() => router.push('/user')}>
                Restaurant Managing
              </DropdownItem>
              <DropdownItem key={'logout'} onPress={onLogout}>
                Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </NavbarContent>
    </Navbar>
  );
};

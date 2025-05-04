'use client';

import { Navbar, NavbarContent, NavbarBrand } from '@heroui/navbar';
import { Button } from '@heroui/button';
import NextLink from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { useUserStore } from '@/stores/useUserStore';
import { useLogin } from '@/hooks';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/dropdown';

interface HeaderMenuProps {
  onGoSamePath?: () => void;
}

export const HeaderMenu: FC<HeaderMenuProps> = ({ onGoSamePath }) => {
  const router = useRouter();
  const portfolioDetail = useUserStore((state) => state.portfolioDetail);
  const { onLogout } = useLogin();

  return (
    <Navbar isBordered maxWidth="full" position="sticky">
      <NavbarContent
        className="flex items-center justify-betweenr"
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
              <Button
                variant="flat"
                className="!bg-transparent font-semibold !border-2 !border-red-500 !text-red-500"
              >
                {portfolioDetail.name
                  ? portfolioDetail.name
                  : useUserStore.getState().authInfo?.email}
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem key={'profile'} href="/user">
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

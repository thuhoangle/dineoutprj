'use client';

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from '@nextui-org/navbar';
import { Button } from '@nextui-org/button';
import { Button as MyButton } from '../button';
import { Kbd } from '@nextui-org/kbd';
import { Link } from '@nextui-org/link';
import { Input } from '@nextui-org/input';
import { link as linkStyles } from '@nextui-org/theme';
import NextLink from 'next/link';
import clsx from 'clsx';
import { debounce } from 'lodash';
import Image from 'next/image';

import { siteConfig } from '@/config/site';
import { ThemeSwitch } from '@/components/theme-switch';
import { GithubIcon, HeartFilledIcon, SearchIcon } from '@/components/icons';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { FC, useState, useCallback, use, useEffect } from 'react';
import { getNavItems, NavItemType } from './menu-data';
import axios from 'axios';
import { createSerClient } from '@/utils/supabase/server';
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

interface MoviesProps {
  name: string;
  poster?: string;
}

export const Navbar: FC<HeaderMenuProps> = ({ onGoSamePath }) => {
  const pathname = usePathname();
  const router = useRouter();
  const portfolioDetail = useUserStore((state) => state.portfolioDetail);
  console.log('🚀 ~ portfolioDetail:', portfolioDetail);

  const { onLogout } = useLoginSignup();

  const [fetching, setFetching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendations, setRecommendations] = useState<MoviesProps[]>([]);

  const options = getNavItems();
  const _onItemClick = (navItem: NavItemType) => {
    if (navItem.route && pathname?.includes(navItem.route)) onGoSamePath?.();
    if (navItem.route) router.push(navItem.route);
  };

  const fetchRecommendations = async (query: string) => {
    setFetching(true);
    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/recommendations',
        { query },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setRecommendations(response.data);
      setFetching(false);
    } catch (err: any) {
      setRecommendations([]);
      setFetching(false);
    }
  };
  const debouncedFetchRecommendations = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setRecommendations([]);
        return;
      }
      await fetchRecommendations(query);
    }, 500),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedFetchRecommendations(query);
  };

  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: 'bg-default-100',
        input: 'text-sm',
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={['command']}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  return (
    <NextUINavbar isBordered maxWidth="full" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
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
        <ul className="hidden ipadMini:flex gap-4  justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: 'foreground' }),
                  'data-[active=true]:text-primary min-w-max text-sm data-[active=true]:font-medium'
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        {searchInput}
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
        <NavbarItem className="hidden md:flex">
          <Button
            isExternal
            as={Link}
            className="text-sm font-normal text-default-600 bg-default-100"
            href={siteConfig.links.sponsor}
            startContent={<HeartFilledIcon className="text-danger" />}
            variant="flat"
          >
            Sponsor
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        {!portfolioDetail && (
          <MyButton
            color="tred"
            text="Login"
            onClick={() => router.push('/login')}
          />
        )}
        {portfolioDetail && (
          <Dropdown>
            <DropdownTrigger>
              <Button variant="flat" className="bg-red-500 text-white">
                {portfolioDetail.name
                  ? portfolioDetail.name
                  : portfolioDetail.email}
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem
                key={'profile'}
                href="/account/profile"
                startContent={
                  <Image
                    src={portfolioDetail.profile_image || ''}
                    alt="Profile Image"
                    className="w-8 h-8 rounded-full"
                    width={40} // Specify width
                    height={40} // Specify height
                  />
                }
              >
                Profile
              </DropdownItem>
              <DropdownItem key={'logout'} onPress={onLogout}>
                Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
        <ThemeSwitch />
        {/* <NavbarMenuToggle /> */}
      </NavbarContent>

      {/* <NavbarMenu>
        {searchInput}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? 'primary'
                    : index === siteConfig.navMenuItems.length - 1
                      ? 'danger'
                      : 'foreground'
                }
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu> */}
    </NextUINavbar>
  );
};

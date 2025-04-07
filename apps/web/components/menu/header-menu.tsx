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
import { FC, useState, useCallback, useEffect, useRef } from 'react';
import { getNavItems, NavItemType } from './menu-data';
import axios from 'axios';
import { useUserStore } from '@/stores/useUserStore';
import { useGetRestaurantInfo, useLoginSignup } from '@/hooks';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/dropdown';
import { useVenueInfoStore } from '@/stores';
import { RestaurantInfo } from '@/services';
import { useCheckPressOutSide } from '@/hooks/useCheckPressOutSide';

interface HeaderMenuProps {
  onGoSamePath?: () => void;
}

export const Navbar: FC<HeaderMenuProps> = ({ onGoSamePath }) => {
  const router = useRouter();
  const portfolioDetail = useUserStore((state) => state.portfolioDetail);
  const { onLogout } = useLoginSignup();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [searchString, setSearchString] = useState('');
  const [searchResults, setSearchResults] = useState<RestaurantInfo[]>([]);
  const restaurantList = useVenueInfoStore((state) => state.restaurantList);
  const [isSearchPanelVisible, setIsSearchPanelVisible] = useState(false);

  useEffect(() => {
    useVenueInfoStore.getState().getRestaurantList();
    setSearchString('');
    setSearchResults([]);
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  useCheckPressOutSide(searchContainerRef, () => {
    setIsSearchPanelVisible(false);
  });

  const debouncedSearch = useCallback(
    debounce((query: string) => handleSearch(query), 300),
    [restaurantList]
  );

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const filtered = restaurantList.filter((restaurant) => {
      const searchLower = query.toLowerCase();
      return (
        restaurant.name?.toLowerCase().includes(searchLower) ||
        restaurant.locations?.address?.toLowerCase().includes(searchLower)
      );
    });

    setSearchResults(filtered);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchString(query);
    setIsSearchPanelVisible(true);
    debouncedSearch(query);
  };

  const handleRestaurantClick = (restaurant: RestaurantInfo) => {
    router.push(`/restaurant/${restaurant.slug}`);
    setSearchString('');
    setSearchResults([]);
    setIsSearchPanelVisible(false);
  };

  const searchInput = (
    <div ref={searchContainerRef} className="relative w-full max-w-md">
      <Input
        ref={searchInputRef}
        aria-label="Search"
        classNames={{
          inputWrapper: 'bg-default-100',
          input: 'text-sm',
        }}
        value={searchString}
        onChange={handleSearchChange}
        onFocus={() => setIsSearchPanelVisible(true)}
        endContent={<Kbd keys={['command']}>K</Kbd>}
        labelPlacement="outside"
        placeholder="Search restaurants..."
        startContent={
          <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
        }
        type="search"
      />
      {isSearchPanelVisible &&
        (searchResults.length > 0 ? (
          <div className="absolute z-10 max-h-80 overflow-y-auto w-full mt-1 bg-white rounded-md shadow-lg">
            {searchResults.map((restaurant) => (
              <div
                key={restaurant.id}
                className="px-4 py-2 hover:bg-gray-950 cursor-pointer scrollbar-thin"
                onClick={() => handleRestaurantClick(restaurant)}
              >
                <div className="font-medium">{restaurant.name}</div>
                <div className="text-sm text-gray-500">
                  {restaurant.locations?.address}
                </div>
              </div>
            ))}
          </div>
        ) : (
          !!searchString && (
            <div className="absolute z-10 max-h-80 overflow-y-auto w-full mt-1 bg-white rounded-md shadow-lg">
              <div className="px-4 py-2 font-medium text-sm text-gray-500">
                No results found
              </div>
            </div>
          )
        ))}
    </div>
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

      <NavbarContent className="flex w-full" justify="center">
        {searchInput}
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
    </NextUINavbar>
  );
};

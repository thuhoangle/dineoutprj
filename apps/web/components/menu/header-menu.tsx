'use client';

import { FC, useCallback, useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { Input } from '@heroui/input';
import {
  Badge,
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Kbd,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Tooltip,
} from '@heroui/react';
import { link as linkStyles } from '@heroui/theme';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { FaRegCalendar } from 'react-icons/fa6';
import { IoLogOutOutline } from 'react-icons/io5';
import { MdEventNote } from 'react-icons/md';

import { siteConfig } from '@/config/site';
import { useWindowContext } from '@/contexts';
import { useCheckPressOutSide, useLoginSignup } from '@/hooks';
import { RestaurantInfo } from '@/services';
import { useReservationStore, useUserStore, useVenueInfoStore } from '@/stores';

import { SearchIcon } from '../icons';
import { TextField } from '../text';
import { ThemeSwitch } from '../theme-switch';

interface HeaderMenuProps {
  onGoSamePath?: () => void;
}

export const HeaderMenu: FC<HeaderMenuProps> = ({ onGoSamePath }) => {
  const router = useRouter();
  const pathname = usePathname();
  const portfolioDetail = useUserStore((state) => state.portfolioDetail);
  const { onLogout } = useLoginSignup();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const allReservations = useReservationStore((state) => state.allReservations);

  const [searchString, setSearchString] = useState('');
  const [searchResults, setSearchResults] = useState<RestaurantInfo[]>([]);
  const restaurantList = useVenueInfoStore((state) => state.restaurantList);
  const [isSearchPanelVisible, setIsSearchPanelVisible] = useState(false);
  const { isMobileMode } = useWindowContext();

  useEffect(() => {
    useVenueInfoStore.getState().getRestaurantList();
    setSearchString('');
    setSearchResults([]);
    router.prefetch('/');
    router.prefetch('/login');
    router.prefetch('/venues');
    router.prefetch('/account/profile');
    router.prefetch('/account/reservations');
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        searchInputRef.current?.focus();
      }
      if (event.key === 'Escape') {
        setIsSearchPanelVisible(false);
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
    router.push(`/venues/${restaurant.slug}`);
    setSearchString('');
    setSearchResults([]);
    setIsSearchPanelVisible(false);
  };

  const upcomingReservations = allReservations.filter((reservation) => {
    return dayjs(reservation.reservation_time).isAfter(dayjs());
  });

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
        startContent={<SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />}
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
                <div className="text-sm text-gray-500">{restaurant.locations?.address}</div>
              </div>
            ))}
          </div>
        ) : (
          !!searchString && (
            <div className="absolute z-10 max-h-80 overflow-y-auto w-full mt-1 bg-white rounded-md shadow-lg">
              <div className="px-4 py-2 font-medium text-sm text-gray-500">No results found</div>
            </div>
          )
        ))}
    </div>
  );

  if (pathname?.includes('/auth/set-password')) {
    return <PwHeader />;
  }

  return (
    <Navbar isBordered maxWidth="full" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Image
              height={48}
              width={48}
              src="/dineout.jpg"
              priority
              style={{ width: 'auto', height: 'auto' }}
              alt="logo"
            />
          </NextLink>
        </NavbarBrand>
        {!isMobileMode && (
          <ul className="hidden ipadMini:flex gap-4 justify-start items-center">
            <NextLink className="w-12 mr-1 rounded-full border border-gray-800" href="/">
              <Image
                height={48}
                width={48}
                src="/dineout.jpg"
                priority
                style={{ width: 'auto', height: 'auto', borderRadius: '100%' }}
                alt="logo"
              />
            </NextLink>
            {siteConfig.navItems.map((item) => (
              <NavbarItem key={item.href}>
                <NextLink
                  prefetch={true}
                  className={clsx(
                    linkStyles({ color: 'foreground' }),
                    'data-[active=true]:text-primary !font-medium min-w-max text-md'
                  )}
                  color="foreground"
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              </NavbarItem>
            ))}
          </ul>
        )}
      </NavbarContent>

      {!isMobileMode && (
        <NavbarContent className="flex w-full" justify="center">
          {searchInput}
        </NavbarContent>
      )}
      <NavbarContent className="flex items-center gap-1" justify="center">
        <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
          {!portfolioDetail && (
            <Button
              variant="flat"
              radius="md"
              className="!bg-transparent font-semibold !border-2 !border-red-500 !text-red-500 text-medium"
              onPress={() => router.push('/login')}
            >
              Login
            </Button>
          )}
          {portfolioDetail && (
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="bordered"
                  color="danger"
                  className="border-red-600 font-semibold text-red-500"
                  // endContent={
                  //   upcomingReservations?.length > 0 && (
                  //     <Chip size="sm" color="danger" variant="solid" radius="sm">
                  //       {upcomingReservations?.length || 0}
                  //     </Chip>
                  //   )
                  // }
                >
                  {portfolioDetail.name ? portfolioDetail.name : portfolioDetail.email}
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  key="profile"
                  onPress={() => router.push('/account/profile')}
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
                <DropdownItem
                  key="reservations"
                  onPress={() => router.push('/account/reservations')}
                  startContent={<MdEventNote />}
                  endContent={
                    upcomingReservations?.length > 0 && (
                      <Chip size="sm" color="danger" variant="solid" radius="sm">
                        {upcomingReservations?.length || 0}
                      </Chip>
                    )
                  }
                >
                  Reservations
                </DropdownItem>
                <DropdownItem key={'logout'} onPress={onLogout} startContent={<IoLogOutOutline />}>
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
          <Tooltip
            placement="bottom"
            content={upcomingReservations?.length > 0 ? 'Upcoming Reservations' : 'No Upcoming Reservations'}
          >
            <Badge
              color="primary"
              content={upcomingReservations?.length}
              isInvisible={upcomingReservations?.length === 0}
              size="sm"
            >
              <Button isIconOnly variant="light" radius="md" onPress={() => router.push('/account/reservations')}>
                <FaRegCalendar size={22} className="text-gray-500" />
              </Button>
            </Badge>
          </Tooltip>
          <ThemeSwitch />
          {/* <NavbarMenuToggle /> */}
        </NavbarContent>
        <NavbarContent justify="end"></NavbarContent>
      </NavbarContent>
    </Navbar>
  );
};

const PwHeader = () => {
  return (
    <Navbar isBordered maxWidth="full" position="sticky">
      <NavbarContent className="flex items-center gap-1 w-full" justify="center">
        <Image height={32} width={40} src="/logo.png" priority style={{ width: 'auto', height: 'auto' }} alt="logo" />
        <NextLink className="flex justify-start items-center gap-1" href="/">
          <TextField preset="h5" weight="s" className="text-black" text="Dineout" />
        </NextLink>
      </NavbarContent>
    </Navbar>
  );
};

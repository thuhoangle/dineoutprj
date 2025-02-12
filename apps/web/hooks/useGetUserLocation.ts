'use client';

import { useState, useEffect, use } from 'react';
import { ApiInstance } from '../services';
import { useLocationStore } from '../stores';
import { toastHelper } from '@/components';

export const useGetUserLocation = () => {
  const [fetching, setFetching] = useState(false);
  const [location, setLocation] = useState('');
  const [locationSharable, setLocationSharable] = useState(false);
  const { latitude, longitude, setCoordinate } = useLocationStore(
    (state) => state
  );

  useEffect(() => {
    getUserLocation();
  }, []);

  const formatAddress = (road?: string, suburb?: string, city?: string) => {
    return [road, suburb, city].filter(Boolean).join(', ');
  };

  const getUserLocation = async () => {
    if (navigator.geolocation) {
      setLocationSharable(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinate(latitude, longitude);
          const body = {
            lat: latitude,
            lng: longitude,
          };

          setFetching(true);
          const res = await ApiInstance.getGeoLocation(body);
          setFetching(false);
          if (res.data) {
            const { road, suburb, city } = res.data?.address;
            setLocation(formatAddress(road, suburb, city));
          } else {
            console.error('Failed to fetch geolocation data.');
          }
        },
        (error) => {
          setFetching(false);
          setLocationSharable(false);
          setLocation('');
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.error('User  denied the request for Geolocation.');
              break;
            case error.POSITION_UNAVAILABLE:
              toastHelper.error('Location information is unavailable.');
              break;
            case error.TIMEOUT:
              toastHelper.error('The request to get user location timed out.');
              break;
          }
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser');
      setFetching(false);
      setLocationSharable(false);
    }
  };

  const checkGeolocationPermission = async () => {
    console.log('Checking geolocation permission...');
    try {
      const permissionStatus = await navigator.permissions.query({
        name: 'geolocation',
      });
      if (permissionStatus.state === 'denied') {
        console.log(
          'Geolocation access has been denied. Please enable it in your browser settings.'
        );
      } else {
        getUserLocation();
      }
    } catch (error) {
      console.log('Error checking geolocation permission:', error);
    }
  };

  return {
    location,
    fetching,
    locationSharable,
    checkGeolocationPermission,
    latitude,
    longitude,
  };
};

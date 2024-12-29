'use client';

import React, { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useLocationStore } from '../../../stores';
import { useGetUserLocation } from '../../../hooks';

export const CustomMap = () => {
  const mapContainer = useRef(null);
  const map = useRef<maplibregl.Map | null>(null);
  const longitude = 139.753;
  const latitude = 35.6844;
  // const { latitude, longitude } = useGetUserLocation();
  console.log('🚀 ~ CustomMap ~ latitude:', latitude, longitude);

  const zoom = 14;
  const apiKey = 'DoYG2Cn5PLrGKhCO18HI';

  useEffect(() => {
    getMapByLocation();
  }, [longitude, latitude]);

  const getMapByLocation = async () => {
    if (
      map.current ||
      !mapContainer.current ||
      latitude === null ||
      longitude === null
    )
      return;

    map.current = new maplibregl.Map({
      container: mapContainer.current as HTMLElement, // type assertion
      style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${apiKey}`,
      center: [longitude || 106.660172, latitude || 10.762622],
      zoom: zoom,
    });

    new maplibregl.Marker({ color: '#FF0000' })
      .setLngLat([longitude, latitude])
      .addTo(map.current);

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
  };

  return (
    <div className="relative w-full h-calc(100vh-77px)">
      <div ref={mapContainer} className="absolute w-full h-full" />
    </div>
  );
};

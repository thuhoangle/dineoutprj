'use client';

import React, { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { RestaurantInfo } from '../../../services/api-types';
import clsx from 'clsx';
import { TextField } from '@/components';
import Image from 'next/image';
import { FaStar } from 'react-icons/fa';
import ReactDOM from 'react-dom/client';

/* eslint-disable @next/next/no-img-element */

export const CustomMap = ({
  markers = [],
  center,
  className,
}: {
  markers: RestaurantInfo[];
  center?: { longitude: number | undefined; latitude: number | undefined };
  className?: string;
}) => {
  const mapContainer = useRef(null);
  const map = useRef<maplibregl.Map | null>(null);
  const zoom = 14;
  const apiKey = process.env.NEXT_PUBLIC_MAPLIBRE_API_KEY;

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current as HTMLElement,
      style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${apiKey}`,
      center: [center?.longitude ?? 106.660172, center?.latitude ?? 10.762622],
      zoom: zoom,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
  }, [center?.latitude, center?.longitude]);

  useEffect(() => {
    updateMarkers();
  }, [markers]);

  const updateMarkers = () => {
    if (!map.current) return;

    const existingMarkers =
      document.getElementsByClassName('maplibregl-marker');
    while (existingMarkers[0]) {
      existingMarkers[0].remove();
    }

    markers.forEach((marker) => {
      if (marker.locations?.lng && marker.locations?.lat) {
        const popupContent = `
          <div class="flex flex-col">
            <div class="flex gap-2">
              <img
                src="${marker.images?.[0]}"
                alt="${marker.name}"
                class="w-16 h-16 rounded-lg object-cover"
              />
              <div class="flex flex-col gap-2">
                <div class="font-bold outline-none">
                  <a href="/venues/${marker.slug}" class="hover:underline cursor-pointer">
                    ${marker.name}
                  </a>
                </div>
                <div class="flex items-center text-red-500 gap-1">
                  ${marker.rating?.toString() ? `<span>⭐</span>${marker.rating}` : ''}
                  ${marker.review_count?.toString() ? `<span class="text-gray-500">(${marker.review_count})</span>` : ''}
                </div>
              </div>
            </div>
          </div>
        `;

        new maplibregl.Marker({ color: '#FF0000' })
          .setLngLat([marker.locations.lng, marker.locations.lat])
          .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(popupContent))
          .addTo(map.current!);
      }
    });
  };

  return (
    <div className={clsx('w-full h-full', className)}>
      <div ref={mapContainer} className="absolute w-full h-full" />
    </div>
  );
};

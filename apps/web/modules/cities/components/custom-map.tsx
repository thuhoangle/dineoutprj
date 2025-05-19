'use client';

import React, { useEffect, useRef } from 'react';

import clsx from 'clsx';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { AvailableSeatRestaurant, RestaurantInfo } from '@/services';

 

export const CustomMap = ({
  markers = [],
  center,
  className,
  hoveredId,
}: {
  markers: (RestaurantInfo | AvailableSeatRestaurant)[];
  center?: { longitude: number | undefined; latitude: number | undefined };
  className?: string;
  hoveredId?: string | null;
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
  }, [markers, hoveredId]);

  const updateMarkers = () => {
    if (!map.current) return;

    const existingMarkers = document.getElementsByClassName('maplibregl-marker');
    while (existingMarkers[0]) {
      existingMarkers[0].remove();
    }

    markers.forEach((marker) => {
      const location = (marker as AvailableSeatRestaurant).restaurant_locations ?? (marker as RestaurantInfo).locations;
      const images = (marker as AvailableSeatRestaurant).restaurant_images ?? (marker as RestaurantInfo).images;
      const name = (marker as AvailableSeatRestaurant).restaurant_name ?? (marker as RestaurantInfo).name;
      const slug = (marker as AvailableSeatRestaurant).restaurant_slug ?? (marker as RestaurantInfo).slug;
      const rating = (marker as AvailableSeatRestaurant).restaurant_rating ?? (marker as RestaurantInfo).rating;
      const review_count =
        (marker as AvailableSeatRestaurant).restaurant_review_count ?? (marker as RestaurantInfo).review_count;

      if (location?.lng && location?.lat) {
        const isHovered = hoveredId === marker.id;

        const markerElement = document.createElement('div');
        markerElement.style.width = isHovered ? '35px' : '20px';
        markerElement.style.height = isHovered ? '35px' : '20px';
        markerElement.style.borderRadius = '50%';
        markerElement.style.backgroundColor = isHovered ? '#b91c1c' : '#FF0000';
        markerElement.style.border = '2px solid white';
        markerElement.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)';
        markerElement.style.transition = 'all 0.2s ease';

        const popupContent = `
          <div class="flex flex-col">
            <div class="flex gap-2">
              <img
                src="${images?.[0]}"
                alt="${name}"
                class="w-16 h-16 rounded-lg object-cover"
              />
              <div class="flex flex-col gap-2">
                <div class="font-bold outline-none">
                  <a href="/venues/${slug}" class="hover:underline cursor-pointer">
                    ${name}
                  </a>
                </div>
                <div class="flex items-center text-red-500 gap-1">
                  ${rating?.toString() ? `<span>⭐</span>${rating}` : ''}
                  ${review_count?.toString() ? `<span class="text-gray-500">(${review_count})</span>` : ''}
                </div>
              </div>
            </div>
          </div>
        `;

        new maplibregl.Marker({ element: markerElement })
          .setLngLat([location.lng, location.lat])
          .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(popupContent))
          .addTo(map.current!);
      }
    });

    if (center?.longitude && center?.latitude) {
      const userMarker = document.createElement('div');
      userMarker.style.width = '18px';
      userMarker.style.height = '18px';
      userMarker.style.borderRadius = '50%';
      userMarker.style.backgroundColor = '#007AFF';
      userMarker.style.border = '2px solid white';
      userMarker.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)';

      new maplibregl.Marker({ element: userMarker })
        .setLngLat([center.longitude, center.latitude])
        .setPopup(new maplibregl.Popup({ offset: 25 }).setText('You are here'))
        .addTo(map.current!);
    }
  };

  return (
    <div className={clsx('w-full h-full', className)}>
      <div ref={mapContainer} className="absolute w-full h-full" />
    </div>
  );
};

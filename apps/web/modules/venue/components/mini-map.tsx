'use client';

import React, { useEffect, useRef } from 'react';

import { Link } from '@heroui/link';
import clsx from 'clsx';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { TextField } from '@/components';
import { RestaurantInfo } from '@/services/api-types';

export const MiniMap = ({ data, className }: { data: RestaurantInfo; className?: string }) => {
  const mapContainer = useRef(null);
  const map = useRef<maplibregl.Map | null>(null);
  const zoom = 15;
  const apiKey = process.env.NEXT_PUBLIC_MAPLIBRE_API_KEY;

  useEffect(() => {
    if (map.current || !mapContainer.current || !data.locations) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current as HTMLElement,
      style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${apiKey}`,
      center: [data.locations.lng, data.locations.lat],
      zoom: zoom,
      interactive: false,
      maxCanvasSize: [550, 200],
    });

    new maplibregl.Marker({
      color: '#FF0000',
      scale: 0.8,
    })
      .setLngLat([data.locations.lng, data.locations.lat])
      .addTo(map.current!);
  }, [data.locations]);

  return (
    <div
      className={clsx(
        'w-full h-80 z-0 flex flex-col ipadMini:flex-row rounded-xl border border-neutral-200 overflow-hidden shadow-md',
        className
      )}
    >
      <div className="relative w-full h-[350px] overflow-hidden ">
        <div ref={mapContainer} className="absolute w-full h-full" />
      </div>
      <div className="flex z-10 flex-col gap-1 bg-themebg px-2">
        <Link
          isExternal
          showAnchorIcon
          anchorIcon={
            <svg
              className="group-hover:text-inherit text-default-400 transition-[color,transform] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              fill="none"
              height="16"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M7 17 17 7M7 7h10v10" />
            </svg>
          }
          className="group gap-x-0.5 text-medium text-foreground font-semibold"
          href={data.ggUrl}
          rel="noreferrer noopener"
        >
          {data.name}
        </Link>
        <TextField preset="p4" weight="m" text={data.phone} />
        <TextField preset="p4" weight="m" text={data.locations.address} />
        {data.website && (
          <Link
            className="text-[13px] font-medium text-foreground hover:underline"
            isExternal
            href={data.website}
            rel="noreferrer noopener"
          >
            {data.website}
          </Link>
        )}
      </div>
    </div>
  );
};

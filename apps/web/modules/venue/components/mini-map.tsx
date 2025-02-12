import { TextField } from '@/components';
import { RestaurantData } from '@/interface';
import { Link } from '@nextui-org/link';
import maplibregl from 'maplibre-gl';
import { useEffect, useRef } from 'react';

export const MiniMap = ({ data }: { data: RestaurantData }) => {
  const { locations, phone, website, name } = data;

  return (
    <div className="flex bg-gray-200 flex-col max-w-lg">
      <DupeMap long={locations.geo.long} lat={locations.geo.lat} />
      <div className="flex z-50 rounded-b flex-col gap-1 px-2">
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
          href="https://www.google.com/maps/place/555+California+St,+San+Francisco,+CA+94103"
          rel="noreferrer noopener"
        >
          {name}
        </Link>
        {/* <TextField preset="h2" weight="b" text={name} /> */}
        <TextField preset="p4" text={locations.address} />
        {phone && <TextField preset="p4" text={phone} />}
        {website && <TextField preset="p4" text={website} />}
      </div>
    </div>
  );
};

const DupeMap = ({ long, lat }: { long: number; lat: number }) => {
  const mapContainer = useRef(null);
  const map = useRef<maplibregl.Map | null>(null);
  const zoom = 8;

  const apiKey = 'DoYG2Cn5PLrGKhCO18HI';

  useEffect(() => {
    getMapByLocation();
  }, [long, lat]);

  const getMapByLocation = async () => {
    if (map.current || !mapContainer.current || long === null || lat === null)
      return;

    map.current = new maplibregl.Map({
      container: mapContainer.current as HTMLElement, // type assertion
      style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${apiKey}`,
      center: [long, lat],
      zoom: zoom,
    });

    new maplibregl.Marker({ color: '#FF0000' })
      .setLngLat([long, lat])
      .addTo(map.current);

    map.scrollZoom.disable();
  };

  return (
    <div className="relative w-full">
      <div ref={mapContainer} className="absolute w-full h-full " />
    </div>
  );
};

/* eslint-disable @next/next/no-img-element */
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import NextImage from 'next/image';

export const Carousel = ({ data }: { data: string[] }) => {
  const _handlePagination = {
    clickable: true,
    renderBullet: function () {
      return '<span class="w-5 aspect-square rounded-full text-gray-800"></span>';
    },
  };
  return (
    <Swiper
      loop={true}
      zoom={true}
      pagination={{
        // type: 'fraction',
        clickable: true,
      }}
      navigation={true}
      modules={[Pagination, Navigation]}
      className="justify-center w-full items-center flex overflow-x-hidden"
    >
      {data.map((item: string, index: number) => (
        <SwiperSlide key={index}>
          <NextImage
            width={510}
            height={600}
            objectFit="cover"
            className="min-w-max object-cover w-full"
            src={item}
            alt={`venue img ${index}`}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

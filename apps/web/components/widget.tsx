import { FaArrowRight } from 'react-icons/fa';
import { FaRegClock, FaStar } from 'react-icons/fa6';
import clsx from 'clsx';
import NextImage from 'next/image';
import { TextField } from './text';
import { Button } from './button';
import { Badge } from './badge';

export interface ItemProps {
  img: string;
  title: string;
  subtitle?: string;
  workTime: string;
  rating: string;
  leftBtnTitle?: string;
  leftBtnOnClick?: () => void;
  rightBtnTitle?: string;
  rightBtnOnClick?: () => void;
}

export const Widget = ({
  data,
  className,
  disabled,
}: {
  data: ItemProps;
  className?: string;
  disabled?: boolean;
}) => {
  const {
    img,
    title,
    subtitle,
    workTime,
    rating,
    leftBtnTitle,
    rightBtnTitle,
    rightBtnOnClick,
    leftBtnOnClick,
  } = data;

  return (
    <div
      className={clsx(
        'flex w-[350px] h-80 flex-col justify-between rounded-md bg-gray-100 p-1',
        className
      )}
    >
      <div>
        <NextImage
          width={343}
          height={250}
          style={{
            height: '250px',
            objectFit: 'cover',
            borderRadius: '4px',
            filter: disabled ? 'grayscale(100%)' : 'none',
            zIndex: 0,
          }}
          src={img}
          alt="campaigns"
        />
        <div className="relative bottom-4 left-3 z-10 flex gap-2">
          <Badge size="lg" text={workTime} HeroIcon={FaRegClock} />
          <Badge size="lg" color="green" text={rating} HeroIcon={FaStar} />
        </div>
        <div className="flex flex-col items-start justify-center">
          <div className="flex flex-col gap-2">
            <TextField weight="m" preset="h6" text={title} />
            <TextField color="gray" preset="p4" text={subtitle} />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3">
        {!!leftBtnOnClick && (
          <Button
            preset="sgray2"
            className="flex-1"
            text={leftBtnTitle || 'Learn More'}
            onClick={leftBtnOnClick}
          />
        )}
        {!!rightBtnOnClick && !disabled && (
          <Button
            text={rightBtnTitle || 'Book Now'}
            RightHeroIcon={FaArrowRight}
            className="flex-[2]"
            onClick={rightBtnOnClick}
          />
        )}
      </div>
    </div>
  );
};

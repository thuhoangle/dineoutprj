'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import clsx from 'clsx';
import { Button } from 'dineout-ui';
import { TextField } from 'dineout-ui';
import { IoIosLogIn } from 'react-icons/io';

import { useUserStore } from '@/stores';

export const OverlayRestrict = ({
  className,
  title,
  description,
  buttonText,
  onButtonClick,
  Icon,
}: {
  className?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  Icon?: React.ReactNode;
}) => {
  const router = useRouter();
  const authInfo = useUserStore((state) => state.authInfo);
  const [isVibile, setIsVisible] = useState(false);

  useEffect(() => {
    if (!authInfo) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [authInfo]);

  if (!isVibile) return null;
  return (
    <div
      className={clsx(
        'fixed inset-0 z-50 flex h-full w-full flex-col items-center justify-center bg-black/60 backdrop-blur',
        className
      )}
    >
      <div className="flex border border-gray-200 w-full max-w-md flex-col rounded-xl border border-gray-400 bg-gray-200 px-6 py-6">
        {Icon || <IoIosLogIn className="p-2 h-12 w-12 border-2 self-center shadow border-gray-300 rounded-xl" />}
        <div className="flex flex-col items-center justify-center gap-1 pb-8 pt-4 text-center">
          <TextField preset="h6" weight="m">
            {title || (
              <>
                Log in to
                <span className="text-red-700 font-semibold"> DineOut</span>
              </>
            )}
          </TextField>
          <TextField
            preset="p3"
            className="text-gray-700"
            text={description || 'You have to log in to access'}
            weight="m"
          />
        </div>
        <Button
          className="w-full self-end !bg-transparent border-2 border-red-500 font-semibold !text-red-500"
          text={buttonText || 'Log in'}
          onClick={onButtonClick || (() => router.push('/auth/login'))}
        />
      </div>
    </div>
  );
};

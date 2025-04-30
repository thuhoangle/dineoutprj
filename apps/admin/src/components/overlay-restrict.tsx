'use client';

import { useUserStore } from '@/stores';
import clsx from 'clsx';
import { Button } from 'dineout-ui';
import { TextField } from 'dineout-ui';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const OverlayRestrict = ({
  className,
  title,
  description,
  buttonText,
  onButtonClick,
}: {
  className?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
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
        'fixed inset-0 z-50 flex h-full w-full flex-col items-center justify-center bg-bg-overlay/60 backdrop-blur',
        className
      )}
    >
      <div className="flex w-full max-w-md flex-col rounded-xl border border-border-primary bg-bg-primary px-6 pb-6">
        <div className="flex flex-col items-center justify-center gap-1 pb-8 pt-6 text-center">
          <TextField
            preset="h6"
            text={title || 'You have to log in to access'}
            weight="m"
          />
          {description && (
            <TextField preset="p3" text={description} color="g400" />
          )}
        </div>
        <Button
          className="w-full self-end"
          preset="primary"
          text={buttonText || 'Log in'}
          onClick={onButtonClick || (() => router.push('/auth/login'))}
        />
      </div>
    </div>
  );
};

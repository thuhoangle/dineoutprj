'use client';

import React from 'react';

import clsx from 'clsx';
import type { Toast, ToastOptions } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { FaRegSmileWink } from 'react-icons/fa';
import { IoIosClose } from 'react-icons/io';
import { MdErrorOutline } from 'react-icons/md';

import { FeatureIcon, SimpleLoading, TextField } from '@/components';

export const toastHelper = {
  success: (message: string | React.ReactNode, options?: ToastOptions) => Toaster('success', message, options),
  error: (message: string, options?: ToastOptions) => Toaster('error', message, options),
  warning: (message: string, options?: ToastOptions) => Toaster('warning', message, options),
  loading: (message: string, options?: ToastOptions) => Toaster('loading', message, { ...options, duration: Infinity }),
};

const Toaster = (type: ToasterType, message: string | React.ReactNode, options?: ToastOptions) => {
  const { duration } = options || {};
  return toast.custom((t) => <ToastContent duration={duration} message={message} t={t} type={type} />, {
    position: 'top-right',
    duration: type === 'loading' ? Infinity : duration || 3000,
    ...options,
  });
};

const ToastContent = ({
  type,
  message,
  t,
  duration,
}: {
  type: ToasterType;
  message: string | React.ReactNode;
  t: Toast;
  duration?: number;
}) => {
  const { title, Icon, iconColor } = TOASTER_CONFIG[type];

  return (
    <div
      className={clsx(
        'pointer-events-auto relative min-w-[200px] max-w-sm overflow-hidden rounded-xl bg-white shadow-md',
        t.visible ? 'fade-in-right' : 'fade-out-right'
      )}
    >
      {type !== 'loading' && (
        <button className="absolute right-1.5 top-0.5 p-2">
          <IoIosClose className="h-8 w-8 self-end text-gray-500" onClick={() => toast.dismiss(t.id)} />
        </button>
      )}
      <div className="flex items-start gap-2 p-4">
        {type === 'loading' ? (
          <SimpleLoading className="self-center px-3" loadingColor="#EAAA08" size={20} />
        ) : (
          <FeatureIcon className="self-start" color={iconColor} Icon={Icon} preset="outline" size="md" />
        )}
        <div className="flex flex-col gap-1">
          <TextField className={clsx(getColorByType(type, 'text'))} preset="p4" text={title} weight="m" />
          <TextField preset="p4" text={message as string} />
        </div>
      </div>
      {type !== 'loading' && <ProcessBar duration={duration} type={type} />}
    </div>
  );
};

const ProcessBar = ({ type, duration }: { type: ToasterType; duration?: number }) => (
  <div className="h-1 w-full">
    <div
      className={clsx('process-load-to-full h-1 rounded-full', getColorByType(type, 'bg'))}
      style={{ animationDuration: `${duration || 3000}ms` }}
    />
  </div>
);

const getColorByType = (type: ToasterType, prefix: string) => {
  const { color } = TOASTER_CONFIG[type];
  return `${prefix}-${color}`;
};

type ToasterType = 'success' | 'error' | 'warning' | 'loading';
const TOASTER_CONFIG: {
  [key in ToasterType]: {
    Icon: any;
    iconColor: string;
    color: string;
    title?: string;
  };
} = {
  success: {
    Icon: FaRegSmileWink,
    iconColor: 'green' as const,
    color: 'green-500',
    title: 'Success',
  },
  error: {
    Icon: MdErrorOutline,
    iconColor: 'red' as const,
    color: 'red-500',
    title: 'Error',
  },
  warning: {
    Icon: MdErrorOutline,
    iconColor: 'yellow' as const,
    color: 'yellow-500',
    title: 'Warning',
  },
  loading: {
    Icon: MdErrorOutline,
    iconColor: 'yellow' as const,
    color: 'yellow-500',
    title: 'Loading',
  },
};

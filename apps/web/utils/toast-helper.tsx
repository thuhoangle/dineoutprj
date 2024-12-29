import { IoIosCloseCircleOutline } from 'react-icons/io';
import { RxCheckCircled } from 'react-icons/rx';
import { IoAlertCircleOutline } from 'react-icons/io5';
import { FeatureIcon, SimpleLoading, TextField } from '../components';
import clsx from 'clsx';
import React from 'react';
import type { Toast, ToastOptions } from 'react-hot-toast';
import toast from 'react-hot-toast';

export const toastHelper = {
  success: (message: string, options?: ToastOptions) => {
    const { duration } = options || {};
    toast.custom(
      (t) => (
        <ToastContent
          type="success"
          message={message}
          t={t}
          duration={duration}
        />
      ),
      {
        position: 'top-right',
        duration: duration || 3000,
        ...options,
      }
    );
  },
  error: (message: string, options?: ToastOptions) => {
    const { duration } = options || {};
    toast.custom(
      (t) => (
        <ToastContent
          type="error"
          message={message}
          t={t}
          duration={duration}
        />
      ),
      {
        position: 'top-right',
        duration: duration || 3000,
        ...options,
      }
    );
  },
  warning: (message: string, options?: ToastOptions) => {
    const { duration } = options || {};
    toast.custom(
      (t) => (
        <ToastContent
          type="warning"
          message={message}
          t={t}
          duration={duration}
        />
      ),
      {
        position: 'top-right',
        duration: duration || 3000,
      }
    );
  },
  loading: (message: string, options?: ToastOptions) =>
    toast.custom(
      (t) => <ToastContent type="loading" message={message} t={t} />,
      {
        position: 'top-right',
        duration: Infinity,
        ...options,
      }
    ),
};

const ToastContent = ({
  type,
  message,
  t,
  duration,
}: {
  type: ToasterType;
  message: string;
  t: Toast;
  duration?: number;
}) => (
  <div
    className={clsx(
      'pointer-events-auto relative min-w-[150px] max-w-[300px] overflow-hidden rounded-xl bg-gray-900 shadow-md',
      t.visible ? 'fade-in-right' : 'fade-out-right'
    )}
  >
    <div className="flex items-start gap-2 p-4">
      {type === 'loading' ? (
        <SimpleLoading
          loadingColor="#EAAA08"
          size={20}
          className="self-center px-3"
        />
      ) : (
        <FeatureIconByType type={type} />
      )}
      <div className="flex flex-col gap-1">
        <TextField
          preset="p4"
          className={clsx(getColorByType(type, 'text'))}
          weight="m"
          text={type.charAt(0).toUpperCase() + type.slice(1)}
        />
        <TextField preset="p4" color="gray" text={message} />
      </div>
    </div>
    {type !== 'loading' && (
      <div className="h-1 w-full">
        <div
          className={clsx(
            'process-load-to-full h-1 rounded-full',
            getColorByType(type, 'bg')
          )}
          style={{
            animationDuration: `${duration || 3000}ms`,
          }}
        />
      </div>
    )}
    {type !== 'loading' && (
      <button className="absolute right-1.5 top-1.5 p-2">
        <IoIosCloseCircleOutline
          className="w-5 self-end text-gray-400"
          onClick={() => toast.dismiss(t.id)}
        />
      </button>
    )}
  </div>
);

const getColorByType = (type: ToasterType, prefix: string) => {
  const classColorByType =
    type === 'success'
      ? 'green-500'
      : type === 'error'
        ? 'red-500'
        : type === 'warning' || type === 'loading'
          ? 'yellow-500'
          : 'primary-600';

  return `${prefix}-${classColorByType}`;
};

const FeatureIconByType = ({ type }: { type?: ToasterType }) => {
  return type === 'success' ? (
    <FeatureIcon
      className="self-start"
      size="md"
      Icon={RxCheckCircled}
      color="green"
      preset="outline"
    />
  ) : type === 'error' ? (
    <FeatureIcon
      className="self-start"
      size="md"
      Icon={IoAlertCircleOutline}
      color="red"
      preset="outline"
    />
  ) : type === 'warning' || type === 'loading' ? (
    <FeatureIcon
      className="self-start"
      size="md"
      Icon={IoAlertCircleOutline}
      color="yellow"
      preset="outline"
    />
  ) : null;
};

type ToasterType = 'success' | 'error' | 'warning' | 'loading';

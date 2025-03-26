'use client';

import { FC } from 'react';

import { TextInput } from '@/components/simple-input';
import { TextField } from '@/components/text';
import { Button } from '@/components/button';
import { useLoginSignup } from '@/hooks';
import { ModalHeader, SimpleModal } from '../simple-modal';

import { useState } from 'react';
import { ModalBaseProps } from '../types';

interface ModalLoginProps extends ModalBaseProps {
  onOpenChange: () => void;
}

export const ModalLogin: FC<ModalLoginProps> = ({
  isVisible,
  closeFromController,
  onOpenChange,
}) => {
  const {
    email,
    setEmail,
    errorEmail,
    password,
    setPassword,
    errorPassword,
    onLogin,
    onSignup,
    fetchingLogin,
    fetchingSignup,
  } = useLoginSignup();

  const _handleAuth = async () => {
    if (isSignup) {
      await onSignup();
    } else {
      await onLogin();
    }
    onOpenChange();
  };

  const [isSignup, setIsSignup] = useState(false);

  return (
    <SimpleModal
      hideModalCB={closeFromController}
      isVisible={isVisible}
      showCloseIcon
      panelClassName="gap-5"
      panelWrapperClassName="z-[9999]"
    >
      <ModalHeader title={isSignup ? 'Sign up' : 'Log in'} />
      <div className="flex flex-col gap-5 w-full">
        <TextInput
          label="Your email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errorEmail}
        />
        <TextInput
          label="Your password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errorPassword}
        />
        <div className="flex flex-col items-end gap-2 ">
          <Button
            className="w-full"
            fetching={fetchingLogin || fetchingSignup}
            preset="red"
            text={isSignup ? 'Sign up' : 'Log in'}
            onClick={_handleAuth}
          />
          <TextField preset="p4" weight="m" color="g400">
            {isSignup ? 'Already have an account? ' : "Don't have an account? "}
            <span
              className="text-red-500 cursor-pointer"
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? 'Log in' : 'Sign up'}
            </span>
          </TextField>
        </div>
      </div>
    </SimpleModal>
  );
};

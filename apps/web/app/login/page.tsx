'use client';

import { Button, TextInput } from '@/components';
import { login, signup } from './action';
import { useState } from 'react';
import { useLoginSignup } from '@/hooks';
import { on } from 'events';

export default function LoginPage() {
  const {
    email,
    setEmail,
    errorEmail,
    password,
    setPassword,
    errorPassword,
    onLogin,
    onSignup,
  } = useLoginSignup();

  return (
    <div className="flex flex-col gap-3">
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
      <div className="flex flex-col gap-2">
        <Button preset="primary" text="Log in" onClick={onLogin} />
        <Button preset="secondary" text="Sign up" onClick={onSignup} />
      </div>
    </div>
  );
}

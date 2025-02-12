'use client';

import { Button, TextInput } from '@/components';
import { useLoginSignup } from '@/hooks';

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
    fetchingLogin,
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
        <Button
          fetching={fetchingLogin}
          preset="primary"
          text="Log in"
          onClick={onLogin}
        />
        <Button preset="secondary" text="Sign up" onClick={onSignup} />
      </div>
    </div>
  );
}

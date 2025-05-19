'use client';

import { createClient } from '@/utils/supabase/client';

import { Button, GlobalLoading, TextField, TextInput } from '@/components';
import { useSetPasswordFromInvite } from '@/hooks';

export default function SetPasswordPage() {
  const supabase = createClient();
  const { pwError, fetching, error, password, handlePasswordChange, isAuthenticated, setAccPassword } =
    useSetPasswordFromInvite();

  const handleSubmit = async () => {
    await setAccPassword();
    const { data: sessionData } = await supabase.auth.getSession();
    const { access_token, refresh_token } = sessionData.session!;

    window.location.href = `http://localhost:3001/auth/set-session#access_token=${access_token}&refresh_token=${refresh_token}`;
  };

  if (!isAuthenticated) return <GlobalLoading />;
  if (error) return <div className="text-[18px] p-8 text-red-500 text-center">{error}</div>;

  return (
    <div className="w-full pt-5 flex flex-col items-center justify-center mt-16 gap-6">
      <TextField preset="h2" text="Complete your account setup" />
      <div className="w-full max-w-md flex flex-col gap-3">
        <TextInput
          label="Create a password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          error={pwError}
        />
        <Button
          preset="red"
          text="Submit"
          onClick={handleSubmit}
          fetching={fetching}
          disabled={!!pwError || !password.length}
        />
      </div>
    </div>
  );
}

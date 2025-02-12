import AccountForm from './account-form';
import { createSerClient } from '@/utils/supabase/server';

export default async function Account() {
  const supabase = await createSerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <AccountForm user={user} />;
}

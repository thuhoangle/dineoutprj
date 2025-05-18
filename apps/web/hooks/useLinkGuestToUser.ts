import { AuthInfo } from '@/stores';
import { supabase } from '@/utils';

export const silentlyLinkGuestReservationsToUser = async (authUser: AuthInfo | null) => {
  if (authUser === null) return;
  const { id, email, phone } = authUser;

  const filters: string[] = [];

  if (phone) filters.push(`guest_phone.eq.${phone}`);
  if (email) filters.push(`guest_email.eq.${email}`);

  if (filters.length === 0) return;

  const { error } = await supabase
    .from('reservations')
    .update({ user_id: id })
    .eq('user_id', null)
    .or(filters.join(','));

  if (error) {
    console.debug('Silent guest link skipped:', error.message);
  }
};

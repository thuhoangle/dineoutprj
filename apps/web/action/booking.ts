'use server'

import { createClient } from '@/utils/supabase/server'
import { IBooking } from '@/interface/booking'

export async function createBooking(data: Omit<IBooking, 'id' | 'created_at'>) {
    const supabase = await createClient()
    const { error } = await supabase.from('bookings').insert([data])

    if (error) {
        console.error("Booking Error:", error.message);
        throw new Error("Failed to create booking.");
    }

    return { success: true }
}

export async function getBookings(): Promise<IBooking[]> {
    const supabase = await createClient()
    const { data, error } = await supabase.from('bookings').select('*')

    if (error) {
        console.error("Get Bookings Error:", error.message);
        throw new Error("Failed to fetch bookings.");
    }

    return data || []
}

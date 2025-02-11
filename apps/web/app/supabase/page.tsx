'use client';

import { useState } from 'react';
import {useBookingStore} from "@/stores/useBookingStore";

export default function BookingForm() {
    const [loading, setLoading] = useState(false);
    const addBooking = useBookingStore((state) => state.addBooking);

    const handleSubmit = async () => {
        setLoading(true);
        console.log("Booking...")
        try {
            await addBooking({
                restaurant_id: '9a607fa4-d164-45af-ac09-291386d45c7d',
                table_id: '018090b2-cf2c-4ed4-a9ee-b61f780bf1ca',
                customer_id: '85c5a54a-9c63-4144-99b7-8c561cd60123',
                booking_time: new Date().toISOString(),
                status: true,
            });
            alert('Booking successful!');
        } catch (error) {
            console.error(error);
            alert('Failed to book.');
        }
        setLoading(false);
    };

    return <button onClick={handleSubmit} disabled={loading}>{loading ? 'Booking...' : 'Book Now'}</button>;
}

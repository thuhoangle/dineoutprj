export interface IBooking {
  id: string;
  restaurant_id: string;
  table_id: string;
  customer_id: string;
  booking_time: string;
  status: boolean;
  created_at: string;
}

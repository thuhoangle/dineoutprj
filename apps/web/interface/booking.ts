export interface IBooking {
  id: string;
  restaurant_id: string;
  table_id: string;
  customer_id: string;
  status: string;
  time_slot: string;
  guest_num: number;
  created_at: string;
  occasion?: string;
  additional_info?: string;
}

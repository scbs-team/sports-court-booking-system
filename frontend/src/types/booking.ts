export interface Booking {
  id: string;
  courtId: string;
  userId: string;
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
}

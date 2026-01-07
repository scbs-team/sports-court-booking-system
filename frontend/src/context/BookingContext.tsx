import { createContext, useContext, useMemo, useState } from "react";

export type Booking = {
  id: string;
  court: string;
  sport: string;
  date: string;
  time: string;
  status: "Confirmed" | "Pending";
  team: string;
  price: string;
  note: string;
};

type BookingContextValue = {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, "id" | "status">) => Booking;
  updateStatus: (id: string, status: Booking["status"]) => void;
  cancelBooking: (id: string) => void;
  lastBookedDate: string | null;
  setLastBookedDate: (date: string | null) => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

const initialBookings: Booking[] = [
  {
    id: "BK-4101",
    court: "Sukhumvit Futsal Arena",
    sport: "Futsal",
    date: "2025-05-12",
    time: "7:00 PM - 8:00 PM",
    status: "Confirmed",
    team: "Eastside Smashers",
    price: "฿1,200",
    note: "Bring training bibs"
  },
  {
    id: "BK-4102",
    court: "Lumphini Tennis Court",
    sport: "Tennis",
    date: "2025-05-15",
    time: "6:30 PM - 7:30 PM",
    status: "Pending",
    team: "Blue Court Club",
    price: "฿900",
    note: "Coach session"
  },
  {
    id: "BK-4103",
    court: "Ari Badminton Hall",
    sport: "Badminton",
    date: "2025-05-15",
    time: "8:00 PM - 9:30 PM",
    status: "Confirmed",
    team: "Northpoint Juniors",
    price: "฿650",
    note: "Double court setup"
  },
  {
    id: "BK-4104",
    court: "Rama IX Sports Complex",
    sport: "Soccer",
    date: "2025-05-18",
    time: "5:00 PM - 6:00 PM",
    status: "Confirmed",
    team: "Bangkok Strikers",
    price: "฿1,500",
    note: "League warm-up"
  }
];

export const BookingProvider = ({ children }: { children: React.ReactNode }) => {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [lastBookedDate, setLastBookedDate] = useState<string | null>(null);

  const addBooking: BookingContextValue["addBooking"] = (booking) => {
    const nextId = `BK-${4100 + bookings.length + 1}`;
    const newBooking: Booking = {
      id: nextId,
      status: "Pending",
      ...booking
    };
    setBookings((prev) => [newBooking, ...prev]);
    setLastBookedDate(booking.date);
    return newBooking;
  };

  const updateStatus: BookingContextValue["updateStatus"] = (id, status) => {
    setBookings((prev) =>
      prev.map((booking) => (booking.id === id ? { ...booking, status } : booking))
    );
  };

  const cancelBooking: BookingContextValue["cancelBooking"] = (id) => {
    setBookings((prev) => prev.filter((booking) => booking.id !== id));
  };

  const value = useMemo(
    () => ({
      bookings,
      addBooking,
      updateStatus,
      cancelBooking,
      lastBookedDate,
      setLastBookedDate
    }),
    [bookings, lastBookedDate]
  );

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBookings must be used within BookingProvider");
  }
  return context;
};

import { useEffect, useMemo, useState } from "react";
import logo from "../assets/sport_court_logo.png";
import Toast from "../components/common/Toast";
import { useBookings } from "../context/BookingContext";

const Booking = () => {
  const sports = ["All", "Soccer", "Futsal", "Tennis", "Badminton", "Basketball", "Padel"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  const [currentMonth, setCurrentMonth] = useState(4);
  const [currentYear, setCurrentYear] = useState(2025);
  const [selectedDate, setSelectedDate] = useState("2025-05-15");
  const [filterSport, setFilterSport] = useState("All");
  const {
    bookings,
    addBooking,
    updateStatus,
    cancelBooking,
    lastBookedDate,
    setLastBookedDate
  } = useBookings();

  const [form, setForm] = useState({
    court: "Sukhumvit Futsal Arena",
    sport: "Futsal",
    time: "7:00 PM - 8:00 PM",
    team: ""
  });
  const [toast, setToast] = useState<{
    message: string;
    tone?: "success" | "info" | "warning";
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  useEffect(() => {
    if (!lastBookedDate) return;
    const [year, month, day] = lastBookedDate.split("-").map(Number);
    setCurrentYear(year);
    setCurrentMonth(month - 1);
    setSelectedDate(lastBookedDate);
    setLastBookedDate(null);
  }, [lastBookedDate, setLastBookedDate]);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 600);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDetailOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    setIsSearching(true);
    const timer = window.setTimeout(() => setIsSearching(false), 350);
    return () => window.clearTimeout(timer);
  }, [filterSport, selectedDate]);

  const monthLabel = `${months[currentMonth]} ${currentYear}`;

  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const startOffset = (firstDay.getDay() + 6) % 7;
    const cells = [];
    for (let i = 0; i < startOffset; i += 1) {
      cells.push({ day: null, date: "", status: "empty" });
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const count = bookings.filter((booking) => booking.date === date).length;
      const status = count >= 3 ? "booked" : count >= 1 ? "limited" : "available";
      cells.push({ day, date, status });
    }
    return cells;
  }, [currentYear, currentMonth, bookings]);

  const bookingsForDay = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesDate = booking.date === selectedDate;
      const matchesSport = filterSport === "All" || booking.sport === filterSport;
      return matchesDate && matchesSport;
    });
  }, [bookings, selectedDate, filterSport]);
  const confirmedCount = bookings.filter((booking) => booking.status === "Confirmed").length;
  const pendingCount = bookings.filter((booking) => booking.status === "Pending").length;

  const handlePrevMonth = () => {
    const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setSelectedDate(
      `${newYear}-${String(newMonth + 1).padStart(2, "0")}-01`
    );
  };

  const handleNextMonth = () => {
    const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setSelectedDate(
      `${newYear}-${String(newMonth + 1).padStart(2, "0")}-01`
    );
  };

  const handleCreateBooking = () => {
    setAttemptedSubmit(true);
    if (!form.team.trim()) {
      setToast({ message: "Add a team name to continue.", tone: "warning" });
      return;
    }
    const dateToUse =
      selectedDate ||
      `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-01`;
    const booking = addBooking({
      court: form.court,
      sport: form.sport,
      date: dateToUse,
      time: form.time,
      team: form.team,
      price: "฿900",
      note: "New booking"
    });
    setForm((prev) => ({ ...prev, team: "" }));
    setSelectedDate(dateToUse);
    setAttemptedSubmit(false);
    setToast({
      message: `Booking created for ${booking.court}.`,
      tone: "success"
    });
  };

  const handleUpdateStatus = (id: string, status: "Confirmed" | "Pending") => {
    updateStatus(id, status);
    setToast({
      message: `Booking marked as ${status.toLowerCase()}.`,
      tone: "info"
    });
  };

  const handleCancelBooking = (id: string) => {
    cancelBooking(id);
    setToast({ message: "Booking cancelled.", tone: "warning" });
  };

  const selectedBooking = bookings.find((booking) => booking.id === selectedBookingId);

  return (
    <section className="space-y-8">
      <div className="glass-card p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <img src={logo} alt="Sports Court Booking" className="h-10 w-10" />
              <h1 className="text-3xl font-semibold text-slate-900">Calendar</h1>
            </div>
            <span className="mt-3 inline-flex">
              <span className="accent-pill">Bookings & schedules</span>
            </span>
            <p className="mt-2 text-slate-600">
              Plan your sessions. Select a date and confirm or create bookings.
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Bookings support Soccer, Futsal, Tennis, Badminton, Basketball, and
              Padel with live availability by date.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
            {sports.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilterSport(item)}
                className={`ui-tab text-xs ${
                  filterSport === item ? "ui-tab--active" : "ui-tab--idle"
                }`}
              >
                {item}
              </button>
            ))}
            <button
              type="button"
              className="ui-btn text-slate-600"
              onClick={() => setFilterSport("All")}
            >
              Clear
            </button>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Total bookings", value: bookings.length },
            { label: "Confirmed", value: confirmedCount },
            { label: "Pending", value: pendingCount }
          ].map((item) => (
            <div key={item.label} className="glass-card-tight p-4 text-sm">
              <p className="text-xs text-slate-500">{item.label}</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-card-tight p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">{monthLabel}</p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900">
                Monthly availability
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="ui-btn text-slate-600"
                onClick={handlePrevMonth}
              >
                Prev
              </button>
              <button
                className="ui-btn text-slate-600"
                onClick={handleNextMonth}
              >
                Next
              </button>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-400">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => {
              if (!day.day) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="h-12 rounded-lg border border-transparent"
                  />
                );
              }
              const isSelected = day.date === selectedDate;
              const statusStyles =
                day.status === "booked"
                  ? "bg-[color:var(--accent)] text-white"
                  : day.status === "limited"
                  ? "bg-white/70 text-slate-700"
                  : "bg-white/85 text-slate-700";
              return (
                <button
                  key={day.date}
                  onClick={() => setSelectedDate(day.date)}
                  className={`flex h-12 flex-col items-center justify-center rounded-2xl border border-white/70 text-sm font-semibold ${statusStyles} ${
                    isSelected ? "ring-2 ring-slate-300/60" : ""
                  }`}
                >
                  {day.day}
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[color:var(--accent)]" /> Booked
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-slate-200" /> Limited
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full border border-slate-200 bg-white" /> Available
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-card-tight p-6">
            <h3 className="text-lg font-semibold text-slate-900">
              Bookings on {selectedDate || `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-01`}
            </h3>
          <div className="mt-4 space-y-3">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div
                    key={`booking-skeleton-${index}`}
                    className="rounded-2xl border border-white/70 bg-white/85 px-4 py-3"
                  >
                    <div className="skeleton h-4 w-2/3" />
                    <div className="mt-2 skeleton h-3 w-1/2" />
                    <div className="mt-2 skeleton h-3 w-3/4" />
                  </div>
                ))
              ) : bookingsForDay.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">
                  <p>No bookings yet for this date.</p>
                  <a
                    href="#create-booking"
                    className="mt-3 inline-flex rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                  >
                    Create a booking
                  </a>
                </div>
              ) : (
                bookingsForDay.map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-2xl border border-white/70 bg-white/85 px-4 py-3"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-900">
                        {booking.court}
                      </p>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          booking.status === "Confirmed"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {booking.time} · {booking.sport}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Team: {booking.team}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Price: {booking.price}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Note: {booking.note}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold">
                      <button
                        className="ui-btn text-slate-600 hover:border-slate-300"
                        onClick={() => handleUpdateStatus(booking.id, "Confirmed")}
                      >
                        Confirm
                      </button>
                      <button
                        className="ui-btn text-slate-600 hover:border-slate-300"
                        onClick={() => handleUpdateStatus(booking.id, "Pending")}
                      >
                        Pending
                      </button>
                      <button
                        className="ui-btn text-rose-600 hover:border-rose-200"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        Cancel
                      </button>
                      <button
                        className="ui-btn text-slate-600 hover:border-slate-300"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            team: `${booking.team} follow-up`
                          }))
                        }
                      >
                        Add to calendar
                      </button>
                      <button
                        className="ui-btn text-slate-600 hover:border-slate-300"
                        onClick={() => {
                          setSelectedBookingId(booking.id);
                          setDetailOpen(true);
                        }}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="glass-card-tight p-6" id="create-booking">
            <h3 className="text-lg font-semibold text-slate-900">
              Create a booking
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Uses the selected date. Save to see it in the list.
            </p>
            <div className="mt-4 space-y-3 text-sm">
              <input
                className="ui-input w-full"
                placeholder="Team name"
                value={form.team}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, team: event.target.value }))
                }
              />
              {attemptedSubmit && !form.team.trim() ? (
                <p className="-mt-2 text-xs text-rose-500">
                  Team name is required to book a court.
                </p>
              ) : (
                <p className="-mt-2 text-xs text-slate-500">
                  Use your team or club name to label the booking.
                </p>
              )}
              <select
                className="ui-input w-full"
                value={form.court}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, court: event.target.value }))
                }
              >
                {[
                  "Sukhumvit Futsal Arena",
                  "Lumphini Tennis Court",
                  "Ari Badminton Hall",
                  "Rama IX Sports Complex",
                  "Bangkok Padel Club"
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <select
                className="ui-input w-full"
                value={form.sport}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, sport: event.target.value }))
                }
              >
                {sports.slice(1).map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <input
                className="ui-input w-full"
                value={form.time}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, time: event.target.value }))
                }
              />
              <button
                className="ui-btn w-full border-2 border-[color:var(--accent)] bg-[color:var(--accent)] text-white hover:bg-[color:var(--accent-strong)] hover:border-[color:var(--accent-strong)]"
                onClick={handleCreateBooking}
              >
                Save booking
              </button>
            </div>
          </div>
        </div>
      </div>
      {isSearching ? (
        <p className="text-xs text-slate-500">Updating results...</p>
      ) : null}
      {toast ? (
        <Toast
          message={toast.message}
          tone={toast.tone}
          onClose={() => setToast(null)}
        />
      ) : null}
      {detailOpen && selectedBooking ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6"
          onClick={() => setDetailOpen(false)}
        >
          <div
            className="glass-card w-full max-w-md p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-slate-900">
              Booking details
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {selectedBooking.court}
            </p>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p>
                <span className="font-semibold text-slate-900">Date:</span>{" "}
                {selectedBooking.date}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Time:</span>{" "}
                {selectedBooking.time}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Team:</span>{" "}
                {selectedBooking.team}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Price:</span>{" "}
                {selectedBooking.price}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Note:</span>{" "}
                {selectedBooking.note}
              </p>
            </div>
            <div className="mt-5 flex items-center gap-2">
              <button
                className="ui-btn flex-1 border-slate-200 text-slate-600"
                onClick={() => setDetailOpen(false)}
              >
                Close
              </button>
              <button
                className="ui-btn flex-1 border-2 border-[color:var(--accent)] bg-[color:var(--accent)] text-white hover:bg-[color:var(--accent-strong)] hover:border-[color:var(--accent-strong)]"
                onClick={() => {
                  handleUpdateStatus(selectedBooking.id, "Confirmed");
                  setDetailOpen(false);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default Booking;

import { useEffect, useMemo, useState } from "react";
import logo from "../assets/sport_court_logo.png";
import { useBookings } from "../context/BookingContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const upcomingMatches = [
    {
      title: "Tennis Court 2",
      club: "Benjasiri Park Courts",
      date: "Friday, Oct 15",
      time: "12:30 PM - 1:00 PM",
      sport: "Tennis",
      level: "Intermediate",
      surface: "Outdoor · Hard",
      price: "฿900/hr",
      slots: "2 slots left",
      status: "Confirmed",
      image:
        "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Padel Indoor 1",
      club: "Sukhumvit Padel Club",
      date: "Friday, Oct 15",
      time: "4:00 PM - 5:00 PM",
      sport: "Padel",
      level: "Open Play",
      surface: "Indoor · Glass",
      price: "฿1,100/hr",
      slots: "4 slots left",
      status: "Pending",
      image:
        "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Soccer Turf 3",
      club: "Rama IX Sports Complex",
      date: "Saturday, Oct 16",
      time: "11:00 AM - 12:00 PM",
      sport: "Soccer",
      level: "League",
      surface: "Outdoor · Turf",
      price: "฿1,500/hr",
      slots: "1 slot left",
      status: "Confirmed",
      image:
        "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Badminton Court 4",
      club: "Bangkok Rackets",
      date: "Sunday, Oct 17",
      time: "6:00 PM - 7:00 PM",
      sport: "Badminton",
      level: "Doubles",
      surface: "Indoor · Synthetic",
      price: "฿650/hr",
      slots: "5 slots left",
      status: "Confirmed",
      image:
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80"
    }
  ];

  const clubs = [
    {
      name: "Benjasiri Park Courts",
      location: "Sukhumvit 22, Khlong Toei, Bangkok",
      sports: ["Tennis", "Padel", "Squash", "Pickleball"],
      rating: "4.9",
      reviews: "128",
      distance: "2.4 km",
      nextSlot: "Today 6:30 PM",
      image:
        "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80",
      mapEmbed:
        "https://www.openstreetmap.org/export/embed.html?bbox=100.5606%2C13.7240%2C100.5786%2C13.7368&layer=mapnik&marker=13.7305%2C100.5696"
    },
    {
      name: "Rama IX Sports Complex",
      location: "Huai Khwang, Bangkok",
      sports: ["Soccer", "Tennis", "Basketball"],
      rating: "4.6",
      reviews: "94",
      distance: "6.1 km",
      nextSlot: "Tomorrow 9:00 AM",
      image:
        "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=900&q=80",
      mapEmbed:
        "https://www.openstreetmap.org/export/embed.html?bbox=100.5638%2C13.7496%2C100.5824%2C13.7628&layer=mapnik&marker=13.7562%2C100.5731"
    },
    {
      name: "Bangkok Rackets",
      location: "Phaya Thai, Bangkok",
      sports: ["Tennis", "Badminton", "Pickleball"],
      rating: "4.7",
      reviews: "76",
      distance: "4.8 km",
      nextSlot: "Saturday 10:00 AM",
      image:
        "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=900&q=80",
      mapEmbed:
        "https://www.openstreetmap.org/export/embed.html?bbox=100.5295%2C13.7584%2C100.5471%2C13.7714&layer=mapnik&marker=13.7649%2C100.5383"
    }
  ];
  const { bookings } = useBookings();
  const activity = [
    {
      label: "Booking confirmed",
      detail: "Padel Indoor 1 · Friday 4:00 PM",
      time: "2h ago"
    },
    {
      label: "New invite",
      detail: "Join Bangkok Strikers · Soccer",
      time: "Yesterday"
    },
    {
      label: "Reminder",
      detail: "Tennis Court 2 · Friday 12:30 PM",
      time: "Yesterday"
    }
  ];

  const sportOptions = [
    { label: "Ping Pong", code: "PP", color: "bg-rose-100 text-rose-600" },
    { label: "Squash", code: "SQ", color: "bg-slate-100 text-slate-600" },
    { label: "Rugby", code: "RG", color: "bg-amber-100 text-amber-700" },
    { label: "Beach Volley", code: "BV", color: "bg-orange-100 text-orange-600" },
    { label: "Basketball", code: "BB", color: "bg-amber-100 text-amber-700" },
    { label: "Padel", code: "PD", color: "bg-lime-100 text-slate-900" },
    { label: "Pickleball", code: "PB", color: "bg-lime-100 text-slate-900" },
    { label: "Volleyball", code: "VB", color: "bg-orange-100 text-orange-700" },
    { label: "Soccer", code: "SC", color: "bg-emerald-100 text-emerald-700" },
    { label: "Hockey", code: "HK", color: "bg-indigo-100 text-indigo-700" },
    { label: "Golf", code: "GF", color: "bg-green-100 text-green-700" },
    { label: "Tennis", code: "TN", color: "bg-purple-100 text-purple-700" }
  ];
  const sports = sportOptions.map((item) => item.label);
  const [location, setLocation] = useState("Bangkok, Thailand");
  const [sport, setSport] = useState("Soccer");
  const [date, setDate] = useState("2024-10-12");
  const [time, setTime] = useState("12:00");
  const [activeSport, setActiveSport] = useState("All");
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [bookedClubs, setBookedClubs] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);
  const [sportModalOpen, setSportModalOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarYear, setCalendarYear] = useState(2024);
  const [calendarMonth, setCalendarMonth] = useState(9);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 600);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSportModalOpen(false);
        setCalendarOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    setIsSearching(true);
    const timer = window.setTimeout(() => setIsSearching(false), 350);
    return () => window.clearTimeout(timer);
  }, [activeSport, location, sport, date, time]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(calendarYear, calendarMonth, 1);
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const startOffset = (firstDay.getDay() + 6) % 7;
    const cells: { day: number | null; date: string }[] = [];
    for (let i = 0; i < startOffset; i += 1) {
      cells.push({ day: null, date: "" });
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      cells.push({ day, date });
    }
    return cells;
  }, [calendarYear, calendarMonth]);

  const filteredMatches = useMemo(() => {
    if (activeSport === "All") return upcomingMatches;
    return upcomingMatches.filter((match) => match.sport === activeSport);
  }, [activeSport, upcomingMatches]);

  const filteredClubs = useMemo(() => {
    if (!query) return clubs;
    const normalized = query.toLowerCase();
    return clubs.filter((club) =>
      `${club.name} ${club.location}`.toLowerCase().includes(normalized)
    );
  }, [clubs, query]);

  return (
    <section className="space-y-10">
      <div className="panel fade-up relative overflow-hidden p-8">
        <div className="absolute -right-8 top-6 h-24 w-24 rounded-2xl bg-[color:var(--accent)] opacity-10" />
        <div className="relative z-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="accent-pill">Matchday overview</span>
                <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
                  Welcome back, Maya
                </h1>
                <p className="mt-3 max-w-xl text-sm text-slate-600">
                  Book courts fast, confirm requests, and keep teams moving with
                  a single view of today’s schedule.
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Booking tip: peak hours run 6–9 PM. Lock early for best courts.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="accent-pill">Premium</span>
                <button
                  type="button"
                  className="ui-btn"
                  onClick={() => setAccountOpen((prev) => !prev)}
                >
                  {accountOpen ? "Hide account" : "Account"}
                </button>
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/80">
                  <img src={logo} alt="Profile" className="h-6 w-6" />
                </span>
              </div>
            </div>
            {accountOpen ? (
              <div className="mt-4 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-xs text-slate-600 shadow-sm">
                Account: Premium Plan · Member since 2022 · Notifications enabled
              </div>
            ) : null}
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Open courts", value: "24", detail: "Near Sukhumvit" },
                { label: "Matches today", value: "3", detail: "1 confirmed" },
                { label: "Team invites", value: "2", detail: "Waiting" }
              ].map((item) => (
                <div key={item.label} className="card text-sm">
                  <p className="text-xs text-slate-500">{item.label}</p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">
                    {item.value}
                  </p>
                  <p className="text-xs text-slate-500">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel-tight">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Quick search</p>
              <span className="text-xs text-slate-500">Bangkok region</span>
            </div>
            <div className="mt-4 grid gap-3">
              <input
                className="glass-input"
                placeholder="Location"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
              />
              <button
                type="button"
                onClick={() => setSportModalOpen(true)}
                className="glass-input flex items-center justify-between"
              >
                <span>{sport}</span>
                <svg
                  viewBox="0 0 20 20"
                  className="h-4 w-4 text-slate-400"
                  fill="currentColor"
                >
                  <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4z" />
                </svg>
              </button>
              <div className="relative">
                <button
                  type="button"
                  className="glass-input flex w-full items-center justify-between"
                  onClick={() => setCalendarOpen((prev) => !prev)}
                >
                  <span>{date}</span>
                  <svg
                    viewBox="0 0 20 20"
                    className="h-4 w-4 text-slate-400"
                    fill="currentColor"
                  >
                    <path d="M6 2a1 1 0 0 1 1 1v1h6V3a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1zm11 7H3v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9z" />
                  </svg>
                </button>
                {calendarOpen ? (
                  <div className="absolute left-0 top-12 z-50 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.4)]">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-500"
                        onClick={() => {
                          const newMonth = calendarMonth === 0 ? 11 : calendarMonth - 1;
                          const newYear = calendarMonth === 0 ? calendarYear - 1 : calendarYear;
                          setCalendarMonth(newMonth);
                          setCalendarYear(newYear);
                        }}
                      >
                        Prev
                      </button>
                      <span className="text-xs font-semibold text-slate-600">
                        {new Date(calendarYear, calendarMonth).toLocaleString("en-US", {
                          month: "long",
                          year: "numeric"
                        })}
                      </span>
                      <button
                        type="button"
                        className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-500"
                        onClick={() => {
                          const newMonth = calendarMonth === 11 ? 0 : calendarMonth + 1;
                          const newYear = calendarMonth === 11 ? calendarYear + 1 : calendarYear;
                          setCalendarMonth(newMonth);
                          setCalendarYear(newYear);
                        }}
                      >
                        Next
                      </button>
                    </div>
                    <div className="mt-3 grid grid-cols-7 gap-2 text-center text-[11px] font-semibold text-slate-400">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label) => (
                        <span key={label}>{label}</span>
                      ))}
                    </div>
                    <div className="mt-2 grid grid-cols-7 gap-2">
                      {calendarDays.map((day, index) => {
                        if (!day.day) {
                          return (
                            <div
                              key={`empty-${index}`}
                              className="h-8 rounded-md border border-transparent"
                            />
                          );
                        }
                        const isSelected = day.date === date;
                        return (
                          <button
                            key={day.date}
                            type="button"
                            onClick={() => {
                              setDate(day.date);
                              setCalendarOpen(false);
                            }}
                            className={`flex h-8 items-center justify-center rounded-md border text-xs font-semibold ${
                              isSelected
                                ? "border-[color:var(--accent)] bg-[color:var(--accent)] text-white"
                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                            }`}
                          >
                            {day.day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
              <input
                type="time"
                className="glass-input"
                value={time}
                onChange={(event) => setTime(event.target.value)}
              />
              <button
                className="ui-btn border-2 border-[color:var(--accent)] bg-[color:var(--accent)] text-white hover:bg-[color:var(--accent-strong)] hover:border-[color:var(--accent-strong)]"
                onClick={() => {
                  setActiveSport(sport);
                  setQuery("");
                  setSelectedMatch(null);
                }}
              >
                Search courts
              </button>
              {isSearching ? (
                <p className="text-xs text-slate-500">Updating results...</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="panel fade-up-delay p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Upcoming matches</h2>
            <p className="text-sm text-slate-500">
              Check confirmed and pending bookings for the week.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            {["All", ...sports].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setActiveSport(item)}
                className={`ui-tab ${
                  activeSport === item
                    ? "ui-tab--active"
                    : "ui-tab--idle"
                }`}
              >
                {item}
              </button>
            ))}
            <button
              type="button"
              className="ui-btn"
              onClick={() => setActiveSport("All")}
            >
              Clear
            </button>
          </div>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`match-skeleton-${index}`}
                className="flex gap-4 rounded-2xl border-2 border-slate-200 bg-white p-4"
              >
                <div className="skeleton h-24 w-28" />
                <div className="flex-1 space-y-3">
                  <div className="skeleton h-4 w-1/3" />
                  <div className="skeleton h-3 w-1/2" />
                  <div className="skeleton h-3 w-2/3" />
                </div>
              </div>
            ))
          ) : filteredMatches.length === 0 ? (
            <div className="col-span-full rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              No matches found. Try a different sport.
            </div>
          ) : (
            filteredMatches.map((match, index) => (
              <button
                key={match.title}
                type="button"
                onClick={() => setSelectedMatch(match.title)}
                className={`group flex gap-4 rounded-2xl border-2 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-40px_rgba(15,23,42,0.35)] ${
                  selectedMatch === match.title
                    ? "border-slate-900"
                    : "border-slate-200"
                }`}
              >
                <div className="h-24 w-28 overflow-hidden rounded-xl">
                  <img
                    src={match.image}
                    alt={`${match.sport} court`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{match.sport}</span>
                      <span>Match {index + 1}</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      {match.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{match.club}</p>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                    <span>{match.date}</span>
                    <span>·</span>
                    <span>{match.time}</span>
                    <span className="ml-auto font-semibold text-slate-900">
                      {match.price}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                      {match.level}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 ${
                        match.status === "Confirmed"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {match.status}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-500">
                      {match.slots}
                    </span>
                    <Link
                      to="/booking"
                      className="ml-auto text-xs font-semibold text-[color:var(--accent)]"
                    >
                      View calendar
                    </Link>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="panel fade-up-delay p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Clubs near you</h2>
            <p className="text-sm text-slate-500">
              Book another session or check availability.
            </p>
          </div>
          <input
            className="ui-input w-full sm:w-72"
            placeholder="Search a club or address"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`club-skeleton-${index}`}
                className="rounded-2xl border-2 border-slate-200 bg-white p-5"
              >
                <div className="skeleton h-32 w-full" />
                <div className="mt-4 space-y-2">
                  <div className="skeleton h-4 w-2/3" />
                  <div className="skeleton h-3 w-1/2" />
                  <div className="skeleton h-3 w-3/4" />
                </div>
              </div>
            ))
          ) : filteredClubs.length === 0 ? (
            <div className="col-span-full rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              No clubs match your search. Try another location.
            </div>
          ) : (
            filteredClubs.map((club) => (
              <div key={club.name} className="card">
                <div className="mb-4 h-32 w-full overflow-hidden rounded-2xl">
                  <img
                    src={club.image}
                    alt={`${club.name} courts`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {club.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{club.location}</p>
                  </div>
                  <span className="rounded-full bg-[color:var(--accent)] px-3 py-1 text-xs font-semibold text-white">
                    {club.rating}
                  </span>
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  {club.distance} · {club.reviews} reviews
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                  {club.sports.map((clubSport) => (
                    <span
                      key={clubSport}
                      className="rounded-full border-2 border-slate-200 bg-white px-3 py-1"
                    >
                      {clubSport}
                    </span>
                  ))}
                </div>
                <div className="mt-4 overflow-hidden rounded-2xl border-2 border-slate-200">
                  <iframe
                    title={`${club.name} map`}
                    src={club.mapEmbed}
                    className="h-24 w-full"
                  />
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span>Next slot: {club.nextSlot}</span>
                  <button
                    className={`ui-btn ${
                      bookedClubs[club.name]
                        ? "bg-slate-200 text-slate-700"
                        : "border-2 border-[color:var(--accent)] bg-[color:var(--accent)] text-white hover:bg-[color:var(--accent-strong)] hover:border-[color:var(--accent-strong)]"
                    }`}
                    onClick={() =>
                      setBookedClubs((prev) => ({
                        ...prev,
                        [club.name]: !prev[club.name]
                      }))
                    }
                  >
                    {bookedClubs[club.name] ? "Booked" : "Book"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="panel-tight">
          <h3 className="text-lg font-semibold text-slate-900">Recent activity</h3>
          <p className="mt-1 text-sm text-slate-500">
            Updates from your latest bookings and teams.
          </p>
          <div className="mt-4 space-y-3">
            {isLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`activity-skeleton-${index}`}
                    className="rounded-2xl border-2 border-slate-200 bg-white px-4 py-3"
                  >
                    <div className="skeleton h-4 w-1/2" />
                    <div className="mt-2 skeleton h-3 w-3/4" />
                  </div>
                ))
              : [...activity, ...bookings.slice(0, 2).map((booking) => ({
                  label:
                    booking.status === "Confirmed"
                      ? "Booking confirmed"
                      : "Booking pending",
                  detail: `${booking.court} · ${booking.time}`,
                  time: "Just now"
                }))].map((item) => (
                  <div
                    key={item.label + item.time}
                    className="rounded-2xl border-2 border-slate-200 bg-white px-4 py-3"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-slate-900">
                        {item.label}
                      </span>
                      <span className="text-xs text-slate-400">{item.time}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{item.detail}</p>
                  </div>
                ))}
          </div>
        </div>
        <div className="panel-tight">
          <h3 className="text-lg font-semibold text-slate-900">Saved sports</h3>
          <p className="mt-1 text-sm text-slate-500">
            Quick access to your favorite sports.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {["Soccer", "Padel", "Tennis", "Badminton"].map((item) => (
              <button
                key={item}
                type="button"
                className="ui-tab ui-tab--idle"
                onClick={() => setActiveSport(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border-2 border-dashed border-slate-200 bg-white px-4 py-3 text-xs text-slate-500">
            Tip: tap a sport to filter your next matches instantly.
          </div>
        </div>
      </div>

      {sportModalOpen ? (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/40 p-4"
          onClick={() => setSportModalOpen(false)}
        >
          <div
            className="panel w-full max-w-xl p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Choose your sport
              </h3>
              <button
                type="button"
                className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-500"
                onClick={() => setSportModalOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {sportOptions.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => {
                    setSport(option.label);
                    setActiveSport(option.label);
                    setSportModalOpen(false);
                  }}
                  className={`flex flex-col items-center gap-2 rounded-2xl border-2 px-3 py-4 text-xs font-semibold transition ${
                    sport === option.label
                      ? "border-[color:var(--accent)] bg-[color:var(--accent)] text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${option.color}`}
                  >
                    {option.code}
                  </span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default Dashboard

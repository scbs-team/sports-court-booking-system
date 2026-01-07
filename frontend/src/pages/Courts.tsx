import { useEffect, useMemo, useState } from "react";
import logo from "../assets/sport_court_logo.png";
import Toast from "../components/common/Toast";
import { useBookings } from "../context/BookingContext";
import { useNavigate } from "react-router-dom";

const Courts = () => {
  const [courts, setCourts] = useState([
    {
      id: "CT-01",
      name: "Sukhumvit Futsal Arena",
      sport: "Futsal",
      surface: "Turf",
      type: "Indoor",
      status: "Open",
      nextSlot: "Today 6:30 PM",
      utilization: 82,
      price: 1200,
      location: "Sukhumvit 71, Bangkok",
      distance: "3.1 km",
      rating: "4.8",
      reviews: "112",
      capacity: "10 players",
      amenities: ["Lights", "Parking", "Locker"],
      mapEmbed:
        "https://www.openstreetmap.org/export/embed.html?bbox=100.5902%2C13.7119%2C100.6104%2C13.7235&layer=mapnik&marker=13.7176%2C100.6003",
      image:
        "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=900&q=80",
      saved: false,
      booked: false
    },
    {
      id: "CT-02",
      name: "Lumphini Tennis Court",
      sport: "Tennis",
      surface: "Clay",
      type: "Outdoor",
      status: "Maintenance",
      nextSlot: "Tomorrow 8:00 AM",
      utilization: 64,
      price: 900,
      location: "Lumphini, Bangkok",
      distance: "5.4 km",
      rating: "4.6",
      reviews: "88",
      capacity: "4 players",
      amenities: ["Shade", "Parking"],
      mapEmbed:
        "https://www.openstreetmap.org/export/embed.html?bbox=100.5376%2C13.7281%2C100.5572%2C13.7398&layer=mapnik&marker=13.7340%2C100.5473",
      image:
        "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=900&q=80",
      saved: false,
      booked: false
    },
    {
      id: "CT-03",
      name: "Ari Badminton Hall",
      sport: "Badminton",
      surface: "Synthetic",
      type: "Indoor",
      status: "Open",
      nextSlot: "Today 7:15 PM",
      utilization: 91,
      price: 650,
      location: "Ari, Bangkok",
      distance: "2.2 km",
      rating: "4.9",
      reviews: "142",
      capacity: "4 players",
      amenities: ["AC", "Pro shop"],
      mapEmbed:
        "https://www.openstreetmap.org/export/embed.html?bbox=100.5422%2C13.7726%2C100.5604%2C13.7844&layer=mapnik&marker=13.7785%2C100.5513",
      image:
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80",
      saved: true,
      booked: false
    },
    {
      id: "CT-04",
      name: "Thonglor Basketball Court",
      sport: "Basketball",
      surface: "Acrylic",
      type: "Outdoor",
      status: "Limited",
      nextSlot: "Today 5:45 PM",
      utilization: 73,
      price: 800,
      location: "Thonglor, Bangkok",
      distance: "4.0 km",
      rating: "4.4",
      reviews: "64",
      capacity: "10 players",
      amenities: ["Lights", "Parking"],
      mapEmbed:
        "https://www.openstreetmap.org/export/embed.html?bbox=100.5740%2C13.7268%2C100.5926%2C13.7388&layer=mapnik&marker=13.7328%2C100.5833",
      image:
        "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=900&q=80",
      saved: false,
      booked: false
    },
    {
      id: "CT-05",
      name: "Rama IX Sports Complex",
      sport: "Soccer",
      surface: "Turf",
      type: "Outdoor",
      status: "Open",
      nextSlot: "Today 9:00 PM",
      utilization: 58,
      price: 1500,
      location: "Rama IX, Bangkok",
      distance: "6.8 km",
      rating: "4.7",
      reviews: "97",
      capacity: "14 players",
      amenities: ["Lights", "Cafeteria", "Parking"],
      mapEmbed:
        "https://www.openstreetmap.org/export/embed.html?bbox=100.5646%2C13.7458%2C100.5832%2C13.7582&layer=mapnik&marker=13.7520%2C100.5738",
      image:
        "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=900&q=80",
      saved: false,
      booked: false
    },
    {
      id: "CT-06",
      name: "Bangkok Padel Club",
      sport: "Padel",
      surface: "Synthetic",
      type: "Indoor",
      status: "Open",
      nextSlot: "Tomorrow 6:00 PM",
      utilization: 49,
      price: 1100,
      location: "Phrom Phong, Bangkok",
      distance: "1.8 km",
      rating: "4.8",
      reviews: "105",
      capacity: "4 players",
      amenities: ["AC", "Locker", "Cafe"],
      mapEmbed:
        "https://www.openstreetmap.org/export/embed.html?bbox=100.5632%2C13.7247%2C100.5812%2C13.7369&layer=mapnik&marker=13.7308%2C100.5721",
      image:
        "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=900&q=80",
      saved: false,
      booked: false
    }
  ]);

  const sports = ["All", "Soccer", "Futsal", "Tennis", "Badminton", "Basketball", "Padel"];
  const types = ["All", "Indoor", "Outdoor"];
  const [activeSport, setActiveSport] = useState("All");
  const [activeType, setActiveType] = useState("All");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("Recommended");
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedCourtId, setSelectedCourtId] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState("6:00 PM");
  const [successOpen, setSuccessOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    tone?: "success" | "info" | "warning";
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const { addBooking } = useBookings();
  const navigate = useNavigate();
  const slots = [
    { time: "5:00 PM", status: "available" },
    { time: "6:00 PM", status: "limited" },
    { time: "7:00 PM", status: "available" },
    { time: "8:30 PM", status: "booked" }
  ];
  const selectedCourt = courts.find((court) => court.id === selectedCourtId);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 600);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setBookingModalOpen(false);
        setSummaryOpen(false);
        setSuccessOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    setIsSearching(true);
    const timer = window.setTimeout(() => setIsSearching(false), 350);
    return () => window.clearTimeout(timer);
  }, [activeSport, activeType, query, sortBy]);

  const filteredCourts = useMemo(() => {
    const filtered = courts.filter((court) => {
      const matchesSport = activeSport === "All" || court.sport === activeSport;
      const matchesType = activeType === "All" || court.type === activeType;
      const matchesQuery = `${court.name} ${court.location}`
        .toLowerCase()
        .includes(query.toLowerCase());
      return matchesSport && matchesType && matchesQuery;
    });
    const sorted = [...filtered];
    if (sortBy === "Price") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === "Distance") {
      sorted.sort(
        (a, b) => parseFloat(a.distance) - parseFloat(b.distance)
      );
    } else if (sortBy === "Rating") {
      sorted.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    }
    return sorted;
  }, [courts, activeSport, activeType, query, sortBy]);

  const toggleSave = (id: string) => {
    setCourts((prev) =>
      prev.map((court) =>
        court.id === id ? { ...court, saved: !court.saved } : court
      )
    );
  };

  const toggleBook = (id: string) => {
    const court = courts.find((item) => item.id === id);
    if (court?.booked) {
      setToast({ message: "This court is already booked.", tone: "warning" });
      return;
    }
    setSelectedCourtId(id);
    setBookingModalOpen(true);
  };

  return (
    <section className="space-y-8">
      <div className="glass-card p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <img src={logo} alt="Sports Court Booking" className="h-10 w-10" />
              <h1 className="text-3xl font-semibold text-slate-900">Courts</h1>
            </div>
            <span className="mt-3 inline-flex">
              <span className="accent-pill">Find your next game</span>
            </span>
            <p className="mt-2 text-slate-600">
              Browse and book courts in Bangkok. Filter by sport and type.
            </p>
            <p className="mt-2 text-xs text-slate-500">
              See surface, capacity, and next available slot before you book.
            </p>
          </div>
          <div className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm">
            {filteredCourts.length} courts available
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="glass-card-tight p-6">
          <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
          <div className="mt-4 space-y-4">
            <input
              className="ui-input"
              placeholder="Search by club or location"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <div>
              <p className="text-xs font-semibold text-slate-500">Sport</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {sports.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setActiveSport(item)}
                    className={`ui-tab text-xs ${
                      activeSport === item ? "ui-tab--active" : "ui-tab--idle"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Type</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {types.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setActiveType(item)}
                    className={`ui-tab text-xs ${
                      activeType === item ? "ui-tab--active" : "ui-tab--idle"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Sort</p>
              <select
                className="ui-input mt-2"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                {["Recommended", "Price", "Distance", "Rating"].map((item) => (
                  <option key={item} value={item}>
                    Sort: {item}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className="ui-btn w-full text-slate-600"
              onClick={() => {
                setActiveSport("All");
                setActiveType("All");
                setQuery("");
                setSortBy("Recommended");
              }}
            >
              Reset filters
            </button>
            {isSearching ? (
              <p className="text-xs text-slate-500">Updating results...</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`court-skeleton-${index}`}
                className="flex flex-col gap-4 rounded-2xl border border-white/70 bg-white/85 p-4 sm:flex-row"
              >
                <div className="skeleton h-36 w-full sm:w-40" />
                <div className="flex-1 space-y-3">
                  <div className="skeleton h-4 w-2/3" />
                  <div className="skeleton h-3 w-1/2" />
                  <div className="skeleton h-3 w-3/4" />
                  <div className="skeleton h-8 w-full" />
                </div>
              </div>
            ))
          ) : filteredCourts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
              No courts match your filters. Try resetting search or filters.
              <div className="mt-4">
                <button
                  type="button"
                  className="ui-btn"
                  onClick={() => {
                    setActiveSport("All");
                    setActiveType("All");
                    setQuery("");
                    setSortBy("Recommended");
                  }}
                >
                  Reset filters
                </button>
              </div>
            </div>
          ) : (
            filteredCourts.map((court) => (
              <div
                key={court.id}
                className="flex flex-col gap-4 rounded-2xl border border-white/70 bg-white/85 p-4 shadow-[0_24px_60px_-50px_rgba(15,23,42,0.5)] sm:flex-row"
              >
                <div className="h-36 w-full overflow-hidden rounded-lg sm:w-44">
                  <img
                    src={court.image}
                    alt={`${court.name} court`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {court.name}
                      </h3>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          court.status === "Open"
                            ? "bg-emerald-100 text-emerald-700"
                            : court.status === "Maintenance"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {court.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      {court.sport} · {court.surface} · {court.type}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{court.location}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span>{court.distance}</span>
                      <span>·</span>
                      <span>{court.rating} rating</span>
                      <span>·</span>
                      <span>{court.reviews} reviews</span>
                    </div>
                  </div>
                  <div className="grid gap-3 text-xs text-slate-500 sm:grid-cols-3">
                    <div>
                      <p className="text-slate-400">Next slot</p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {court.nextSlot}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">Price</p>
                      <p className="mt-1 font-semibold text-slate-900">
                        ฿{court.price}/hr
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">Capacity</p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {court.capacity}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Utilization</span>
                      <span className="font-semibold text-slate-900">
                        {court.utilization}%
                      </span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-[color:var(--accent)]"
                        style={{ width: `${court.utilization}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-slate-500">
                    {court.amenities.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/70 bg-white/80 px-2 py-1"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        court.location
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="ui-btn text-slate-600"
                    >
                      Open map
                    </a>
                    <button
                      type="button"
                      onClick={() => toggleBook(court.id)}
                      className={`ui-btn ${
                        court.booked
                          ? "border-2 border-slate-200 bg-slate-100 text-slate-600"
                          : "border-2 border-[color:var(--accent)] bg-[color:var(--accent)] text-white hover:bg-[color:var(--accent-strong)] hover:border-[color:var(--accent-strong)]"
                      }`}
                    >
                      {court.booked ? "Booked" : "Book"}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleSave(court.id)}
                      className={`ui-btn ${
                        court.saved
                          ? "border-2 border-[color:var(--accent)] bg-[color:var(--accent)] text-white hover:bg-[color:var(--accent-strong)] hover:border-[color:var(--accent-strong)]"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {court.saved ? "Saved" : "Save"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {bookingModalOpen && selectedCourt ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6"
          onClick={() => setBookingModalOpen(false)}
        >
          <div
            className="glass-card w-full max-w-md p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-slate-900">
              Book {selectedCourt.name}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Choose a time slot and confirm your booking.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {slots.map((slot) => (
                <button
                  key={slot.time}
                  type="button"
                  onClick={() => setSelectedSlot(slot.time)}
                  disabled={slot.status === "booked"}
                  className={`ui-tab ${
                    selectedSlot === slot.time
                      ? "ui-tab--active"
                      : slot.status === "limited"
                      ? "border-amber-200 bg-amber-50 text-amber-700"
                      : slot.status === "booked"
                      ? "border-slate-200 bg-slate-100 text-slate-400"
                      : "ui-tab--idle"
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-500">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[color:var(--accent)]" /> Available
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400" /> Limited
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-300" /> Booked
              </span>
            </div>
            <div className="mt-5 flex items-center gap-2">
              <button
                type="button"
                className="ui-btn flex-1 border-slate-200 text-slate-600"
                onClick={() => setBookingModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="ui-btn flex-1 border-2 border-[color:var(--accent)] bg-[color:var(--accent)] text-white hover:bg-[color:var(--accent-strong)] hover:border-[color:var(--accent-strong)]"
                onClick={() => {
                  setBookingModalOpen(false);
                  setSummaryOpen(true);
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {summaryOpen && selectedCourt ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6"
          onClick={() => setSummaryOpen(false)}
        >
          <div
            className="glass-card w-full max-w-md p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-slate-900">
              Booking summary
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Review details before confirming.
            </p>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p>
                <span className="font-semibold text-slate-900">Court:</span>{" "}
                {selectedCourt.name}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Sport:</span>{" "}
                {selectedCourt.sport}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Time:</span>{" "}
                {selectedSlot} - 1 hr
              </p>
              <p>
                <span className="font-semibold text-slate-900">Price:</span> ฿
                {selectedCourt.price}
              </p>
              <p className="text-xs text-slate-500">
                Free cancellation up to 2 hours before start.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-2">
              <button
                type="button"
                className="ui-btn flex-1 border-slate-200 text-slate-600"
                onClick={() => setSummaryOpen(false)}
              >
                Back
              </button>
              <button
                type="button"
                className="ui-btn flex-1 border-2 border-[color:var(--accent)] bg-[color:var(--accent)] text-white hover:bg-[color:var(--accent-strong)] hover:border-[color:var(--accent-strong)]"
                onClick={() => {
                  setCourts((prev) =>
                    prev.map((court) =>
                      court.id === selectedCourt.id
                        ? { ...court, booked: true }
                        : court
                    )
                  );
                  setSummaryOpen(false);
                  addBooking({
                    court: selectedCourt.name,
                    sport: selectedCourt.sport,
                    date: "2025-05-15",
                    time: `${selectedSlot} - 1 hr`,
                    team: "Your team",
                    price: `฿${selectedCourt.price}`,
                    note: "Booked from Courts"
                  });
                  setSuccessOpen(true);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {successOpen && selectedCourt ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6"
          onClick={() => setSuccessOpen(false)}
        >
          <div
            className="glass-card w-full max-w-sm p-6 text-center"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              ✓
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              Booking confirmed
            </h3>
            <p className="mt-2 text-xs text-slate-500">
              {selectedCourt.name} · {selectedSlot}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                className="ui-btn flex-1 border-slate-200 text-slate-600"
                onClick={() => setSuccessOpen(false)}
              >
                Book another
              </button>
              <button
                type="button"
                className="ui-btn flex-1 border-2 border-[color:var(--accent)] bg-[color:var(--accent)] text-white hover:bg-[color:var(--accent-strong)] hover:border-[color:var(--accent-strong)]"
                onClick={() => navigate("/booking")}
              >
                View calendar
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {toast ? (
        <Toast
          message={toast.message}
          tone={toast.tone}
          onClose={() => setToast(null)}
        />
      ) : null}
    </section>
  );
};

export default Courts;

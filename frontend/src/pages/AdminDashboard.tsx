import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");

  const handleSignOut = () => {
    window.localStorage.removeItem("sc_role");
    navigate("/auth", { replace: true });
  };
  const navItems = [
    { label: "Overview", meta: "7 alerts" },
    { label: "Courts", meta: "28 courts" },
    { label: "Bookings", meta: "126 pending" },
    { label: "Users", meta: "1,280 users" },
    { label: "Teams", meta: "84 teams" },
    { label: "Reports", meta: "May 2025" }
  ];

  const metrics = [
    { label: "Active courts", value: "28", helper: "2 in maintenance" },
    { label: "Monthly bookings", value: "1,248", helper: "+6.4% vs Apr" },
    { label: "Revenue", value: "$42,680", helper: "+12.2% growth" },
    { label: "Utilization", value: "78%", helper: "Peak 6-9 PM" }
  ];

  const [courts, setCourts] = useState([
    {
      id: "CRT-024",
      name: "Sukhumvit Futsal Arena",
      sport: "Futsal",
      status: "Open",
      rate: "$120/hr",
      capacity: "10 players"
    },
    {
      id: "CRT-031",
      name: "Lumphini Tennis Court",
      sport: "Tennis",
      status: "Maintenance",
      rate: "$95/hr",
      capacity: "4 players"
    },
    {
      id: "CRT-018",
      name: "Ari Badminton Hall",
      sport: "Badminton",
      status: "Open",
      rate: "$80/hr",
      capacity: "4 players"
    },
    {
      id: "CRT-042",
      name: "Thonglor Basketball Court",
      sport: "Basketball",
      status: "Limited",
      rate: "$110/hr",
      capacity: "10 players"
    }
  ]);

  const [bookings, setBookings] = useState([
    {
      id: "BK-4491",
      club: "Greenwood Club",
      court: "Court 02",
      time: "May 20 · 7:30 PM",
      status: "Pending",
      amount: "$110"
    },
    {
      id: "BK-4527",
      club: "Blue Court Club",
      court: "Court 07",
      time: "May 21 · 6:00 PM",
      status: "Approved",
      amount: "$95"
    },
    {
      id: "BK-4558",
      club: "Westline Juniors",
      court: "Court 05",
      time: "May 22 · 8:00 PM",
      status: "Pending",
      amount: "$120"
    }
  ]);

  const [users, setUsers] = useState([
    { id: "USR-102", name: "Maya Adams", role: "User", club: "Eastside Sports Club" },
    { id: "USR-118", name: "Levi Park", role: "User", club: "Northpoint Juniors" },
    { id: "ADM-009", name: "Jordan Lee", role: "Admin", club: "Facility Ops" }
  ]);

  const teams = [
    { id: "TM-014", name: "Eastside Smashers", division: "Premier", members: 18 },
    { id: "TM-031", name: "Northpoint Juniors", division: "U18", members: 14 },
    { id: "TM-062", name: "Blue Court Club", division: "Open", members: 22 }
  ];

  const reports = [
    { id: "RP-2205", title: "Revenue Summary", date: "May 2025", status: "Ready" },
    { id: "RP-2206", title: "Court Utilization", date: "May 2025", status: "Ready" },
    { id: "RP-2207", title: "Booking Trends", date: "May 2025", status: "Draft" }
  ];

  const [courtForm, setCourtForm] = useState({
    mode: "create" as "create" | "edit",
    open: false,
    id: "",
    name: "",
    sport: "",
    status: "Open",
    rate: "",
    capacity: ""
  });

  const [userForm, setUserForm] = useState({
    mode: "create" as "create" | "edit",
    open: false,
    id: "",
    name: "",
    role: "User",
    club: ""
  });

  const [bookingForm, setBookingForm] = useState({
    mode: "create" as "create" | "edit",
    open: false,
    id: "",
    club: "",
    court: "",
    time: "",
    status: "Pending",
    amount: ""
  });

  const openCreateCourt = () => {
    setCourtForm({
      mode: "create",
      open: true,
      id: "",
      name: "",
      sport: "",
      status: "Open",
      rate: "",
      capacity: ""
    });
  };

  const openEditCourt = (id: string) => {
    const court = courts.find((item) => item.id === id);
    if (!court) return;
    setCourtForm({
      mode: "edit",
      open: true,
      id: court.id,
      name: court.name,
      sport: court.sport,
      status: court.status,
      rate: court.rate,
      capacity: court.capacity
    });
  };

  const submitCourtForm = () => {
    if (!courtForm.name || !courtForm.sport) return;
    if (courtForm.mode === "create") {
      const nextId = `CRT-${(100 + courts.length + 1).toString().padStart(3, "0")}`;
      setCourts((prev) => [
        {
          id: nextId,
          name: courtForm.name,
          sport: courtForm.sport,
          status: courtForm.status,
          rate: courtForm.rate || "$100/hr",
          capacity: courtForm.capacity || "10 players"
        },
        ...prev
      ]);
    } else {
      setCourts((prev) =>
        prev.map((court) =>
          court.id === courtForm.id
            ? {
                ...court,
                name: courtForm.name,
                sport: courtForm.sport,
                status: courtForm.status,
                rate: courtForm.rate,
                capacity: courtForm.capacity
              }
            : court
        )
      );
    }
    setCourtForm((prev) => ({ ...prev, open: false }));
  };

  const openCreateUser = () => {
    setUserForm({
      mode: "create",
      open: true,
      id: "",
      name: "",
      role: "User",
      club: ""
    });
  };

  const openEditUser = (id: string) => {
    const user = users.find((item) => item.id === id);
    if (!user) return;
    setUserForm({
      mode: "edit",
      open: true,
      id: user.id,
      name: user.name,
      role: user.role,
      club: user.club
    });
  };

  const submitUserForm = () => {
    if (!userForm.name) return;
    if (userForm.mode === "create") {
      const nextId = `USR-${(120 + users.length + 1).toString().padStart(3, "0")}`;
      setUsers((prev) => [
        {
          id: nextId,
          name: userForm.name,
          role: userForm.role,
          club: userForm.club || "Bangkok City Club"
        },
        ...prev
      ]);
    } else {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userForm.id
            ? { ...user, name: userForm.name, role: userForm.role, club: userForm.club }
            : user
        )
      );
    }
    setUserForm((prev) => ({ ...prev, open: false }));
  };

  const openCreateBooking = () => {
    setBookingForm({
      mode: "create",
      open: true,
      id: "",
      club: "",
      court: "",
      time: "",
      status: "Pending",
      amount: ""
    });
  };

  const openEditBooking = (id: string) => {
    const booking = bookings.find((item) => item.id === id);
    if (!booking) return;
    setBookingForm({
      mode: "edit",
      open: true,
      id: booking.id,
      club: booking.club,
      court: booking.court,
      time: booking.time,
      status: booking.status,
      amount: booking.amount
    });
  };

  const submitBookingForm = () => {
    if (!bookingForm.club || !bookingForm.court) return;
    if (bookingForm.mode === "create") {
      const nextId = `BK-${4500 + bookings.length + 1}`;
      setBookings((prev) => [
        {
          id: nextId,
          club: bookingForm.club,
          court: bookingForm.court,
          time: bookingForm.time || "May 24 · 6:30 PM",
          status: bookingForm.status,
          amount: bookingForm.amount || "$100"
        },
        ...prev
      ]);
    } else {
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingForm.id
            ? {
                ...booking,
                club: bookingForm.club,
                court: bookingForm.court,
                time: bookingForm.time,
                status: bookingForm.status,
                amount: bookingForm.amount
              }
            : booking
        )
      );
    }
    setBookingForm((prev) => ({ ...prev, open: false }));
  };

  const handleUpdateBookingStatus = (id: string, status: "Approved" | "Pending") => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === id ? { ...booking, status } : booking
      )
    );
  };

  const handleDeleteCourt = (id: string) => {
    setCourts((prev) => prev.filter((court) => court.id !== id));
  };

  const handleDeleteUser = (id: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  const handleDeleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((booking) => booking.id !== id));
  };

  const renderOverview = () => (
    <>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((item) => (
          <div
            key={item.label}
            className="glass-card-tight p-4"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              {item.label}
            </p>
            <p className="mt-3 text-xl font-semibold text-slate-900">
              {item.value}
            </p>
            <p className="mt-1 text-sm text-slate-500">{item.helper}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Courts</h3>
              <p className="text-sm text-slate-500">
                Update availability, pricing, and capacity.
              </p>
            </div>
            <button className="ui-btn">
              Manage courts
            </button>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {courts.map((court) => (
              <div
                key={court.id}
                className="glass-card-tight p-4 text-sm"
              >
                <p className="font-semibold text-slate-900">{court.name}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {court.sport} - {court.rate}
                </p>
                <span
                  className={`mt-3 inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                    court.status === "Open"
                      ? "bg-emerald-100 text-emerald-700"
                      : court.status === "Limited"
                    ? "bg-orange-100 text-orange-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {court.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Bookings</h3>
              <p className="text-sm text-slate-500">
                Pending approvals and revenue snapshot.
              </p>
            </div>
            <button className="ui-btn">
              Review queue
            </button>
          </div>
          <div className="mt-4 space-y-3 text-sm">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-start justify-between rounded-2xl border border-white/70 bg-white/85 px-4 py-3"
              >
                <div>
                  <p className="font-semibold text-slate-900">{booking.club}</p>
                  <p className="text-xs text-slate-500">
                    {booking.court} - {booking.time}
                  </p>
                  <p className="text-xs text-slate-500">{booking.amount}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    booking.status === "Approved"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderCourts = () => (
    <div className="mt-6 glass-card-tight p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Courts</h3>
          <p className="text-sm text-slate-500">Create, edit, and remove courts.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openCreateCourt}
            className="ui-btn border-slate-900 bg-slate-900 text-white"
          >
            Create court
          </button>
          <button className="ui-btn">
            Bulk update
          </button>
        </div>
      </div>
      <div className="mt-4 overflow-x-auto">
        <div className="min-w-[720px] rounded-2xl border border-white/70 bg-white/80">
          <div className="grid grid-cols-[0.9fr_1.7fr_0.9fr_0.9fr_1fr] gap-4 border-b border-white/70 bg-white/80 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <span>ID</span>
            <span>Court</span>
            <span>Sport</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>
          {courts.map((court) => (
            <div
              key={court.id}
              className="grid grid-cols-[0.9fr_1.7fr_0.9fr_0.9fr_1fr] gap-4 border-b border-white/70 px-4 py-3 text-sm text-slate-700"
            >
              <span className="font-semibold text-slate-900">{court.id}</span>
              <div>
                <p className="font-semibold text-slate-900">{court.name}</p>
                <p className="text-xs text-slate-500">
                  {court.rate} - {court.capacity}
                </p>
              </div>
              <span>{court.sport}</span>
              <span
                className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                  court.status === "Open"
                    ? "bg-emerald-100 text-emerald-700"
                    : court.status === "Limited"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {court.status}
              </span>
              <div className="flex justify-end gap-2 text-xs font-semibold">
                <button
                  onClick={() => openEditCourt(court.id)}
                  className="ui-btn"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCourt(court.id)}
                  className="ui-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="mt-6 glass-card-tight p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Users</h3>
          <p className="text-sm text-slate-500">Manage roles and access.</p>
        </div>
        <button
          onClick={openCreateUser}
          className="ui-btn border-slate-900 bg-slate-900 text-white"
        >
          Create user
        </button>
      </div>
      <div className="mt-4 overflow-x-auto">
        <div className="min-w-[640px] rounded-2xl border border-white/70 bg-white/80">
          <div className="grid grid-cols-[0.9fr_1.4fr_1fr_0.8fr_1fr] gap-4 border-b border-white/70 bg-white/80 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <span>ID</span>
            <span>Name</span>
            <span>Club</span>
            <span>Role</span>
            <span className="text-right">Actions</span>
          </div>
          {users.map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-[0.9fr_1.4fr_1fr_0.8fr_1fr] gap-4 border-b border-white/70 px-4 py-3 text-sm text-slate-700"
            >
              <span className="font-semibold text-slate-900">{user.id}</span>
              <span className="font-semibold text-slate-900">{user.name}</span>
              <span>{user.club}</span>
              <span className="inline-flex w-fit rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                {user.role}
              </span>
              <div className="flex justify-end gap-2 text-xs font-semibold">
                <button
                  onClick={() => openEditUser(user.id)}
                  className="ui-btn"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="ui-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="mt-6 glass-card-tight p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Bookings</h3>
          <p className="text-sm text-slate-500">Approve and manage requests.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openCreateBooking}
            className="ui-btn border-slate-900 bg-slate-900 text-white"
          >
            Create booking
          </button>
          <button className="ui-btn">
            Review queue
          </button>
        </div>
      </div>
      <div className="mt-4 overflow-x-auto">
        <div className="min-w-[680px] rounded-2xl border border-white/70 bg-white/80">
          <div className="grid grid-cols-[0.9fr_1.2fr_1fr_1fr_0.8fr_1fr] gap-4 border-b border-white/70 bg-white/80 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <span>ID</span>
            <span>Club</span>
            <span>Court</span>
            <span>Time</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="grid grid-cols-[0.9fr_1.2fr_1fr_1fr_0.8fr_1fr] gap-4 border-b border-white/70 px-4 py-3 text-sm text-slate-700"
            >
              <span className="font-semibold text-slate-900">{booking.id}</span>
              <span>{booking.club}</span>
              <span>{booking.court}</span>
              <span>{booking.time}</span>
              <span
                className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                  booking.status === "Approved"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {booking.status}
              </span>
              <div className="flex justify-end gap-2 text-xs font-semibold">
                <button
                  onClick={() => handleUpdateBookingStatus(booking.id, "Approved")}
                  className="ui-btn"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleUpdateBookingStatus(booking.id, "Pending")}
                  className="ui-btn"
                >
                  Reject
                </button>
                <button
                  onClick={() => openEditBooking(booking.id)}
                  className="ui-btn"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteBooking(booking.id)}
                  className="ui-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTeams = () => (
    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {teams.map((team) => (
        <div
          key={team.id}
          className="card"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            {team.id}
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{team.name}</p>
          <p className="mt-1 text-sm text-slate-500">
            Division: {team.division}
          </p>
          <p className="mt-3 text-sm font-semibold text-slate-900">
            {team.members} members
          </p>
          <div className="mt-4 flex gap-2 text-xs font-semibold">
            <button className="ui-btn">
              View
            </button>
            <button className="ui-btn">
              Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderReports = () => (
    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {reports.map((report) => (
        <div
          key={report.id}
          className="card"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            {report.id}
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900">
            {report.title}
          </p>
          <p className="mt-1 text-sm text-slate-500">{report.date}</p>
          <span
            className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              report.status === "Ready"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {report.status}
          </span>
          <div className="mt-4 flex gap-2 text-xs font-semibold">
            <button className="ui-btn">
              Download
            </button>
            <button className="ui-btn">
              Share
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "Courts":
        return renderCourts();
      case "Bookings":
        return renderBookings();
      case "Users":
        return renderUsers();
      case "Teams":
        return renderTeams();
      case "Reports":
        return renderReports();
      case "Overview":
      default:
        return renderOverview();
    }
  };

  return (
    <section className="min-h-screen w-full">
      <div className="border-b border-slate-200 bg-white px-5 py-4 text-slate-900 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/70 bg-white/80">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <rect x="4" y="4" width="16" height="16" rx="3" />
                <path d="M4 12h16" />
                <path d="M12 4v16" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">
                Admin System
              </p>
              <h1 className="text-xl font-semibold">Sports Court Operations</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <button
              onClick={openCreateCourt}
              className="ui-btn border-slate-900 bg-slate-900 text-white"
            >
              Create court
            </button>
            <button
              onClick={openCreateUser}
              className="ui-btn"
            >
              Create user
            </button>
            <button
              onClick={openCreateBooking}
              className="ui-btn"
            >
              Create booking
            </button>
            <button
              onClick={handleSignOut}
              className="ui-btn text-rose-600 hover:border-rose-200"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="grid min-h-[calc(100vh-72px)] lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-slate-200 bg-white p-5 sm:p-6 lg:border-b-0 lg:border-r">
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Navigation
          </div>
          <div className="mt-4 space-y-2 text-sm">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label)}
                className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left transition ${
                  activeTab === item.label
                    ? "border border-white/70 bg-white/90 text-slate-900 shadow-sm"
                    : "text-slate-600 hover:bg-white/80"
                }`}
              >
                <span className="font-semibold">{item.label}</span>
                <span className="text-xs text-slate-400">{item.meta}</span>
              </button>
            ))}
          </div>
          <div className="mt-6 glass-card-tight p-4 text-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              System status
            </p>
            <p className="mt-2 font-semibold text-slate-900">All systems normal</p>
            <p className="text-xs text-slate-500">Next audit: May 24, 2025</p>
          </div>
        </aside>

        <div className="p-5 sm:p-6 lg:p-8">
          <div>
            <p className="text-xs font-semibold text-slate-500">Admin dashboard</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              {activeTab}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {activeTab === "Overview"
                ? "Manage courts, bookings, and users in one workspace."
                : "View and manage detailed records for this section."}
            </p>
          </div>

          {renderContent()}
        </div>
      </div>

      {courtForm.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6"
          onClick={() => setCourtForm((prev) => ({ ...prev, open: false }))}
        >
          <div
            className="glass-card w-full max-w-2xl p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {courtForm.mode === "create" ? "Create court" : "Edit court"}
                </p>
                <p className="text-xs text-slate-500">
                  Fill in details and save your changes.
                </p>
              </div>
              <button
                onClick={() => setCourtForm((prev) => ({ ...prev, open: false }))}
                className="ui-btn"
              >
                Close
              </button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-semibold text-slate-600">
                Court name
                <input
                  value={courtForm.name}
                  onChange={(event) =>
                    setCourtForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  className="ui-input mt-2 w-full"
                  placeholder="Court name"
                />
              </label>
              <label className="text-xs font-semibold text-slate-600">
                Sport
                <input
                  value={courtForm.sport}
                  onChange={(event) =>
                    setCourtForm((prev) => ({ ...prev, sport: event.target.value }))
                  }
                  className="ui-input mt-2 w-full"
                  placeholder="Futsal, Tennis, Badminton"
                />
              </label>
              <label className="text-xs font-semibold text-slate-600">
                Status
                <select
                  value={courtForm.status}
                  onChange={(event) =>
                    setCourtForm((prev) => ({ ...prev, status: event.target.value }))
                  }
                  className="ui-input mt-2 w-full"
                >
                  <option value="Open">Open</option>
                  <option value="Limited">Limited</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </label>
              <label className="text-xs font-semibold text-slate-600">
                Rate
                <input
                  value={courtForm.rate}
                  onChange={(event) =>
                    setCourtForm((prev) => ({ ...prev, rate: event.target.value }))
                  }
                  className="ui-input mt-2 w-full"
                  placeholder="$120/hr"
                />
              </label>
              <label className="text-xs font-semibold text-slate-600">
                Capacity
                <input
                  value={courtForm.capacity}
                  onChange={(event) =>
                    setCourtForm((prev) => ({ ...prev, capacity: event.target.value }))
                  }
                  className="ui-input mt-2 w-full"
                  placeholder="10 players"
                />
              </label>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={submitCourtForm}
                className="ui-btn border-slate-900 bg-slate-900 text-white"
              >
                Save
              </button>
              <button
                onClick={() => setCourtForm((prev) => ({ ...prev, open: false }))}
                className="ui-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {userForm.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6"
          onClick={() => setUserForm((prev) => ({ ...prev, open: false }))}
        >
          <div
            className="glass-card w-full max-w-xl p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {userForm.mode === "create" ? "Create user" : "Edit user"}
                </p>
                <p className="text-xs text-slate-500">
                  Update user details and role access.
                </p>
              </div>
              <button
                onClick={() => setUserForm((prev) => ({ ...prev, open: false }))}
                className="ui-btn"
              >
                Close
              </button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-semibold text-slate-600">
                Name
                <input
                  value={userForm.name}
                  onChange={(event) =>
                    setUserForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  className="ui-input mt-2 w-full"
                  placeholder="Full name"
                />
              </label>
              <label className="text-xs font-semibold text-slate-600">
                Club
                <input
                  value={userForm.club}
                  onChange={(event) =>
                    setUserForm((prev) => ({ ...prev, club: event.target.value }))
                  }
                  className="ui-input mt-2 w-full"
                  placeholder="Club name"
                />
              </label>
              <label className="text-xs font-semibold text-slate-600">
                Role
                <select
                  value={userForm.role}
                  onChange={(event) =>
                    setUserForm((prev) => ({ ...prev, role: event.target.value }))
                  }
                  className="ui-input mt-2 w-full"
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </label>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={submitUserForm}
                className="ui-btn border-slate-900 bg-slate-900 text-white"
              >
                Save
              </button>
              <button
                onClick={() => setUserForm((prev) => ({ ...prev, open: false }))}
                className="ui-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {bookingForm.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6"
          onClick={() => setBookingForm((prev) => ({ ...prev, open: false }))}
        >
          <div
            className="glass-card w-full max-w-xl p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {bookingForm.mode === "create"
                    ? "Create booking"
                    : "Edit booking"}
                </p>
                <p className="text-xs text-slate-500">
                  Update booking details before saving.
                </p>
              </div>
              <button
                onClick={() => setBookingForm((prev) => ({ ...prev, open: false }))}
                className="ui-btn"
              >
                Close
              </button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-semibold text-slate-600">
                Club
                <input
                  value={bookingForm.club}
                  onChange={(event) =>
                    setBookingForm((prev) => ({ ...prev, club: event.target.value }))
                  }
                  className="ui-input mt-2 w-full"
                  placeholder="Club name"
                />
              </label>
              <label className="text-xs font-semibold text-slate-600">
                Court
                <input
                  value={bookingForm.court}
                  onChange={(event) =>
                    setBookingForm((prev) => ({ ...prev, court: event.target.value }))
                  }
                  className="ui-input mt-2 w-full"
                  placeholder="Court name"
                />
              </label>
              <label className="text-xs font-semibold text-slate-600">
                Time
                <input
                  value={bookingForm.time}
                  onChange={(event) =>
                    setBookingForm((prev) => ({ ...prev, time: event.target.value }))
                  }
                  className="ui-input mt-2 w-full"
                  placeholder="May 24 · 6:30 PM"
                />
              </label>
              <label className="text-xs font-semibold text-slate-600">
                Status
                <select
                  value={bookingForm.status}
                  onChange={(event) =>
                    setBookingForm((prev) => ({ ...prev, status: event.target.value }))
                  }
                  className="ui-input mt-2 w-full"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                </select>
              </label>
              <label className="text-xs font-semibold text-slate-600">
                Amount
                <input
                  value={bookingForm.amount}
                  onChange={(event) =>
                    setBookingForm((prev) => ({ ...prev, amount: event.target.value }))
                  }
                  className="ui-input mt-2 w-full"
                  placeholder="$100"
                />
              </label>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={submitBookingForm}
                className="ui-btn border-slate-900 bg-slate-900 text-white"
              >
                Save
              </button>
              <button
                onClick={() => setBookingForm((prev) => ({ ...prev, open: false }))}
                className="ui-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminDashboard;

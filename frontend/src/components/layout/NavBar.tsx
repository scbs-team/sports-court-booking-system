import { NavLink, useNavigate, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import logo from "../../assets/sport_court_logo.png";
import { FiBell, FiChevronDown, FiLogOut, FiSettings, FiUser } from "react-icons/fi";

const NavBar = () => {
  const navigate = useNavigate();
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifyRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const handleSignOut = () => {
    window.localStorage.removeItem("sc_role");
    navigate("/auth", { replace: true });
  };
  const notifications = [
    { title: "Booking confirmed", detail: "Padel Indoor 1 · 4:00 PM", time: "2h" },
    { title: "Court available", detail: "Tennis Court 2 · Tonight", time: "5h" },
    { title: "Invite received", detail: "Bangkok Strikers · Soccer", time: "1d" }
  ];
  const badgeCount = notifications.length;

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (notifyRef.current && !notifyRef.current.contains(target)) {
        setNotifyOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-white/70 bg-white/80 shadow-sm">
            <img src={logo} alt="Sports Court Booking" className="h-9 w-9" />
          </div>
          <div className="text-lg font-semibold text-slate-900">
            Courtline Hub
          </div>
        </div>
        <nav className="flex flex-wrap items-center gap-2 rounded-full border border-white/70 bg-white/70 p-1 text-xs font-medium text-slate-600 shadow-sm">
          {[
            { to: "/dashboard", label: "Dashboard" },
            { to: "/booking", label: "Calendar" },
            { to: "/courts", label: "Courts" }
          ].map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                [
                  "nav-pill",
                  isActive
                    ? "nav-pill-active border border-white/70 bg-white/80"
                    : ""
                ].join(" ")
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <div className="relative" ref={notifyRef}>
            <button
              type="button"
              onClick={() => setNotifyOpen((prev) => !prev)}
              aria-label="Toggle notifications"
              aria-expanded={notifyOpen}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/80 text-slate-700 shadow-sm"
            >
              <FiBell className="h-4 w-4" />
            </button>
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white ring-2 ring-white">
              {badgeCount}
            </span>
            {notifyOpen ? (
              <div className="absolute right-0 top-11 z-50 w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.4)]">
                <div className="text-xs font-semibold text-slate-400">
                  Notifications
                </div>
                <div className="mt-3 space-y-2">
                  {notifications.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-xl border border-white/70 bg-white/80 px-3 py-2 text-xs"
                    >
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="font-semibold text-slate-900">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {item.time}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-500">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>
                <Link
                  to="/notifications"
                  className="mt-3 block rounded-full border border-white/70 bg-white/80 px-3 py-2 text-center text-[11px] font-semibold text-slate-700 hover:border-white"
                  onClick={() => setNotifyOpen(false)}
                >
                  View all notifications
                </Link>
              </div>
            ) : null}
          </div>
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((prev) => !prev)}
              aria-label="Toggle profile menu"
              aria-expanded={profileOpen}
              className="flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-2 py-1 text-xs font-semibold text-slate-700 shadow-sm"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
                <img src={logo} alt="Profile" className="h-6 w-6" />
              </span>
              <span className="hidden sm:inline">Maya</span>
              <FiChevronDown className="h-4 w-4 text-slate-400" />
            </button>
            {profileOpen ? (
              <div className="absolute right-0 top-11 z-50 w-44 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.4)]">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-white/70"
                  onClick={() => setProfileOpen(false)}
                >
                  <FiUser className="h-4 w-4" />
                  Profile
                </Link>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-600 hover:bg-white/70"
                >
                  <FiSettings className="h-4 w-4" />
                  Settings
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50/70"
                >
                  <FiLogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;

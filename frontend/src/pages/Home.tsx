import { Link } from "react-router-dom";
import logo from "../assets/sport_court_logo.png";
import Button from "../components/common/Button";

const Home = () => {
  return (
    <section className="glass-card relative overflow-hidden p-8">
      <div className="pointer-events-none absolute -left-20 top-16 h-40 w-40 rounded-full bg-emerald-100/70" />
      <div className="pointer-events-none absolute -right-10 bottom-10 h-48 w-48 rounded-full bg-amber-100/70" />
      <div className="relative grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
            Sports Court Booking System
          </p>
          <div className="mt-3 flex items-center gap-3">
            <img src={logo} alt="Sports Court Booking" className="h-12 w-12" />
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-700">
              Bangkok courts, live now
            </p>
          </div>
          <h1 className="mt-4 text-4xl text-slate-900 sm:text-5xl">
            One dashboard for every court in the city.
          </h1>
          <p className="mt-3 max-w-xl text-sm text-slate-600">
            Track availability, confirm bookings, and coordinate matches with a
            bold interface built for community courts and club operators.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/dashboard">
              <Button>Open User Dashboard</Button>
            </Link>
            <Link to="/admin">
              <Button variant="ghost">Open Admin Suite</Button>
            </Link>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              {
                title: "Availability",
                copy: "See open slots by sport and location."
              },
              {
                title: "Approvals",
                copy: "Review and confirm bookings in minutes."
              },
              {
                title: "Reporting",
                copy: "Track usage and revenue trends."
              }
            ].map((card) => (
              <div key={card.title} className="glass-card-tight p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {card.title}
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {card.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1600&q=80"
              alt="Indoor court"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
          </div>
          <div className="relative flex h-full flex-col justify-end p-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
              Smart booking
            </p>
            <p className="mt-2 text-2xl">
              All your courts, one clear command center.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { label: "Open slots", value: "24" },
                { label: "Teams active", value: "18" }
              ].map((item) => (
                <div key={item.label} className="rounded-2xl bg-white/15 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-white/70">
                    {item.label}
                  </p>
                  <p className="mt-2 text-xl text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;

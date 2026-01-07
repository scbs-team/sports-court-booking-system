import { Link } from "react-router-dom";

const TopUp = () => {
  return (
    <section className="space-y-8">
      <div className="panel">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          Features
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
          Everything you need to book courts fast.
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
          From discovery to approval, Courtline keeps every step in one place so
          players and venues stay in sync.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          {
            title: "Instant availability",
            copy: "Find open courts by sport, time, and surface with live updates."
          },
          {
            title: "Smart scheduling",
            copy: "Avoid overlaps with team calendars and automatic conflict checks."
          },
          {
            title: "Approval workflows",
            copy: "Confirm, hold, or reschedule bookings without extra calls."
          },
          {
            title: "Venue insights",
            copy: "Track utilization, peak hours, and team activity across courts."
          }
        ].map((item) => (
          <div key={item.title} className="card">
            <p className="text-sm font-semibold text-slate-900">{item.title}</p>
            <p className="mt-2 text-sm text-slate-600">{item.copy}</p>
          </div>
        ))}
      </div>

      <div className="panel-tight">
        <p className="text-sm font-semibold text-slate-900">Ready to start?</p>
        <p className="mt-2 text-sm text-slate-600">
          Create a club workspace, invite your teams, and start booking in minutes.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/auth" className="ui-btn border-2 border-[color:var(--accent)] bg-[color:var(--accent)] text-white hover:bg-[color:var(--accent-strong)] hover:border-[color:var(--accent-strong)]">
            Sign in
          </Link>
          <Link to="/help" className="ui-btn">
            Visit help center
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopUp;

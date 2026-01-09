import { Link } from "react-router-dom";

const About = () => {
  return (
    <section className="space-y-8">
      <div className="panel">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          About Courtline
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
          A booking system that keeps clubs moving.
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
          We built Courtline for fast schedules, simple approvals, and clear
          communication between players, captains, and venue managers.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/auth" className="ui-btn">
            Back to sign in
          </Link>
          <Link to="/topup" className="ui-btn border-2 border-[color:var(--accent)] bg-[color:var(--accent)] text-white hover:bg-[color:var(--accent-strong)] hover:border-[color:var(--accent-strong)]">
            View features
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            title: "Live court data",
            copy: "Availability updates, pricing, and surface details are synced in real time."
          },
          {
            title: "Team-first tools",
            copy: "Invite squads, track attendance, and keep payments linked to bookings."
          },
          {
            title: "Operational clarity",
            copy: "Admins see utilization, approvals, and active sessions at a glance."
          }
        ].map((item) => (
          <div key={item.title} className="card">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              {item.title}
            </p>
            <p className="mt-3 text-sm text-slate-600">{item.copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default About;

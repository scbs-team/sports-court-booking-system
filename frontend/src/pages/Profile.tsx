import logo from "../assets/sport_court_logo.png";

import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  return (
    <section className="space-y-8">
      <div className="glass-card p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Sports Court Booking" className="h-10 w-10" />
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">Profile</h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage your account, preferences, and saved courts.
              </p>
            </div>
          </div>
          <span className="accent-pill">Member profile</span>
          <button
            className="ui-btn border-2 border-[color:var(--accent)] bg-[color:var(--accent)] text-white hover:bg-[color:var(--accent-strong)] hover:border-[color:var(--accent-strong)]"
            onClick={() => {
              window.localStorage.removeItem("sc_role");
              navigate("/auth", { replace: true });
            }}
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-card-tight p-6">
          <h2 className="text-lg font-semibold text-slate-900">Account</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="glass-card-tight p-4 text-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Name
              </p>
              <p className="mt-2 font-semibold text-slate-900">Maya Tan</p>
            </div>
            <div className="glass-card-tight p-4 text-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Membership
              </p>
              <p className="mt-2 font-semibold text-slate-900">Premium</p>
            </div>
            <div className="glass-card-tight p-4 text-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Email
              </p>
              <p className="mt-2 font-semibold text-slate-900">
                maya@courts.app
              </p>
            </div>
            <div className="glass-card-tight p-4 text-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Location
              </p>
              <p className="mt-2 font-semibold text-slate-900">
                Bangkok, Thailand
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button className="ui-btn border-slate-200 text-slate-600">
              Edit profile
            </button>
            <button className="ui-btn border-slate-200 text-slate-600">
              Change password
            </button>
            <button className="ui-btn border-2 border-[color:var(--accent)] bg-[color:var(--accent)] text-white hover:bg-[color:var(--accent-strong)] hover:border-[color:var(--accent-strong)]">
              Upgrade plan
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card-tight p-6">
            <h2 className="text-lg font-semibold text-slate-900">Preferences</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              {[
                "Notify me about open slots",
                "Weekly schedule reminder",
                "Invite me to team matches"
              ].map((item) => (
                <label
                  key={item}
                  className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/80 px-3 py-2"
                >
                  <span>{item}</span>
                  <input type="checkbox" defaultChecked />
                </label>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-white/70 bg-white/80 px-3 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Language
              </p>
              <div className="mt-2 flex items-center gap-2">
                {["EN", "TH"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="ui-tab text-xs"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card-tight p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Saved courts
            </h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              {[
                "Benjasiri Park Courts",
                "Rama IX Sports Complex",
                "Bangkok Rackets"
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/80 px-3 py-2"
                >
                  <span className="font-semibold text-slate-900">{item}</span>
                  <button className="ui-btn text-slate-600">Open</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;

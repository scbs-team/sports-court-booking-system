import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import logo from "../assets/sport_court_logo.png";

const Auth = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<
    "home" | "about" | "features" | "help"
  >("home");
  const [authMode, setAuthMode] = useState<"signin" | "register">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirm, setRegisterConfirm] = useState("");

  const emailInvalid = registerEmail.length > 0 && !registerEmail.includes("@");
  const passwordMismatch =
    registerConfirm.length > 0 && registerPassword !== registerConfirm;

  const handleRole = (role: "user" | "admin") => {
    window.localStorage.setItem("sc_role", role);
    navigate(role === "admin" ? "/admin" : "/dashboard", { replace: true });
  };

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-6xl">
        <div className="panel relative overflow-hidden px-6 pb-12 pt-8 sm:px-10">
          <header className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                <img src={logo} alt="Sports Court Booking" className="h-10 w-10" />
              </div>
              <span className="text-sm font-semibold text-slate-700">
                Courtline
              </span>
            </div>
            <nav className="flex w-full flex-wrap items-center justify-center gap-2 text-sm font-semibold lg:w-auto lg:justify-start">
              {[
                { key: "home", label: "Home" },
                { key: "about", label: "About" },
                { key: "features", label: "Features" },
                { key: "help", label: "Help" }
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveSection(item.key as typeof activeSection)}
                  className={`nav-pill ${
                    activeSection === item.key ? "nav-pill-active" : ""
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="flex w-full items-center justify-center gap-3 lg:w-auto lg:justify-start">
              <button
                type="button"
                className={`nav-pill ${authMode === "signin" ? "nav-pill-active" : ""}`}
                onClick={() => setAuthMode("signin")}
              >
                Sign In
              </button>
              <Button
                variant="ghost"
                className="rounded-full px-6"
                onClick={() => setAuthMode("register")}
              >
                Register
              </Button>
            </div>
          </header>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]" id="home">
            <div className="fade-up">
              {activeSection === "home" ? (
                <>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Sports booking platform
                  </p>
                  <h1 className="mt-4 text-4xl font-semibold text-slate-900 sm:text-5xl lg:text-6xl">
                    Book courts across
                    <span className="block text-[color:var(--accent)]">
                      every sport.
                    </span>
                  </h1>
                  <p className="mt-4 max-w-md text-sm text-slate-600 sm:text-base">
                    Find open courts, confirm bookings, and manage teams with a
                    single calendar built for busy community clubs.
                  </p>
                  <p className="mt-3 max-w-md text-xs text-slate-500">
                    Tennis, Padel, Badminton, Soccer, Basketball, and more with
                    live slot updates and instant confirmations.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {["Tennis", "Padel", "Badminton", "Soccer", "Basketball"].map(
                      (sport) => (
                        <span
                          key={sport}
                          className="rounded-full border-2 border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600"
                        >
                          {sport}
                        </span>
                      )
                    )}
                  </div>
                  <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    {[
                      { label: "Courts live", value: "36" },
                      { label: "Bookings today", value: "18" },
                      { label: "Teams active", value: "9" }
                    ].map((item) => (
                      <div key={item.label} className="card text-xs">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                          {item.label}
                        </p>
                        <p className="mt-2 text-xl font-semibold text-slate-900">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : null}

              {activeSection === "about" ? (
                <>
                  <span className="accent-pill">About Courtline</span>
                  <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
                    Built for clubs that run every day.
                  </h2>
                  <p className="mt-4 max-w-md text-sm text-slate-600 sm:text-base">
                    Courtline keeps schedules clean, approvals fast, and teams in
                    sync. We help venues fill courts while players book in seconds.
                  </p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {[
                      { label: "Live schedules", value: "24/7 updates" },
                      { label: "Trusted clubs", value: "120+ venues" },
                      { label: "Faster approvals", value: "60% quicker" },
                      { label: "Member support", value: "Always-on" }
                    ].map((item) => (
                      <div key={item.label} className="card text-xs">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                          {item.label}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : null}

              {activeSection === "features" ? (
                <>
                  <span className="accent-pill">Features</span>
                  <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
                    Everything you need to book courts fast.
                  </h2>
                  <div className="mt-6 space-y-3">
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
                      }
                    ].map((item) => (
                      <div key={item.title} className="card">
                        <p className="text-sm font-semibold text-slate-900">
                          {item.title}
                        </p>
                        <p className="mt-2 text-sm text-slate-600">{item.copy}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : null}

              {activeSection === "help" ? (
                <>
                  <span className="accent-pill">Help Center</span>
                  <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
                    Booking questions, answered.
                  </h2>
                  <div className="mt-6 space-y-3">
                    {[
                      {
                        title: "Booking windows",
                        copy: "Most venues open slots 7 days ahead. Members may see earlier access."
                      },
                      {
                        title: "Cancellations",
                        copy: "Cancel up to 2 hours before start time to avoid fees."
                      },
                      {
                        title: "Support",
                        copy: "Contact venue managers directly from the courts list."
                      }
                    ].map((item) => (
                      <div key={item.title} className="card">
                        <p className="text-sm font-semibold text-slate-900">
                          {item.title}
                        </p>
                        <p className="mt-2 text-sm text-slate-600">{item.copy}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <button className="ui-btn">View FAQs</button>
                    <button className="ui-btn border-2 border-[color:var(--accent)] bg-[color:var(--accent)] text-white hover:bg-[color:var(--accent-strong)] hover:border-[color:var(--accent-strong)]">
                      Contact support
                    </button>
                  </div>
                </>
              ) : null}
            </div>

            <div className="fade-up-delay">
              <div className="panel-tight">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">
                      {authMode === "signin" ? "Sign in" : "Register"}
                    </p>
                    <h2 className="mt-2 text-3xl text-slate-900">
                      {authMode === "signin" ? "Welcome back" : "Create your account"}
                    </h2>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white">
                    <img src={logo} alt="Sports Court Booking" className="h-8 w-8" />
                  </div>
                </div>
                {authMode === "signin" ? (
                  <form className="mt-6 space-y-4 text-left">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email address"
                      className="auth-input"
                    />
                    <p className="-mt-2 text-[11px] text-slate-500">
                      Use your club email to access shared bookings.
                    </p>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        className="auth-input pr-20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-600"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="h-4 w-4 accent-slate-900" />
                        Keep me signed in
                      </label>
                      <button
                        type="button"
                        className="font-semibold text-slate-600 hover:text-slate-900"
                      >
                        Recovery Password
                      </button>
                    </div>
                    <Button type="submit" className="w-full justify-center">
                      Sign In
                    </Button>
                    <div className="relative py-2 text-center text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">
                      <span className="bg-white px-3">or continue with</span>
                      <span className="absolute left-0 right-0 top-1/2 -z-10 h-px bg-slate-200" />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <button type="button" className="ui-btn h-12">
                        Google
                      </button>
                      <button type="button" className="ui-btn h-12">
                        Apple
                      </button>
                      <button type="button" className="ui-btn h-12">
                        Facebook
                      </button>
                    </div>
                    <div className="grid gap-3 pt-2 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => handleRole("user")}
                        className="ui-btn w-full text-slate-700 hover:bg-slate-50"
                      >
                        Continue as user
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRole("admin")}
                        className="ui-btn w-full text-slate-700 hover:bg-slate-50"
                      >
                        Continue as admin
                      </button>
                    </div>
                  </form>
                ) : (
                  <form className="mt-6 space-y-4 text-left">
                    <input
                      type="text"
                      name="name"
                      placeholder="Full name"
                      className="auth-input"
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email address"
                      className="auth-input"
                      value={registerEmail}
                      onChange={(event) => setRegisterEmail(event.target.value)}
                    />
                    {emailInvalid ? (
                      <p className="-mt-2 text-[11px] text-rose-500">
                        Enter a valid email address.
                      </p>
                    ) : (
                      <p className="-mt-2 text-[11px] text-slate-500">
                        We’ll send a confirmation email after signup.
                      </p>
                    )}
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Create password"
                        className="auth-input pr-20"
                        value={registerPassword}
                        onChange={(event) => setRegisterPassword(event.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-600"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    <p className="-mt-2 text-[11px] text-slate-500">
                      Use at least 8 characters with a number for stronger security.
                    </p>
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        name="confirm"
                        placeholder="Confirm password"
                        className="auth-input pr-20"
                        value={registerConfirm}
                        onChange={(event) => setRegisterConfirm(event.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-600"
                      >
                        {showConfirm ? "Hide" : "Show"}
                      </button>
                    </div>
                    {passwordMismatch ? (
                      <p className="-mt-2 text-[11px] text-rose-500">
                        Passwords do not match.
                      </p>
                    ) : null}
                    <label className="flex items-center gap-2 text-xs text-slate-500">
                      <input type="checkbox" className="h-4 w-4 accent-slate-900" />
                      I agree to the booking terms and privacy policy.
                    </label>
                    <Button type="submit" className="w-full justify-center">
                      Create account
                    </Button>
                    <div className="text-center text-xs text-slate-500">
                      Already have an account?{" "}
                      <button
                        type="button"
                        className="font-semibold text-slate-900"
                        onClick={() => setAuthMode("signin")}
                      >
                        Sign in
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Auth;

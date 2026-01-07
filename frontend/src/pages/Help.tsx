import { Link } from "react-router-dom";

const Help = () => {
  return (
    <section className="space-y-8">
      <div className="panel">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          Help Center
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
          Booking questions, answered.
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
          Find support for booking rules, refunds, and venue contacts in a single
          place.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          {
            title: "How far ahead can I book?",
            copy: "Most venues open slots 7 days in advance. Some clubs open earlier for members."
          },
          {
            title: "Can I cancel a booking?",
            copy: "Yes. Cancellations within 2 hours of a session may incur a fee."
          },
          {
            title: "How do I pay?",
            copy: "Payments are captured when a booking is confirmed. Receipts live in your profile."
          },
          {
            title: "Who do I contact?",
            copy: "Use the venue contact card inside each court listing for direct support."
          }
        ].map((item) => (
          <div key={item.title} className="card">
            <p className="text-sm font-semibold text-slate-900">{item.title}</p>
            <p className="mt-2 text-sm text-slate-600">{item.copy}</p>
          </div>
        ))}
      </div>

      <div className="panel-tight">
        <p className="text-sm font-semibold text-slate-900">Need more help?</p>
        <p className="mt-2 text-sm text-slate-600">
          Email support@courtline.app or start a live chat from the dashboard.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/auth" className="ui-btn border-2 border-[color:var(--accent)] bg-[color:var(--accent)] text-white hover:bg-[color:var(--accent-strong)] hover:border-[color:var(--accent-strong)]">
            Back to sign in
          </Link>
          <Link to="/about" className="ui-btn">
            Learn about Courtline
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Help;

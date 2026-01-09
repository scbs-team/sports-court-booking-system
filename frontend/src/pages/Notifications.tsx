const Notifications = () => {
  const items = [
    {
      title: "Booking confirmed",
      detail: "Padel Indoor 1 · Friday 4:00 PM",
      time: "2h ago",
      status: "New"
    },
    {
      title: "Slot available",
      detail: "Tennis Court 2 · Today 7:30 PM",
      time: "4h ago",
      status: "New"
    },
    {
      title: "Invite received",
      detail: "Bangkok Strikers · Soccer",
      time: "Yesterday",
      status: "Seen"
    },
    {
      title: "Reminder",
      detail: "Badminton Court 4 · Tomorrow 6:00 PM",
      time: "Yesterday",
      status: "Seen"
    }
  ];

  return (
    <section className="space-y-8">
      <div className="panel p-8">
        <span className="accent-pill">Activity feed</span>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Notifications</h1>
        <p className="mt-2 text-slate-600">
          Updates from your bookings, teams, and court availability.
        </p>
      </div>
      <div className="panel p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">{items.length} updates</p>
          <div className="flex items-center gap-2">
            {["All", "New", "Seen"].map((item, index) => (
              <button
                key={item}
                type="button"
                className={`ui-tab ${index === 0 ? "ui-tab--active" : "ui-tab--idle"}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div
              key={item.title + item.time}
              className="card text-sm"
            >
              <div className="flex items-center justify-between text-slate-600">
                <span className="font-semibold text-slate-900">
                  {item.title}
                </span>
                <span className="text-xs text-slate-400">{item.time}</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">{item.detail}</p>
              <span
                className={`mt-2 inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${
                  item.status === "New"
                    ? "bg-lime-100 text-slate-900"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Notifications;

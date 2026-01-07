import { useEffect } from "react";

type ToastProps = {
  message: string;
  tone?: "success" | "info" | "warning";
  onClose: () => void;
};

const toneStyles = {
  success: "border-lime-300/70 bg-white/90 text-slate-900",
  info: "border-slate-900/20 bg-white/90 text-slate-900",
  warning: "border-orange-300/70 bg-white/90 text-slate-900"
};

const Toast = ({ message, tone = "info", onClose }: ToastProps) => {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 2500);
    return () => window.clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={`rounded-xl border px-4 py-3 text-xs font-semibold shadow-[0_16px_40px_-28px_rgba(15,23,42,0.5)] ${toneStyles[tone]}`}
      >
        {message}
      </div>
    </div>
  );
};

export default Toast;

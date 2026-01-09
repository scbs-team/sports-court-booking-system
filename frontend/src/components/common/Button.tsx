import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

const Button = ({ variant = "primary", className = "", ...props }: ButtonProps) => {
  const base =
    "inline-flex items-center justify-center rounded-xl px-5 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/30";
  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
      "border-2 border-[color:var(--accent)] bg-[color:var(--accent)] text-white hover:bg-[color:var(--accent-strong)] hover:border-[color:var(--accent-strong)]",
    ghost: "border-2 border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
  };
  const classes = [base, variants[variant], className].join(" ").trim();
  return <button className={classes} {...props} />;
};

export default Button;

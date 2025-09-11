import React from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const styles: Record<Variant, string> = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 shadow-sm " +
    "focus-visible:ring-indigo-500",
  secondary:
    "bg-white text-zinc-900 hover:bg-zinc-50 border border-zinc-300 " +
    "focus-visible:ring-indigo-500",
  ghost:
    "bg-transparent text-zinc-700 hover:bg-zinc-50 border border-transparent " +
    "focus-visible:ring-indigo-500",
  danger:
    "bg-rose-600 text-white hover:bg-rose-500 active:bg-rose-700 shadow-sm " +
    "focus-visible:ring-rose-500",
};

export default function Button({
  variant = "primary",
  className = "",
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium",
        "transition-colors focus-visible:outline-none focus-visible:ring-2",
        styles[variant],
        className,
      ].join(" ")}
    />
  );
}

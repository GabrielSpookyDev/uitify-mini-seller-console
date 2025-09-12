import React from "react";
import { type LucideIcon } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  icon?: LucideIcon;
  label?: string;
  size?: number;
  strokeWidth?: number;
  reverseLabel?: boolean;
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
  icon: Icon,
  label,
  size = 20,
  strokeWidth = 2,
  reverseLabel = false,
  className = "",
  disabled,
  ...props
}: Readonly<ButtonProps>) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium",
        "transition-colors focus-visible:outline-none focus-visible:ring-2",
        disabled ? "cursor-not-allowed opacity-50" : "hover:cursor-pointer",
        reverseLabel ? "flex-row-reverse" : "flex-row",
        styles[variant],
        className,
      ].join(" ")}
    >
      {Icon && <Icon size={size} strokeWidth={strokeWidth} />}
      {label && <span>{label}</span>}
      {!Icon && !label && props.children}
    </button>
  );
}

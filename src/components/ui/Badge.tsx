import React from "react";

export type Tone = "neutral" | "green" | "amber" | "indigo" | "rose";
type Props = { children: React.ReactNode; tone?: Tone; className?: string };

const tones: Record<Tone, string> = {
  neutral: "bg-zinc-100 text-zinc-700 ring-zinc-200/80",
  green: "bg-emerald-100 text-emerald-700 ring-emerald-200/80",
  amber: "bg-amber-100 text-amber-800 ring-amber-200/80",
  indigo: "bg-indigo-100 text-indigo-700 ring-indigo-200/80",
  rose: "bg-rose-100 text-rose-700 ring-rose-200/80",
};

export default function Badge({
  children,
  tone = "neutral",
  className = "",
}: Readonly<Props>) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1",
        tones[tone],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

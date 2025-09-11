import React from "react";

type Props = React.SelectHTMLAttributes<HTMLSelectElement>;

export default function Select({
  className = "",
  children,
  ...props
}: Readonly<Props>) {
  return (
    <select
      {...props}
      className={[
        "rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900",
        "shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
        className,
      ].join(" ")}
    >
      {children}
    </select>
  );
}

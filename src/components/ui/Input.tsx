import React from 'react';

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className = '', ...props }: Readonly<Props>) {
  return (
    <input
      {...props}
      className={[
        'w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900',
        'placeholder:text-zinc-400 shadow-sm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
        className,
      ].join(' ')}
    />
  );
}

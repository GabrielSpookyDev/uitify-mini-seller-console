// src/components/ui/Card.tsx
import React from 'react';

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export default function Card({ className = '', children, ...rest }: Readonly<CardProps>) {
  return (
    <div
      {...rest}
      className={[
        'rounded-2xl border border-zinc-200/70 bg-white/80 backdrop-blur-sm shadow-sm',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}

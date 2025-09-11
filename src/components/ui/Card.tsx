import React from "react";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  rounded?: string;
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { rounded = "rounded-2xl", className = "", children, ...rest },
  ref
) {
  return (
    <div
      {...rest}
      ref={ref}
      className={[
        `${rounded} border border-zinc-200/70 bg-white/80 backdrop-blur-sm shadow-sm`,
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
});

export default Card;

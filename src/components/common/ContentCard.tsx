import { HTMLAttributes } from "react";

interface ContentCardProps extends HTMLAttributes<HTMLDivElement> {}

export function ContentCard({
  className = "",
  children,
  ...props
}: ContentCardProps) {
  return (
    <div
      className={`
        flex flex-col gap-1 p-4 rounded-2xl bg-white border border-sky-100 [box-shadow:0_1px_3px_rgba(0,_0,_0,_0.1)]
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

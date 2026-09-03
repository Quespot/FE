import type { PropsWithChildren } from "react";

type QuespotPageLayoutProps = PropsWithChildren<{
  className?: string;
}>;

export default function QuespotPageLayout({
  children,
  className = "",
}: QuespotPageLayoutProps) {
  return (
    <section
      className={[
        "flex h-full min-h-0 w-full flex-1 flex-col overflow-x-hidden bg-[#F4F8FF]",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}

type QuespotPageContentProps = PropsWithChildren<{
  className?: string;
}>;

export function QuespotPageContent({
  children,
  className = "",
}: QuespotPageContentProps) {
  return (
    <main
      className={[
        "flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden bg-[#F4F8FF]",
        className,
      ].join(" ")}
    >
      {children}
    </main>
  );
}

export function QuespotDivider() {
  return <div className="h-px w-full shrink-0 bg-[#EAF5FF]" />;
}
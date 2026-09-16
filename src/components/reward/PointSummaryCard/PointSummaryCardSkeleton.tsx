export default function PointSummaryCardSkeleton() {
  return (
    <div
      className="animate-pulse motion-reduce:animate-none"
      aria-hidden="true"
    >
      <div className="mt-[8px] flex h-[42px] items-center">
        <div className="h-[36px] w-[140px] max-w-full rounded-lg bg-slate-200" />
      </div>

      <div className="mt-[14px] flex h-[13px] items-center gap-[16px]">
        <div className="h-[13px] w-[88px] rounded bg-slate-200" />
        <div className="h-[13px] w-[80px] rounded bg-slate-200" />
      </div>
    </div>
  );
}

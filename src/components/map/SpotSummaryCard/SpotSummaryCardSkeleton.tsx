export default function SpotSummaryCardSkeleton() {
  return (
    <div
      className="flex min-w-[82px] shrink-0 animate-pulse flex-col items-center rounded-[16px] border-2 border-[#C8E8FF] bg-[#EAF5FF] px-[12px] py-[12px] motion-reduce:animate-none"
      aria-hidden="true"
    >
      <div className="h-6 w-6 rounded-lg bg-slate-200" />
      <div className="mt-[8px] flex h-[17px] items-center">
        <div className="h-3 w-12 rounded bg-slate-200" />
      </div>
      <div className="mt-[3px] flex h-[15px] items-center">
        <div className="h-2.5 w-7 rounded bg-slate-200" />
      </div>
    </div>
  );
}

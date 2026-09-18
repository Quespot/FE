export default function StampRegionCardSkeleton() {
  return (
    <div
      className="flex animate-pulse flex-col items-center motion-reduce:animate-none"
      aria-hidden="true"
    >
      <div className="grid h-[64px] w-[64px] place-items-center rounded-full border border-[#EAF5FF] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <div className="h-7 w-7 rounded-full bg-slate-100" />
      </div>
      <div className="mt-[10px] flex h-[16px] items-center">
        <div className="h-2.5 w-12 rounded bg-slate-200" />
      </div>
    </div>
  );
}

export default function BadgeCardSkeleton() {
  return (
    <div
      className="flex animate-pulse flex-col items-center motion-reduce:animate-none"
      aria-hidden="true"
    >
      <div className="grid h-[92px] w-[92px] place-items-center rounded-[16px] border border-[#EAF5FF] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <div className="h-10 w-10 rounded-xl bg-slate-100" />
      </div>
      <div className="mt-[12px] flex h-[17px] items-center">
        <div className="h-3 w-16 rounded bg-slate-200" />
      </div>
    </div>
  );
}

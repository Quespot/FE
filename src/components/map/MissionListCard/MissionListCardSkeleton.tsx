export default function MissionListCardSkeleton() {
  return (
    <div
      className="flex shrink-0 animate-pulse bg-white justify-between gap-3 rounded-[18px] border border-[#E5EDF7] p-4 motion-reduce:animate-none"
      aria-hidden="true"
    >
      <div className="flex min-w-0 flex-1 gap-2">
        <div className="size-10 shrink-0 rounded-md bg-slate-100" />
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
          <div className="h-3.5 w-3/4 rounded bg-slate-200" />
          <div className="h-3 w-full max-w-[160px] rounded bg-slate-100" />
        </div>
      </div>
      <div className="size-10 shrink-0 rounded-xl bg-slate-100" />
    </div>
  );
}

export default function MapMissionSummarySkeleton() {
  return (
    <div className="w-[140px] animate-pulse motion-reduce:animate-none" aria-hidden="true">
      <div className="flex h-[18px] items-center">
        <div className="h-3.5 w-20 rounded bg-slate-200" />
      </div>
      <div className="mt-[4px] flex h-[18px] items-center gap-2">
        <div className="h-3.5 w-16 rounded bg-slate-100" />
        <div className="h-3.5 w-14 rounded bg-slate-100" />
      </div>
    </div>
  );
}

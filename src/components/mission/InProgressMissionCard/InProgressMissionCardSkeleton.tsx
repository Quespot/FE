export default function InProgressMissionCardSkeleton() {
  return (
    <article
      aria-hidden="true"
      className="mt-[16px] animate-pulse overflow-hidden rounded-[22px] border border-[#DCEEFF] bg-white shadow-[0_8px_24px_rgba(51,111,161,0.06)] motion-reduce:animate-none"
    >
      <div className="flex h-[112px] items-center justify-between bg-[#E7F3FB] px-[20px]">
        <div>
          <div className="h-[26px] w-[58px] rounded-full bg-white/80" />
          <div className="mt-[13px] h-[12px] w-[126px] rounded bg-white/65" />
        </div>
        <div className="h-[64px] w-[64px] rounded-[20px] bg-white/65" />
      </div>
      <div className="px-[18px] pb-[18px] pt-[19px]">
        <div className="h-[20px] w-4/5 rounded-[7px] bg-slate-200" />
        <div className="mt-[17px] h-[48px] rounded-[14px] bg-slate-100" />
        <div className="mt-[10px] h-[42px] rounded-[13px] bg-slate-100" />
        <div className="mt-[16px] flex gap-[9px]">
          <div className="h-[50px] w-[82px] rounded-[16px] bg-slate-100" />
          <div className="h-[50px] flex-1 rounded-[16px] bg-sky-100" />
        </div>
      </div>
    </article>
  );
}

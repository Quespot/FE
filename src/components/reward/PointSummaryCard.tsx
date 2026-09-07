type PointSummaryCardProps = {
  currentPoint: number;
  earnedPoint: number;
  usedPoint: number;
};

export default function PointSummaryCard({
  currentPoint,
  earnedPoint,
  usedPoint,
}: PointSummaryCardProps) {
  return (
    <section className="mt-[44px] rounded-[16px] border border-white/80 bg-white/70 p-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.12)] backdrop-blur">
      <p className="m-0 text-[13px] font-medium leading-[18px] text-[#A2A9B2]">
        보유 포인트
      </p>

      <div className="mt-[8px] flex items-end gap-[5px]">
        <strong className="text-[42px] font-black leading-none text-[#5BB5F8]">
          {currentPoint.toLocaleString()}
        </strong>

        <span className="pb-[6px] text-[18px] font-black leading-none text-[#9CA3AF]">
          P
        </span>
      </div>

      <div className="mt-[14px] flex items-center gap-[16px]">
        <span className="text-[13px] font-bold leading-none text-[#7B8794]">
          획득 <b className="font-black">{earnedPoint.toLocaleString()}P</b>
        </span>

        <span className="text-[13px] font-bold leading-none text-[#7B8794]">
          사용 <b className="font-black">{usedPoint.toLocaleString()}P</b>
        </span>
      </div>
    </section>
  );
}
import type { StampRegion } from "@/data/reward";

type StampRegionCardProps = {
  region: StampRegion;
  onClick: () => void;
};

export default function StampRegionCard({
  region,
  onClick,
}: StampRegionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center bg-transparent p-0 text-center transition active:scale-[0.98]"
    >
      <div
        className={[
          "grid h-[64px] w-[64px] place-items-center rounded-full border text-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
          region.acquired
            ? "border-[#C8E8FF] bg-[#5BB5F8] text-white shadow-[0_2px_6px_rgba(91,181,248,0.28)]"
            : "border-[#EAF5FF] bg-white text-[#C8CFD9] opacity-55",
        ].join(" ")}
      >
        {region.emoji}
      </div>

      <strong
        className={[
          "mt-[10px] text-[11px] font-black leading-[16px]",
          region.acquired ? "text-[#6B7280]" : "text-[#7B8794]",
        ].join(" ")}
      >
        {region.name}
      </strong>
    </button>
  );
}
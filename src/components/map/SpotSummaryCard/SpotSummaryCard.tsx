import { MissionSpot } from "@/apis/missionSpot";
import { MapPin } from "lucide-react";

type SpotSummaryCardProps = {
  spot: MissionSpot;
  selected: boolean;
  onClick: () => void;
};

//하단 주변 미션 스팟 카드
export default function SpotSummaryCard({
  spot,
  selected,
  onClick,
}: SpotSummaryCardProps) {
  const isCompleted = spot.completionStatus === "COMPLETE";

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex min-w-[82px] shrink-0 flex-col items-center rounded-[16px] border-2 px-[12px] py-[12px] transition active:scale-[0.98]",
        selected
          ? "border-[#5BB5F8] bg-primary text-white"
          : isCompleted
            ? "border-[#BBF7D0] bg-[#F0FDF9]"
            : "border-[#C8E8FF] bg-[#EAF5FF]",
      ].join(" ")}
    >
      <span className="text-[24px] leading-none">
        <MapPin
          className={
            selected
              ? "text-white"
              : isCompleted
                ? "text-[#22C983]"
                : "text-primary"
          }
        />
      </span>

      <strong
        className={[
          "mt-[8px] text-[13px] font-black leading-[17px]",
          selected ? "text-white" : "text-[#1C1C3A]",
        ].join(" ")}
      >
        {spot.districtName}
      </strong>

      <span
        className={[
          "mt-[3px] text-[11px] font-bold leading-[15px]",
          selected
            ? "text-white/90"
            : isCompleted
              ? "text-[#00C950]"
              : "text-[#A2A9B2]",
        ].join(" ")}
      >
        {isCompleted ? "완료" : `${spot.missionCount ?? 0}개`}
      </span>
    </button>
  );
}

import { Award, Map, Medal, Target, Ticket } from "lucide-react";

import type { HistoryIconKey, HistoryItem } from "@/data/reward";

const historyIconMap: Record<HistoryIconKey, React.ReactNode> = {
  target: <Target size={18} strokeWidth={2.4} />,
  map: <Map size={18} strokeWidth={2.4} />,
  ticket: <Ticket size={18} strokeWidth={2.4} />,
  award: <Award size={18} strokeWidth={2.4} />,
};

type HistoryCardProps = {
  item: HistoryItem;
};

export default function HistoryCard({ item }: HistoryCardProps) {
  const isEarn = item.type === "earn";

  return (
    <article className="flex min-h-[76px] items-center rounded-[16px] border border-[#EAF5FF] bg-white p-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div
        className={[
          "grid h-[44px] w-[44px] shrink-0 place-items-center rounded-full",
          isEarn
            ? "bg-[#E8FBF3] text-[#00C950]"
            : "bg-[#FFF6D9] text-[#F59E0B]",
        ].join(" ")}
      >
        {historyIconMap[item.iconKey]}
      </div>

      <div className="ml-[12px] min-w-0 flex-1">
        <strong className="block truncate text-[14px] font-black leading-[20px] text-[#1C1C3A]">
          {item.title}
        </strong>

        <p className="m-0 mt-[3px] truncate text-[11px] font-medium leading-[16px] text-[#A2A9B2]">
          {item.description}
        </p>

        <p className="m-0 mt-[4px] text-[10px] font-medium leading-[14px] text-[#C0C7D2]">
          {item.date}
        </p>
      </div>

      {item.point > 0 ? (
        <strong
          className={[
            "shrink-0 text-[14px] font-black leading-[20px]",
            isEarn ? "text-[#00C950]" : "text-[#F59E0B]",
          ].join(" ")}
        >
          {isEarn ? "+" : "-"}
          {item.point}P
        </strong>
      ) : (
        <Medal size={20} className="shrink-0 text-[#5BB5F8]" />
      )}
    </article>
  );
}
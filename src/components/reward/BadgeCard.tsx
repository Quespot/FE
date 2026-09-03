import type { BadgeItem } from "@/data/reward";

type BadgeCardProps = {
  badge: BadgeItem;
};

export default function BadgeCard({ badge }: BadgeCardProps) {
  return (
    <article className="relative flex flex-col items-center">
      <div
        className={[
          "grid h-[92px] w-[92px] place-items-center rounded-[16px] border bg-white text-[34px] shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
          badge.acquired
            ? "border-[#C8E8FF] shadow-[0_1px_4px_rgba(91,181,248,0.24)]"
            : "border-[#EAF5FF] opacity-35",
        ].join(" ")}
      >
        {badge.emoji}
      </div>

      <strong
        className={[
          "mt-[12px] text-center text-[12px] font-black leading-[17px]",
          badge.acquired ? "text-[#6B7280]" : "text-[#A2A9B2]",
        ].join(" ")}
      >
        {badge.name}
      </strong>
    </article>
  );
}
import type { StampItem } from "@/data/reward";

type StampCardProps = {
  stamp: StampItem;
};

export default function StampCard({ stamp }: StampCardProps) {
  return (
    <article
      className={[
        "relative flex min-h-[96px] items-center rounded-[16px] border bg-white p-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
        stamp.acquired ? "border-[#C8E8FF]" : "border-[#EAF5FF] opacity-45",
      ].join(" ")}
    >
      <div className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-[16px] bg-[#EAF5FF] text-[26px]">
        {stamp.emoji}
      </div>

      <div className="ml-[12px] min-w-0">
        <strong className="block truncate text-[14px] font-black leading-[20px] text-[#1C1C3A]">
          {stamp.name}
        </strong>

        <p className="m-0 mt-[4px] truncate text-[11px] font-medium leading-[16px] text-[#A2A9B2]">
          {stamp.region}
        </p>

        <span
          className={[
            "mt-[7px] inline-flex h-[22px] items-center rounded-full px-[9px] text-[10px] font-black leading-none",
            stamp.acquired
              ? "bg-[#E8FBF3] text-[#00C950]"
              : "bg-[#F1F5F9] text-[#A2A9B2]",
          ].join(" ")}
        >
          {stamp.acquired ? "획득 완료" : "미획득"}
        </span>
      </div>
    </article>
  );
}
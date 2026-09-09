import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

type SectionHeaderProps = {
  title: string;
  icon?: ReactNode;
  actionLabel?: string;
  onActionClick?: () => void;
};

export default function SectionHeader({
  title,
  icon,
  actionLabel,
  onActionClick,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="m-0 inline-flex items-center gap-[5px] text-[18px] font-black leading-tight text-[#1c1c3a]">
        {icon}
        {title}
      </h2>

      {actionLabel ? (
        <button
          className="inline-flex items-center gap-[3px] bg-transparent text-[13px] font-black text-[#5bb5f8]"
          type="button"
          onClick={onActionClick}
        >
          {actionLabel}
          <ChevronRight size={15} strokeWidth={2.6} />
        </button>
      ) : null}
    </div>
  );
}
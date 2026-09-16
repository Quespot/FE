import type { RewardTab } from "@/data/reward";
import { rewardTabs } from "@/data/reward";
import {
  ClipboardList,
  Medal,
  Stamp,
  type LucideIcon,
} from "lucide-react";

const rewardTabIconMap: Record<RewardTab, LucideIcon> = {
  badges: Medal,
  stamps: Stamp,
  history: ClipboardList,
};

type RewardTabsProps = {
  selectedTab: RewardTab;
  onChangeTab: (tab: RewardTab) => void;
};

export default function RewardTabs({
  selectedTab,
  onChangeTab,
}: RewardTabsProps) {
  return (
    <section className="grid h-[54px] shrink-0 grid-cols-3 border-b border-[#EAF5FF] bg-white">
      {rewardTabs.map((tab) => {
        const isActive = selectedTab === tab.id;
        const Icon = rewardTabIconMap[tab.id];

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChangeTab(tab.id)}
            className={[
              "relative flex h-full items-center justify-center gap-1.5 text-[13px] font-black leading-none transition",
              isActive ? "text-[#5BB5F8]" : "text-[#A2A9B2]",
            ].join(" ")}
          >
            <Icon
              aria-hidden="true"
              size={17}
              strokeWidth={isActive ? 2.5 : 2.1}
            />
            <span>{tab.label}</span>

            {isActive ? (
              <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#5BB5F8]" />
            ) : null}
          </button>
        );
      })}
    </section>
  );
}

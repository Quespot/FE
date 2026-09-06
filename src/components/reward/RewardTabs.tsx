import type { RewardTab } from "@/data/reward";
import { rewardTabs } from "@/data/reward";

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

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChangeTab(tab.id)}
            className={[
              "relative flex h-full flex-col items-center justify-center gap-[2px] text-[13px] font-black leading-none transition",
              isActive ? "text-[#5BB5F8]" : "text-[#A2A9B2]",
            ].join(" ")}
          >
            <span>
              {tab.emoji} {tab.label}
            </span>

            {isActive ? (
              <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#5BB5F8]" />
            ) : null}
          </button>
        );
      })}
    </section>
  );
}
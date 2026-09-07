import type { CouponTab } from "@/data/reward";

type CouponTabsProps = {
  selectedTab: CouponTab;
  onChangeTab: (tab: CouponTab) => void;
};

const COUPON_TABS: {
  id: CouponTab;
  label: string;
}[] = [
  {
    id: "available",
    label: "사용가능",
  },
  {
    id: "used",
    label: "사용완료",
  },
];

export default function CouponTabs({
  selectedTab,
  onChangeTab,
}: CouponTabsProps) {
  return (
    <section className="grid h-[48px] shrink-0 grid-cols-2 border-b border-[#EAF5FF] bg-white">
      {COUPON_TABS.map((tab) => {
        const isActive = selectedTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChangeTab(tab.id)}
            className={[
              "relative flex h-full items-center justify-center text-[13px] font-black leading-none transition",
              isActive ? "text-[#5BB5F8]" : "text-[#A2A9B2]",
            ].join(" ")}
          >
            {tab.label}

            {isActive ? (
              <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#5BB5F8]" />
            ) : null}
          </button>
        );
      })}
    </section>
  );
}
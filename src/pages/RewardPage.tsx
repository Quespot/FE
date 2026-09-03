import { useMemo, useState } from "react";
import { Ticket } from "lucide-react";

import HomeHeader from "@/components/home/HomeHeader";
import BadgeCard from "@/components/reward/BadgeCard";
import HistoryCard from "@/components/reward/HistoryCard";
import PointSummaryCard from "@/components/reward/PointSummaryCard";
import RewardTabs from "@/components/reward/RewardTabs";
import StampCard from "@/components/reward/StampCard";
import QuespotPageLayout, {
  QuespotDivider,
  QuespotPageContent,
} from "@/layouts/QuespotPageLayout";
import {
  rewardBadges,
  rewardHistoryItems,
  rewardStamps,
  type RewardTab,
} from "@/data/reward";
import QuestySvg from "@/assets/icons/Questy.svg";

export default function RewardPage() {
  const [selectedTab, setSelectedTab] = useState<RewardTab>("badges");

  const acquiredBadgeCount = useMemo(() => {
    return rewardBadges.filter((badge) => badge.acquired).length;
  }, []);

  const acquiredStampCount = useMemo(() => {
    return rewardStamps.filter((stamp) => stamp.acquired).length;
  }, []);

  return (
    <QuespotPageLayout className="bg-[#F4F8FF]">
      <HomeHeader
        mascotSrc={QuestySvg}
        notificationCount={3}
        onBellClick={() => {
          // TODO: 알림함 연결
        }}
      />

      <QuespotDivider />

      <QuespotPageContent className="bg-[#F4F8FF]">
        <section className="shrink-0 bg-[linear-gradient(150deg,#C8E8FF_0%,#EAF5FF_100%)] px-[20px] pb-[32px] pt-[24px]">
          <p className="m-0 text-[13px] font-medium leading-[18px] text-[#A2A9B2]">
            내 보상 현황
          </p>

          <h1 className="m-0 mt-[8px] text-[24px] font-black leading-[32px] text-[#1C1C3A]">
            보상 센터
          </h1>

          <PointSummaryCard
            currentPoint={1240}
            earnedPoint={1440}
            usedPoint={200}
          />
        </section>

        <RewardTabs selectedTab={selectedTab} onChangeTab={setSelectedTab} />

        <section className="flex flex-1 flex-col px-[16px] pb-[24px] pt-[20px]">
          {selectedTab === "badges" ? (
            <BadgeSection
              acquiredCount={acquiredBadgeCount}
              totalCount={rewardBadges.length}
            />
          ) : null}

          {selectedTab === "stamps" ? (
            <StampSection
              acquiredCount={acquiredStampCount}
              totalCount={rewardStamps.length}
            />
          ) : null}

          {selectedTab === "history" ? <HistorySection /> : null}

          <button
            type="button"
            className="mt-[28px] flex h-[50px] w-full shrink-0 items-center justify-center gap-[8px] rounded-[16px] bg-[#EAF5FF] text-[14px] font-black leading-none text-[#5BB5F8] transition active:scale-[0.99]"
          >
            <Ticket size={16} strokeWidth={2.4} />
            로컬 제휴 쿠폰 보기
          </button>
        </section>
      </QuespotPageContent>
    </QuespotPageLayout>
  );
}

type RewardSectionCountProps = {
  acquiredCount: number;
  totalCount: number;
};

function BadgeSection({
  acquiredCount,
  totalCount,
}: RewardSectionCountProps) {
  return (
    <>
      <p className="m-0 text-[14px] font-medium leading-[20px] text-[#A2A9B2]">
        {acquiredCount} / {totalCount} 획득
      </p>

      <div className="mt-[20px] grid grid-cols-3 gap-x-[26px] gap-y-[28px]">
        {rewardBadges.map((badge) => (
          <BadgeCard key={badge.id} badge={badge} />
        ))}
      </div>
    </>
  );
}

function StampSection({
  acquiredCount,
  totalCount,
}: RewardSectionCountProps) {
  return (
    <>
      <p className="m-0 text-[14px] font-medium leading-[20px] text-[#A2A9B2]">
        {acquiredCount} / {totalCount} 획득
      </p>

      <div className="mt-[20px] grid grid-cols-2 gap-[12px]">
        {rewardStamps.map((stamp) => (
          <StampCard key={stamp.id} stamp={stamp} />
        ))}
      </div>
    </>
  );
}

function HistorySection() {
  return (
    <>
      <p className="m-0 text-[14px] font-medium leading-[20px] text-[#A2A9B2]">
        최근 보상 내역
      </p>

      <div className="mt-[16px] flex flex-col gap-[10px]">
        {rewardHistoryItems.map((item) => (
          <HistoryCard key={item.id} item={item} />
        ))}
      </div>
    </>
  );
}
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Ticket } from "lucide-react";

import HomeHeader from "@/components/home/HomeHeader";
import BadgeCard from "@/components/reward/BadgeCard";
import HistoryCard from "@/components/reward/HistoryCard";
import PointSummaryCard from "@/components/reward/PointSummaryCard";
import RewardTabs from "@/components/reward/RewardTabs";
import StampCard from "@/components/reward/StampCard";
import StampRegionCard from "@/components/reward/StampRegionCard";

import QuespotPageLayout, {
  QuespotDivider,
  QuespotPageContent,
} from "@/layouts/QuespotPageLayout";

import {
  rewardBadges,
  rewardHistoryItems,
  rewardStampRegions,
  rewardStamps,
  type RewardTab,
  type StampItem,
  type StampRegion,
} from "@/data/reward";

import { PATH } from "@/routes/paths";
import QuestySvg from "@/assets/icons/Questy.svg";

export default function RewardPage() {
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState<RewardTab>("badges");
  const [selectedStampRegion, setSelectedStampRegion] =
    useState<StampRegion | null>(null);

  const acquiredBadgeCount = useMemo(() => {
    return rewardBadges.filter((badge) => badge.acquired).length;
  }, []);

  const acquiredStampRegionCount = useMemo(() => {
    return rewardStampRegions.filter((region) => region.acquired).length;
  }, []);

  const selectedRegionStamps = useMemo(() => {
    if (!selectedStampRegion) return [];

    return rewardStamps.filter(
      (stamp) => stamp.regionId === selectedStampRegion.id,
    );
  }, [selectedStampRegion]);

  const handleChangeTab = (tab: RewardTab) => {
    setSelectedTab(tab);

    if (tab !== "stamps") {
      setSelectedStampRegion(null);
    }
  };

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

        <RewardTabs selectedTab={selectedTab} onChangeTab={handleChangeTab} />

        <section className="flex flex-1 flex-col px-[16px] pb-[24px] pt-[20px]">
          {selectedTab === "badges" ? (
            <BadgeSection
              acquiredCount={acquiredBadgeCount}
              totalCount={rewardBadges.length}
            />
          ) : null}

          {selectedTab === "stamps" ? (
            selectedStampRegion ? (
              <StampDetailSection
                region={selectedStampRegion}
                stamps={selectedRegionStamps}
                onBack={() => setSelectedStampRegion(null)}
              />
            ) : (
              <StampRegionSection
                acquiredCount={acquiredStampRegionCount}
                totalCount={rewardStampRegions.length}
                onSelectRegion={setSelectedStampRegion}
              />
            )
          ) : null}

          {selectedTab === "history" ? <HistorySection /> : null}

          <button
            type="button"
            onClick={() => navigate(PATH.REWARD_COUPONS)}
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

type StampRegionSectionProps = {
  acquiredCount: number;
  totalCount: number;
  onSelectRegion: (region: StampRegion) => void;
};

function StampRegionSection({
  acquiredCount,
  totalCount,
  onSelectRegion,
}: StampRegionSectionProps) {
  return (
    <>
      <p className="m-0 text-[14px] font-medium leading-[20px] text-[#A2A9B2]">
        {acquiredCount} / {totalCount} 스탬프 수집
      </p>

      <div className="mt-[20px] grid grid-cols-4 gap-x-[22px] gap-y-[22px]">
        {rewardStampRegions.map((region) => (
          <StampRegionCard
            key={region.id}
            region={region}
            onClick={() => onSelectRegion(region)}
          />
        ))}
      </div>
    </>
  );
}

type StampDetailSectionProps = {
  region: StampRegion;
  stamps: StampItem[];
  onBack: () => void;
};

function StampDetailSection({
  region,
  stamps,
  onBack,
}: StampDetailSectionProps) {
  const acquiredCount = stamps.filter((stamp) => stamp.acquired).length;

  return (
    <>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex h-[32px] items-center gap-[4px] rounded-full bg-[#EAF5FF] px-[12px] text-[12px] font-black text-[#5BB5F8] transition active:scale-[0.98]"
        >
          <ArrowLeft size={14} strokeWidth={2.6} />
          지역 목록
        </button>

        <span className="text-[12px] font-bold leading-[16px] text-[#A2A9B2]">
          {acquiredCount} / {stamps.length} 획득
        </span>
      </div>

      <h2 className="m-0 mt-[16px] text-[18px] font-black leading-[25px] text-[#1C1C3A]">
        {region.name} 스탬프
      </h2>

      {stamps.length > 0 ? (
        <div className="mt-[16px] grid grid-cols-2 gap-[12px]">
          {stamps.map((stamp) => (
            <StampCard key={stamp.id} stamp={stamp} />
          ))}
        </div>
      ) : (
        <section className="mt-[60px] flex flex-col items-center text-center">
          <div className="grid h-[72px] w-[72px] place-items-center rounded-full bg-[#EAF5FF] text-[30px]">
            ✉️
          </div>

          <h3 className="m-0 mt-[18px] text-[17px] font-black leading-[24px] text-[#1C1C3A]">
            아직 등록된 스탬프가 없어요
          </h3>

          <p className="m-0 mt-[8px] text-[13px] font-medium leading-[20px] text-[#A2A9B2]">
            해당 지역 미션이 추가되면
            <br />
            스탬프를 수집할 수 있어요.
          </p>
        </section>
      )}
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
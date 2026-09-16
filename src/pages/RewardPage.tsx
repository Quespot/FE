import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Ticket } from "lucide-react";

import BadgeCard from "@/components/reward/BadgeCard";
import HistoryCard from "@/components/reward/HistoryCard";
import RewardTabs from "@/components/reward/RewardTabs";
import StampCard from "@/components/reward/StampCard";
import StampRegionCard from "@/components/reward/StampRegionCard";

import QuespotPageLayout, {
  QuespotPageContent,
} from "@/layouts/QuespotPageLayout";

import { rewardHistoryItems, type RewardTab } from "@/data/reward";

import { Header } from "@/components/common/Header";
import {
  useRewardActivities,
  useUserAchievements,
  useUserBadges,
  useUserPoints,
  useUserStamps,
} from "@/hooks/queries/useRewards";
import {
  Badge,
  RewardActivities,
  RewardActivity,
  UserBadges,
  UserStamps,
} from "@/apis/reward";
import { NotificationCard } from "@/components/common/NotificationCard/NotificationCard";
import { NotificationCardSkeleton } from "@/components/common/NotificationCard/NotificationCardSkeleton";

export default function RewardPage() {
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState<RewardTab>("badges");

  const {
    data: pointData,
    isLoading: isPointLoading,
    isError: isPointError,
  } = useUserPoints();

  const {
    data: badgeData,
    isLoading: isBadgeLoading,
    isError: isBadgeError,
  } = useUserBadges();
  const {
    data: stampData,
    isLoading: isStampLoading,
    isError: isStampError,
  } = useUserStamps();

  const {
    data: rewardData,
    isLoading: isRewardLoading,
    isError: isRewardError,
  } = useRewardActivities();

  const { data: achievements } = useUserAchievements();

  const handleChangeTab = (tab: RewardTab) => {
    setSelectedTab(tab);
  };
  const activities = rewardData?.pages.flatMap((page) => page.activities) ?? [];
  return (
    <QuespotPageLayout className="bg-[#F4F8FF]">
      <Header />

      <QuespotPageContent className="bg-[#F4F8FF]">
        <section className="shrink-0 bg-[linear-gradient(150deg,#C8E8FF_0%,#EAF5FF_100%)] px-[20px] pb-[32px] pt-[24px]">
          <p className="m-0 text-[13px] font-medium leading-[18px] text-[#A2A9B2]">
            내 보상 현황
          </p>

          <h1 className="m-0 mt-[8px] text-[24px] font-black leading-[32px] text-[#1C1C3A]">
            보상 센터
          </h1>

          <PointSummaryCard
            currentPoint={pointData?.balance ?? 0}
            earnedPoint={pointData?.totalEarned ?? 0}
            usedPoint={pointData?.totalSpent ?? 0}
            isLoading={isPointLoading}
            isError={isPointError}
          />
        </section>

        <RewardTabs selectedTab={selectedTab} onChangeTab={handleChangeTab} />

        <section className="flex flex-1 flex-col px-[16px] pb-[24px] pt-[20px]">
          {selectedTab === "badges" ? (
            <BadgeSection
              badge={badgeData || undefined}
              acquiredCount={achievements?.acquiredBadgeCount ?? 0}
              totalCount={achievements?.totalBadgeCount ?? 0}
            />
          ) : null}

          {selectedTab === "stamps" ? (
            <StampRegionSection
              stamp={stampData ?? undefined}
              acquiredCount={achievements?.acquiredStampCount ?? 0}
              totalCount={achievements?.totalStampCount ?? 0}
            />
          ) : null}

          {selectedTab === "history" ? (
            <HistorySection
              data={activities}
              isLoading={isRewardLoading}
              isError={isRewardError}
            />
          ) : null}

          {/* <button
            type="button"
            onClick={() => navigate(PATH.REWARD_COUPONS)}
            className="mt-[28px] flex h-[50px] w-full shrink-0 items-center justify-center gap-[8px] rounded-[16px] bg-[#EAF5FF] text-[14px] font-black leading-none text-[#5BB5F8] transition active:scale-[0.99]"
          >
            <Ticket size={16} strokeWidth={2.4} />
            로컬 제휴 쿠폰 보기
          </button> */}
        </section>
      </QuespotPageContent>
    </QuespotPageLayout>
  );
}

type RewardSectionCountProps = {
  badge: UserBadges | undefined;
  acquiredCount: number;
  totalCount: number;
};

function BadgeSection({
  badge,
  acquiredCount,
  totalCount,
}: RewardSectionCountProps) {
  const badgeEmojis = ["🎯", "🗺️", "📸", "🏙️", "🌊", "👑", "👑"];

  return (
    <>
      <p className="m-0 text-[14px] font-medium leading-[20px] text-[#A2A9B2]">
        {acquiredCount} / {totalCount} 획득
      </p>

      <div className="mt-[20px] grid grid-cols-3 gap-x-[26px] gap-y-[28px]">
        {badge?.badges.map((badge, i) => (
          <BadgeCard key={badge.id} badge={badge} emoji={badgeEmojis[i]} />
        ))}
      </div>
    </>
  );
}

type StampRegionSectionProps = {
  stamp: UserStamps | undefined;
  acquiredCount: number;
  totalCount: number;
};

function StampRegionSection({
  stamp,
  acquiredCount,
  totalCount,
}: StampRegionSectionProps) {
  return (
    <>
      <p className="m-0 text-[14px] font-medium leading-[20px] text-[#A2A9B2]">
        {acquiredCount} / {totalCount} 스탬프 수집
      </p>

      <div className="mt-[20px] grid grid-cols-4 gap-x-[22px] gap-y-[22px]">
        {stamp?.stamps.map((stamp) => (
          <StampRegionCard key={stamp.id} stamp={stamp} emoji="✉️" />
        ))}
      </div>
    </>
  );
}

type HistorySectionProps = {
  data: RewardActivity[] | undefined;
  isLoading: boolean;
  isError: boolean;
};
function HistorySection({ data, isLoading, isError }: HistorySectionProps) {
  return (
    <>
      <p className="m-0 text-[14px] font-medium leading-[20px] text-[#A2A9B2]">
        최근 보상 내역
      </p>

      <div className="mt-[16px] flex flex-col gap-[10px]" aria-busy={isLoading}>
        {isLoading ? (
          Array.from({ length: 5 }, (_, index) => (
            <NotificationCardSkeleton key={index} showDescription={false} />
          ))
        ) : (
          <>
            {isError && (
              <p role="alert" className="text-center text-sm text-red-500">
                보상 내역을 불러오지 못했어요. 다시 시도해 주세요.
              </p>
            )}
            {!isError && data?.length === 0 && (
              <p className="text-center">최근 보상 내역이 없습니다.</p>
            )}
            {data?.map((item) => (
              <NotificationCard
                key={item.id}
                id={item.id}
                type={item.activityType}
                title={item.title}
                amount={item.amount}
                createdAt={item.createdAt}
              />
            ))}
          </>
        )}
      </div>
    </>
  );
}

type PointSummaryCardProps = {
  currentPoint: number;
  earnedPoint: number;
  usedPoint: number;
  isLoading: boolean;
  isError: boolean;
};

export function PointSummaryCard({
  currentPoint,
  earnedPoint,
  usedPoint,
  isLoading,
  isError,
}: PointSummaryCardProps) {
  return (
    <section className="mt-[44px] rounded-[16px] border border-white/80 bg-white/70 p-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.12)] backdrop-blur">
      <p className="m-0 text-[13px] font-medium leading-[18px] text-[#A2A9B2]">
        보유 포인트
      </p>
      {isLoading && (
        <div className="w-full flex justify-center items-center">
          포인트 불러오는중...
        </div>
      )}
      {isError && (
        <div className="w-full flex justify-center items-center">
          오류가 발생했습니다. 다시 시도해 주세요.
        </div>
      )}
      {!isError && !isLoading && (
        <>
          <div className="mt-[8px] flex items-end gap-[5px]">
            <strong className="text-[42px] font-black leading-none text-[#5BB5F8]">
              {currentPoint.toLocaleString()}
            </strong>

            <span className="pb-[6px] text-[18px] font-black leading-none text-[#9CA3AF]">
              P
            </span>
          </div>

          <div className="mt-[14px] flex items-center gap-[16px]">
            <span className="text-[13px] font-bold leading-none text-[#7B8794]">
              획득 <b className="font-black">{earnedPoint.toLocaleString()}P</b>
            </span>

            <span className="text-[13px] font-bold leading-none text-[#7B8794]">
              사용 <b className="font-black">{usedPoint.toLocaleString()}P</b>
            </span>
          </div>
        </>
      )}
    </section>
  );
}

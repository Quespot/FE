import { useState } from "react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useNavigate } from "react-router-dom";

import BadgeCard from "@/components/reward/BadgeCard/BadgeCard";
import BadgeCardSkeleton from "@/components/reward/BadgeCard/BadgeCardSkeleton";
import RewardTabs from "@/components/reward/RewardTabs";
import RewardError from "@/components/reward/RewardError";
import StampRegionCard from "@/components/reward/StampRegionCard/StampRegionCard";
import StampRegionCardSkeleton from "@/components/reward/StampRegionCard/StampRegionCardSkeleton";

import QuespotPageLayout, {
  QuespotPageContent,
} from "@/layouts/QuespotPageLayout";

import { type RewardTab } from "@/data/reward";

import { Header } from "@/components/common/Header";
import {
  useRewardActivities,
  useUserAchievements,
  useUserBadges,
  useUserPoints,
  useUserStamps,
} from "@/hooks/queries/useRewards";
import { RewardActivity, UserBadges, UserStamps } from "@/apis/reward";
import { NotificationCard } from "@/components/common/NotificationCard/NotificationCard";
import { NotificationCardSkeleton } from "@/components/common/NotificationCard/NotificationCardSkeleton";
import PointSummaryCard from "@/components/reward/PointSummaryCard/PointSummaryCard";

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
    hasNextPage,
    fetchNextPage,
    isFetching: isRewardFetching,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useRewardActivities();

  const {
    data: achievements,
    isLoading: isAchievementsLoading,
    isError: isAchievementsError,
  } = useUserAchievements();

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
            hasData={pointData != null}
          />
        </section>

        <RewardTabs selectedTab={selectedTab} onChangeTab={handleChangeTab} />

        <section className="flex flex-1 flex-col px-[16px] pb-[24px] pt-[20px]">
          {selectedTab !== "history" && isAchievementsError && (
            <RewardError message="획득 현황을 불러오지 못했어요." />
          )}
          {selectedTab === "badges" ? (
            <BadgeSection
              badge={badgeData || undefined}
              acquiredCount={achievements?.acquiredBadgeCount ?? 0}
              totalCount={achievements?.totalBadgeCount ?? 0}
              isLoading={isBadgeLoading}
              isCountLoading={isAchievementsLoading}
              hasCounts={achievements != null}
              isError={isBadgeError}
            />
          ) : null}

          {selectedTab === "stamps" ? (
            <StampRegionSection
              stamp={stampData ?? undefined}
              acquiredCount={achievements?.acquiredStampCount ?? 0}
              totalCount={achievements?.totalStampCount ?? 0}
              isLoading={isStampLoading}
              isCountLoading={isAchievementsLoading}
              hasCounts={achievements != null}
              isError={isStampError}
            />
          ) : null}

          {selectedTab === "history" ? (
            <HistorySection
              data={activities}
              isLoading={isRewardLoading}
              isError={isRewardError}
              hasNextPage={hasNextPage}
              fetchNextPage={fetchNextPage}
              isFetching={isRewardFetching}
              isFetchingNextPage={isFetchingNextPage}
              isFetchNextPageError={isFetchNextPageError}
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
  isLoading: boolean;
  isCountLoading: boolean;
  hasCounts: boolean;
  isError: boolean;
};

function BadgeSection({
  badge,
  acquiredCount,
  totalCount,
  isLoading,
  isCountLoading,
  hasCounts,
  isError,
}: RewardSectionCountProps) {
  const badgeEmojis = ["🎯", "🗺️", "📸", "🏙️", "👑"];

  return (
    <>
      {isLoading || isCountLoading ? (
        <div className="flex h-[20px] items-center" aria-hidden="true">
          <div className="h-3.5 w-24 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
        </div>
      ) : hasCounts ? (
        <p className="m-0 text-[14px] font-medium leading-[20px] text-[#A2A9B2]">
          {acquiredCount} / {totalCount} 획득
        </p>
      ) : null}

      {isError && <RewardError message="뱃지를 불러오지 못했어요." />}

      <div
        className="mt-[20px] grid grid-cols-3 gap-x-[26px] gap-y-[28px]"
        aria-busy={isLoading}
      >
        {isLoading
          ? Array.from({ length: 6 }, (_, index) => (
              <BadgeCardSkeleton key={index} />
            ))
          : badge?.badges.map((badge, i) => (
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
  isLoading: boolean;
  isCountLoading: boolean;
  hasCounts: boolean;
  isError: boolean;
};

function StampRegionSection({
  stamp,
  acquiredCount,
  totalCount,
  isLoading,
  isCountLoading,
  hasCounts,
  isError,
}: StampRegionSectionProps) {
  return (
    <>
      {isLoading || isCountLoading ? (
        <div className="flex h-[20px] items-center" aria-hidden="true">
          <div className="h-3.5 w-32 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
        </div>
      ) : hasCounts ? (
        <p className="m-0 text-[14px] font-medium leading-[20px] text-[#A2A9B2]">
          {acquiredCount} / {totalCount} 스탬프 수집
        </p>
      ) : null}

      {isError && <RewardError message="스탬프를 불러오지 못했어요." />}

      <div
        className="mt-[20px] grid grid-cols-4 gap-x-[22px] gap-y-[22px]"
        aria-busy={isLoading}
      >
        {isLoading
          ? Array.from({ length: 8 }, (_, index) => (
              <StampRegionCardSkeleton key={index} />
            ))
          : stamp?.stamps.map((stamp) => (
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
  hasNextPage: boolean;
  fetchNextPage: () => Promise<unknown>;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  isFetchNextPageError: boolean;
};
function HistorySection({
  data, isLoading, isError, hasNextPage, fetchNextPage,
  isFetching, isFetchingNextPage, isFetchNextPageError,
}: HistorySectionProps) {
  const loadMoreRef = useInfiniteScroll({
    hasNextPage, isFetching, isError, fetchNextPage,
  });
  return (
    <>
      <p className="m-0 text-[14px] font-medium leading-[20px] text-[#A2A9B2]">
        최근 보상 내역
      </p>

      <div className="mt-[16px] flex flex-col gap-[10px]" aria-busy={isLoading || isFetchingNextPage}>
        {isLoading ? (
          Array.from({ length: 5 }, (_, index) => (
            <NotificationCardSkeleton key={index} showDescription={false} />
          ))
        ) : (
          <>
            {isError && !isFetchNextPageError && (
              <RewardError message="보상 내역을 불러오지 못했어요." />
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
            {isFetchingNextPage && Array.from({ length: 5 }, (_, index) => (
              <NotificationCardSkeleton key={`next-${index}`} showDescription={false} />
            ))}
            {isFetchNextPageError && (
              <RewardError message="다음 보상 내역을 불러오지 못했어요. 잠시 후 다시 확인해 주세요." />
            )}
            {hasNextPage && !isError && (
              <div ref={loadMoreRef} className="h-px shrink-0" aria-hidden="true" />
            )}
          </>
        )}
      </div>
    </>
  );
}

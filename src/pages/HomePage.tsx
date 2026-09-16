import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { SearchInput } from "@/components/UI";
import HomeHeader from "@/components/home/HomeHeader";
import HomeHero from "@/components/home/HomeHero";
import CategoryGrid from "@/components/home/CategoryGrid";
import RecommendedMissionSection from "@/components/home/RecommendedMissionSection";
import NearbySpotSection from "@/components/home/NearbySpotSection";
import BonusBanner from "@/components/home/BonusBanner";

import QuespotPageLayout, {
  QuespotDivider,
  QuespotPageContent,
} from "@/layouts/QuespotPageLayout";

import { homeCategories } from "@/data/quespot";

import { useNearbyMissionSpots } from "@/hooks/queries/useNearbyMissionSpots";
import { useHomeProfile } from "@/hooks/queries/useHomeProfile";
import { useToggleMissionLike } from "@/hooks/mutation/useToggleMissionLike";
import { useRecommendedMissions } from "@/hooks/queries/useRecommendedMissions";
import { useCurrentCoordinates } from "@/hooks/useCurrentCoordinates";
import { toRecommendedMissionCard } from "@/utils/recommendedMission";
import { getEquippedQuestyAsset } from "@/utils/questyAsset";

import { PATH } from "@/routes/paths";
import type { MissionCategory } from "@/types/mission";

import { Header } from "@/components/common/Header";
import DefaultQuestySvg from "@/assets/questy.svg";

const HOME_CATEGORY_API_VALUES: Record<string, MissionCategory> = {
  history: "HISTORY",
  culture: "CULTURE",
  nature: "NATURE",
  food: "FOOD",
  night: "NIGHT_VIEW",
  etc: "ETC",
};

export default function HomePage() {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const { profileQuery, questyQuery } = useHomeProfile();
  const { toggleMissionLike, pendingMissionId } = useToggleMissionLike();
  const { coordinates, status: locationStatus } = useCurrentCoordinates();
  const nickname =
    profileQuery.data?.nickname || readStoredNickname() || "탐험가";
  const questySrc =
    getEquippedQuestyAsset(questyQuery.data?.equippedItems ?? []) ??
    DefaultQuestySvg;
  const recommendedMissionQuery = useRecommendedMissions({
    ...coordinates,
    size: 2,
  });
  const nearbySpotQuery = useNearbyMissionSpots(
    coordinates ? { ...coordinates, limit: 5 } : undefined,
  );
  const recommendedMissions =
    recommendedMissionQuery.data?.result.missions.map(
      toRecommendedMissionCard,
    ) ?? [];

  return (
    <QuespotPageLayout className="bg-[#F2F7FF]">
      <Header />

      <QuespotPageContent className="bg-[#F2F7FF] pb-[22px]">
        <section className="shrink-0 bg-[linear-gradient(180deg,#dff3ff_0%,#eaf7ff_100%)] px-[18px] pb-[22px] pt-[14px]">
          <HomeHero
            nickname={nickname}
            questySrc={questySrc}
            onExploreClick={() => navigate(PATH.MISSIONS)}
          />

          <div className="mt-[18px]">
            <SearchInput
              onChange={setSearchKeyword}
              onSearch={(keyword) => {
                const trimmedKeyword = keyword.trim();
                if (!trimmedKeyword) return;
                navigate(
                  `${PATH.MISSIONS}?keyword=${encodeURIComponent(trimmedKeyword)}`,
                );
              }}
              placeholder="미션 · 장소 · 지역을 검색해보세요"
              value={searchKeyword}
            />
          </div>
        </section>

        <section className="px-[18px] pt-[24px]">
          <div>
            <CategoryGrid
              categories={homeCategories}
              onCategoryClick={(categoryId) => {
                const category = HOME_CATEGORY_API_VALUES[categoryId];
                if (category) {
                  navigate(`${PATH.MISSIONS}?category=${category}`);
                }
              }}
            />
          </div>

          <div className="mt-[28px]">
            <RecommendedMissionSection
              missions={recommendedMissions}
              isLoading={recommendedMissionQuery.isLoading}
              isError={recommendedMissionQuery.isError}
              onRetry={() => recommendedMissionQuery.refetch()}
              onShowAll={() => navigate(PATH.RECOMMENDED_MISSIONS)}
              pendingLikeMissionId={pendingMissionId}
              onMissionLikeClick={(mission) =>
                toggleMissionLike({
                  missionId: Number(mission.id),
                  liked: Boolean(mission.liked),
                })
              }
              onMissionClick={(mission) =>
                navigate(
                  PATH.MISSION_DETAIL.replace(":missionId", String(mission.id)),
                )
              }
            />
          </div>

          <div className="mt-[30px]">
            <NearbySpotSection
              spots={
                nearbySpotQuery.data?.missionSpots.map((spot) => ({
                  id: spot.districtCode,
                  name: spot.districtName,
                  distance: formatSpotDistance(spot.distanceMeters),
                  done: spot.completionStatus === "COMPLETED",
                  missionCount: spot.missionCount,
                  completedMissionCount: spot.completedMissionCount,
                })) ?? []
              }
              isLoading={
                locationStatus === "loading" || nearbySpotQuery.isLoading
              }
              isError={locationStatus === "error" || nearbySpotQuery.isError}
              errorMessage={
                locationStatus === "error"
                  ? "주변 스팟을 보려면 위치 권한을 허용해주세요."
                  : "주변 스팟을 불러오지 못했어요."
              }
              onRetry={
                nearbySpotQuery.isError
                  ? () => nearbySpotQuery.refetch()
                  : undefined
              }
              onMapClick={() => navigate(PATH.MAP)}
              onSpotClick={() => navigate(PATH.MAP)}
            />
          </div>

          <div className="mb-[16px] mt-[28px]">
            <BonusBanner mascotSrc={DefaultQuestySvg} />
          </div>
        </section>
      </QuespotPageContent>
    </QuespotPageLayout>
  );
}

function formatSpotDistance(distanceMeters: number) {
  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)}m`;
  }

  return `${(distanceMeters / 1000).toFixed(1)}km`;
}

function readStoredNickname() {
  try {
    const profile = JSON.parse(
      localStorage.getItem("quespot-profile") ?? "{}",
    ) as { nickname?: string };
    return profile.nickname;
  } catch {
    return undefined;
  }
}

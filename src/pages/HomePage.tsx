import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { SearchInput } from "@/components/UI";
import HomeHeader from "@/components/home/HomeHeader";
import HomeHero from "@/components/home/HomeHero";
import ActivitySummary from "@/components/home/ActivitySummary";
import CategoryGrid from "@/components/home/CategoryGrid";
import RecommendedMissionSection from "@/components/home/RecommendedMissionSection";
import NearbySpotSection from "@/components/home/NearbySpotSection";
import BonusBanner from "@/components/home/BonusBanner";

import QuespotPageLayout, {
  QuespotDivider,
  QuespotPageContent,
} from "@/layouts/QuespotPageLayout";

import {
  figmaAssets,
  homeCategories,
  nearbySpots,
  recommendedMissions,
} from "@/data/quespot";

import { PATH } from "@/routes/paths";
import QuestySvg from "@/assets/icons/Questy.svg";

export default function HomePage() {
  const navigate = useNavigate();
  const [showAllMissions, setShowAllMissions] = useState(false);

  const visibleMissions = showAllMissions
    ? recommendedMissions
    : recommendedMissions.slice(0, 2);

  return (
    <QuespotPageLayout className="bg-[#F2F7FF]">
      <HomeHeader
        mascotSrc={QuestySvg}
        notificationCount={3}
        onBellClick={() => {
          // TODO: 알림함 페이지 연결
        }}
      />

      <QuespotDivider />

      <QuespotPageContent className="bg-[#F2F7FF] px-[18px] pb-[22px]">
        <HomeHero
          nickname="꿀법"
          mascotSrc={figmaAssets.heroMascot || QuestySvg}
          onExploreClick={() => navigate(PATH.MISSIONS)}
        />

        <div className="mt-[18px]">
          <SearchInput placeholder="미션 · 장소 · 지역을 검색해보세요" />
        </div>

        <div className="mt-[28px]">
          <ActivitySummary
            items={[
              { value: "2개", label: "완료 미션" },
              { value: "350P", label: "보유 포인트" },
              { value: "2개", label: "획득 배지" },
              { value: "2개", label: "스탬프" },
            ]}
          />
        </div>

        <div className="mt-[26px]">
          <CategoryGrid categories={homeCategories} />
        </div>

        <div className="mt-[28px]">
          <RecommendedMissionSection
            missions={visibleMissions}
            showAll={showAllMissions}
            onToggleShowAll={() => setShowAllMissions((value) => !value)}
            onMissionClick={() => navigate(PATH.MISSION_DETAIL)}
          />
        </div>

        <div className="mt-[30px]">
          <NearbySpotSection
            spots={nearbySpots}
            onMapClick={() => navigate(PATH.MAP)}
            onSpotClick={(spot) => {
              if (spot.done) {
                navigate(PATH.MISSION_RECORD);
                return;
              }

              navigate(PATH.MISSION_DETAIL);
            }}
          />
        </div>

        <div className="mb-[16px] mt-[28px]">
          <BonusBanner mascotSrc={QuestySvg} />
        </div>
      </QuespotPageContent>
    </QuespotPageLayout>
  );
}
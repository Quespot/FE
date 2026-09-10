import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock3,
  Coins,
  Loader2,
  MapPin,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import HomeHeader from "@/components/home/HomeHeader";
import QuespotPageLayout, {
  QuespotDivider,
  QuespotPageContent,
} from "@/layouts/QuespotPageLayout";
import { useMissions } from "@/hooks/queries/useMissions";
import type { MissionCategory, MissionItem } from "@/types/mission";
import { PATH } from "@/routes/paths";
import QuestySvg from "@/assets/icons/Questy.svg";

type LatLng = {
  lat: number;
  lng: number;
};

type LocationStatus = "loading" | "success" | "error";

type CategoryOption = {
  label: string;
  value?: MissionCategory;
};

const DEFAULT_LOCATION: LatLng = {
  lat: 37.5752,
  lng: 126.9812,
};

const CATEGORY_OPTIONS: CategoryOption[] = [
  {
    label: "전체",
  },
  {
    label: "역사",
    value: "HISTORY",
  },
  {
    label: "문화",
    value: "CULTURE",
  },
  {
    label: "자연",
    value: "NATURE",
  },
  {
    label: "음식",
    value: "FOOD",
  },
  {
    label: "쇼핑",
    value: "SHOPPING",
  },
  {
    label: "활동",
    value: "ACTIVITY",
  },
];

export default function MissionPage() {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState<
    MissionCategory | undefined
  >(undefined);
  const [keyword, setKeyword] = useState("");

  const { currentLocation, locationStatus } = useCurrentLocation();

  const { data, isLoading, isError, refetch, isFetching } = useMissions({
    category: selectedCategory,
    keyword,
    latitude: currentLocation.lat,
    longitude: currentLocation.lng,
    size: 20,
  });

  const missions = data?.result?.missions ?? [];

  const handleMoveMissionDetail = (missionId: number) => {
    navigate(PATH.MISSION_DETAIL.replace(":missionId", String(missionId)));
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

      <section className="shrink-0 bg-white px-[16px] pb-[18px] pt-[22px]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="m-0 text-[24px] font-black leading-[32px] text-[#1C1C3A]">
              미션 탐색
            </h1>

            <p className="m-0 mt-[4px] text-[13px] font-medium leading-[18px] text-[#A2A9B2]">
              지금 주변에서 시작할 수 있는 미션이에요
            </p>
          </div>

          <span className="inline-flex h-[32px] items-center gap-[7px] rounded-full bg-[#E8FBF3] px-[13px] text-[12px] font-black text-[#008A3D]">
            <i className="h-[8px] w-[8px] rounded-full bg-[#00C950]" />
            {locationStatus === "success" ? "현재 위치" : "서울 기준"}
          </span>
        </div>

        <div className="mt-[18px] flex h-[48px] items-center gap-[10px] rounded-[16px] bg-[#EAF5FF] px-[16px] text-[#A2A9B2]">
          <Search size={18} strokeWidth={2.2} />

          <input
            type="text"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="지역 · 장소 · 미션 검색"
            className="h-full min-w-0 flex-1 bg-transparent text-[14px] font-medium leading-[20px] text-[#1C1C3A] outline-none placeholder:text-[#A2A9B2]"
          />

          <SlidersHorizontal size={18} strokeWidth={2.2} />
        </div>

        <div className="no-scrollbar mt-[14px] flex gap-[8px] overflow-x-auto pb-[2px]">
          {CATEGORY_OPTIONS.map((category) => {
            const isSelected = selectedCategory === category.value;

            return (
              <button
                key={category.label}
                type="button"
                onClick={() => setSelectedCategory(category.value)}
                className={[
                  "h-[36px] shrink-0 rounded-full px-[15px] text-[13px] font-black transition active:scale-[0.98]",
                  isSelected
                    ? "bg-[#5BB5F8] text-white shadow-[0_4px_10px_rgba(91,181,248,0.22)]"
                    : "bg-[#F4F8FF] text-[#A2A9B2]",
                ].join(" ")}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </section>

      <QuespotPageContent className="bg-[#F4F8FF] px-[16px] py-[16px]">
        <section className="mb-[16px] flex shrink-0 items-center justify-between rounded-[18px] bg-[#DFF3FF] px-[16px] py-[14px]">
          <div>
            <p className="m-0 text-[13px] font-black leading-[18px] text-[#5BB5F8]">
              오늘의 추천 미션
            </p>

            <p className="m-0 mt-[4px] text-[12px] font-medium leading-[17px] text-[#7B8794]">
              가까운 장소에서 미션을 시작해보세요
            </p>
          </div>

          <img
            src={QuestySvg}
            alt="퀘스티"
            className="h-[54px] w-[54px] object-contain"
          />
        </section>

        {isLoading ? (
          <MissionLoading />
        ) : null}

        {isError ? <MissionError onRetry={refetch} /> : null}

        {!isLoading && !isError ? (
          missions.length > 0 ? (
            <>
              <div className="mb-[12px] flex items-center justify-between">
                <h2 className="m-0 text-[18px] font-black leading-[25px] text-[#1C1C3A]">
                  미션 목록
                </h2>

                <span className="text-[12px] font-bold leading-[16px] text-[#A2A9B2]">
                  {isFetching ? "업데이트 중" : `${missions.length}개`}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-[12px]">
                {missions.map((mission) => (
                  <MissionCard
                    key={mission.missionId}
                    mission={mission}
                    onClick={() => handleMoveMissionDetail(mission.missionId)}
                  />
                ))}
              </div>
            </>
          ) : (
            <MissionEmpty keyword={keyword} />
          )
        ) : null}
      </QuespotPageContent>
    </QuespotPageLayout>
  );
}

function useCurrentLocation() {
  const [currentLocation, setCurrentLocation] =
    useState<LatLng>(DEFAULT_LOCATION);
  const [locationStatus, setLocationStatus] =
    useState<LocationStatus>("loading");

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationStatus("success");
      },
      () => {
        setLocationStatus("error");
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 1000 * 60 * 5,
      },
    );
  }, []);

  return {
    currentLocation,
    locationStatus,
  };
}

type MissionCardProps = {
  mission: MissionItem;
  onClick: () => void;
};

function MissionCard({ mission, onClick }: MissionCardProps) {
  const isCompleted = mission.userMissionStatus === "COMPLETED";
  const isLocked = mission.userMissionStatus === "LOCKED" || !mission.canStart;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLocked}
      className={[
        "min-h-[206px] overflow-hidden rounded-[18px] border bg-white text-left shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition active:scale-[0.99]",
        isLocked
          ? "border-[#EEF2F6] opacity-55"
          : "border-[#EAF5FF] active:border-[#5BB5F8]",
      ].join(" ")}
    >
      <div className="relative h-[96px] w-full overflow-hidden bg-[#EAF5FF]">
        {mission.imageUrl ? (
          <img
            src={mission.imageUrl}
            alt={mission.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-[34px]">
            {getCategoryEmoji(mission.category)}
          </div>
        )}

        <span className="absolute left-[10px] top-[10px] rounded-full bg-white/90 px-[9px] py-[5px] text-[10px] font-black leading-none text-[#5BB5F8] backdrop-blur">
          {getCategoryLabel(mission.category)}
        </span>

        {isCompleted ? (
          <span className="absolute right-[10px] top-[10px] rounded-full bg-[#E8FBF3] px-[9px] py-[5px] text-[10px] font-black leading-none text-[#00A85A]">
            완료
          </span>
        ) : null}

        {isLocked ? (
          <span className="absolute right-[10px] top-[10px] rounded-full bg-[#F1F5F9] px-[9px] py-[5px] text-[10px] font-black leading-none text-[#94A3B8]">
            잠김
          </span>
        ) : null}
      </div>

      <div className="p-[12px]">
        <h3 className="m-0 line-clamp-2 min-h-[40px] text-[14px] font-black leading-[20px] text-[#1C1C3A]">
          {mission.title}
        </h3>

        <p className="m-0 mt-[6px] truncate text-[12px] font-medium leading-[17px] text-[#A2A9B2]">
          {mission.spotName}
        </p>

        <p className="m-0 mt-[4px] line-clamp-1 text-[10px] font-medium leading-[14px] text-[#B5BBC4]">
          {mission.address}
        </p>

        <div className="mt-[10px] flex items-center justify-between">
          <span className="inline-flex items-center gap-[4px] text-[10px] font-bold leading-none text-[#A2A9B2]">
            <Clock3 size={12} strokeWidth={2.3} />
            {mission.estimatedMinutes}분
          </span>

          <span className="inline-flex items-center gap-[4px] text-[10px] font-black leading-none text-[#F59E0B]">
            <Coins size={12} strokeWidth={2.3} />
            {mission.rewardPoint}P
          </span>
        </div>

        <div className="mt-[10px] flex items-center justify-between">
          <span className="inline-flex items-center gap-[4px] text-[10px] font-bold leading-none text-[#FF2D45]">
            <MapPin size={12} strokeWidth={2.3} />
            {formatDistance(mission.distanceMeters)}
          </span>

          <span
            className={[
              "rounded-full px-[8px] py-[5px] text-[10px] font-black leading-none",
              mission.canStart
                ? "bg-[#EAF5FF] text-[#5BB5F8]"
                : "bg-[#F1F5F9] text-[#94A3B8]",
            ].join(" ")}
          >
            {mission.canStart ? "시작 가능" : "시작 불가"}
          </span>
        </div>
      </div>
    </button>
  );
}

function MissionLoading() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center py-[90px] text-center">
      <Loader2
        size={34}
        strokeWidth={2.4}
        className="animate-spin text-[#5BB5F8]"
      />

      <p className="m-0 mt-[16px] text-[14px] font-bold leading-[20px] text-[#A2A9B2]">
        미션 목록을 불러오는 중이에요
      </p>
    </section>
  );
}

type MissionErrorProps = {
  onRetry: () => void;
};

function MissionError({ onRetry }: MissionErrorProps) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center py-[90px] text-center">
      <div className="grid h-[72px] w-[72px] place-items-center rounded-full bg-[#FFECEF] text-[32px]">
        !
      </div>

      <h2 className="m-0 mt-[18px] text-[17px] font-black leading-[24px] text-[#1C1C3A]">
        미션 목록을 불러오지 못했어요
      </h2>

      <p className="m-0 mt-[8px] text-[13px] font-medium leading-[20px] text-[#A2A9B2]">
        잠시 후 다시 시도해주세요.
      </p>

      <button
        type="button"
        onClick={() => onRetry()}
        className="mt-[20px] h-[42px] rounded-full bg-[#5BB5F8] px-[20px] text-[13px] font-black leading-none text-white"
      >
        다시 불러오기
      </button>
    </section>
  );
}

type MissionEmptyProps = {
  keyword: string;
};

function MissionEmpty({ keyword }: MissionEmptyProps) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center py-[90px] text-center">
      <div className="grid h-[72px] w-[72px] place-items-center rounded-full bg-[#EAF5FF] text-[30px]">
        🔍
      </div>

      <h2 className="m-0 mt-[18px] text-[17px] font-black leading-[24px] text-[#1C1C3A]">
        검색 결과가 없어요
      </h2>

      <p className="m-0 mt-[8px] break-keep text-[13px] font-medium leading-[20px] text-[#A2A9B2]">
        {keyword
          ? `"${keyword}"에 해당하는 미션을 찾을 수 없어요.`
          : "현재 조건에 해당하는 미션이 없어요."}
      </p>
    </section>
  );
}

function getCategoryLabel(category: MissionCategory) {
  const categoryLabelMap: Record<MissionCategory, string> = {
    HISTORY: "역사",
    CULTURE: "문화",
    NATURE: "자연",
    FOOD: "음식",
    SHOPPING: "쇼핑",
    ACTIVITY: "활동",
  };

  return categoryLabelMap[category];
}

function getCategoryEmoji(category: MissionCategory) {
  const categoryEmojiMap: Record<MissionCategory, string> = {
    HISTORY: "🏯",
    CULTURE: "🎨",
    NATURE: "🌳",
    FOOD: "🍜",
    SHOPPING: "🛍️",
    ACTIVITY: "🏃",
  };

  return categoryEmojiMap[category];
}

function formatDistance(distanceMeters: number | null) {
  if (distanceMeters === null) {
    return "거리 계산 전";
  }

  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)}m`;
  }

  return `${(distanceMeters / 1000).toFixed(1)}km`;
}
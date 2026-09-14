import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Clock3,
  Coins,
  Landmark,
  Leaf,
  Loader2,
  MapPinned,
  MapPin,
  Moon,
  Palette,
  Search,
  SlidersHorizontal,
  Sparkles,
  Utensils,
  type LucideIcon,
} from "lucide-react";

import { Header } from "@/components/common/Header";
import QuespotPageLayout, {
  QuespotDivider,
  QuespotPageContent,
} from "@/layouts/QuespotPageLayout";
import { useInfiniteMissions } from "@/hooks/queries/useInfiniteMissions";
import type {
  MissionCategory,
  MissionItem,
  UserMissionStatus,
} from "@/types/mission";
import { PATH } from "@/routes/paths";

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
    label: "야경·전망",
    value: "NIGHT_VIEW",
  },
  {
    label: "기타",
    value: "ETC",
  },
];

const MISSION_CATEGORY_VALUES = new Set<MissionCategory>([
  "HISTORY",
  "CULTURE",
  "NATURE",
  "FOOD",
  "NIGHT_VIEW",
  "ETC",
]);

const categoryIconMap: Record<MissionCategory, LucideIcon> = {
  HISTORY: Landmark,
  CULTURE: Palette,
  NATURE: Leaf,
  FOOD: Utensils,
  NIGHT_VIEW: Moon,
  ETC: Sparkles,
};

const categoryLabelMap: Record<MissionCategory, string> = {
  HISTORY: "역사",
  CULTURE: "문화",
  NATURE: "자연",
  FOOD: "음식",
  NIGHT_VIEW: "야경·전망",
  ETC: "기타",
};

function getMissionCategory(value: string | null) {
  return value && MISSION_CATEGORY_VALUES.has(value as MissionCategory)
    ? (value as MissionCategory)
    : undefined;
}

export default function MissionPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = getMissionCategory(searchParams.get("category"));

  const [keyword, setKeyword] = useState("");

  const { currentLocation, locationStatus } = useCurrentLocation();

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteMissions({
    category: selectedCategory,
    keyword: keyword.trim() || undefined,
    latitude: currentLocation.lat,
    longitude: currentLocation.lng,
    size: 20,
  });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const missions = useMemo(() => {
    return data?.pages.flatMap((page) => page.result.missions) ?? [];
  }, [data]);

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "180px",
        threshold: 0.1,
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleChangeCategory = (category?: MissionCategory) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);

      if (category) {
        next.set("category", category);
      } else {
        next.delete("category");
      }

      return next;
    });
  };

  const handleMoveMissionDetail = (mission: MissionItem) => {
    navigate(
      PATH.MISSION_DETAIL.replace(":missionId", String(mission.missionId)),
    );
  };

  return (
    <QuespotPageLayout className="bg-[#F4F8FF]">
      <Header />

      <QuespotDivider />

      <section className="shrink-0 bg-white px-[16px] pb-[20px] pt-[24px]">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="m-0 text-[24px] font-black leading-[32px] text-[#1C1C3A]">
              미션 탐색
            </h1>

            <p className="m-0 mt-[4px] text-[13px] font-medium leading-[18px] text-[#A2A9B2]">
              지금 주변에서 시작할 수 있는 미션이에요
            </p>
          </div>

          <span className="mt-[2px] inline-flex h-[34px] items-center gap-[7px] rounded-full bg-[#E8FBF3] px-[14px] text-[12px] font-black text-[#008A3D]">
            <i className="h-[8px] w-[8px] rounded-full bg-[#00C950]" />
            {locationStatus === "success" ? "현재 위치" : "서울 기준"}
          </span>
        </div>

        <label className="mt-[20px] flex h-[48px] w-full items-center gap-[8px] rounded-[16px] bg-[#EAF5FF] px-[16px] text-[#A2A9B2]">
          <Search size={18} strokeWidth={2.2} />

          <input
            type="text"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="지역 · 장소 · 미션 검색"
            className="h-full min-w-0 flex-1 bg-transparent text-[14px] font-medium leading-[20px] text-[#1C1C3A] outline-none placeholder:text-[#A2A9B2]"
          />

          <SlidersHorizontal size={18} strokeWidth={2.2} />
        </label>

        <div className="no-scrollbar mt-[14px] flex gap-[10px] overflow-x-auto pb-[2px]">
          {CATEGORY_OPTIONS.map((category) => {
            const isSelected = selectedCategory === category.value;

            return (
              <button
                key={category.label}
                type="button"
                onClick={() => handleChangeCategory(category.value)}
                className={[
                  "h-[38px] shrink-0 rounded-full px-[18px] text-[14px] font-bold leading-none transition active:scale-[0.98]",
                  isSelected
                    ? "bg-[#5BB5F8] text-white shadow-[0_4px_10px_rgba(91,181,248,0.28)]"
                    : "bg-[#F4F8FF] text-[#A2A9B2]",
                ].join(" ")}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </section>

      <QuespotPageContent className="bg-[#F4F8FF] px-[16px] pb-[24px] pt-[16px]">
        <section className="flex min-h-[82px] shrink-0 items-center justify-between rounded-[16px] bg-[#DFF1FF] px-[16px] py-[14px]">
          <div>
            <p className="m-0 text-[13px] font-black leading-[18px] text-[#5BB5F8]">
              오늘의 추천 미션
            </p>

            <p className="m-0 mt-[4px] text-[12px] font-medium leading-[17px] text-[#5D6A7D]">
              가까운 장소에서 미션을 시작해보세요
            </p>
          </div>

          <div className="flex h-[62px] w-[68px] shrink-0 items-center justify-end" aria-hidden="true">
            <span className="relative grid h-[60px] w-[60px] place-items-center rounded-full border border-white bg-white/65 text-[#50AAE8] shadow-[0_6px_16px_rgba(58,139,197,0.11)]">
              <span className="absolute inset-[6px] rounded-full border border-dashed border-[#B9DDF5]" />
              <MapPinned className="relative" size={30} strokeWidth={2} />
            </span>
          </div>
        </section>

        <section className="mt-[20px]">
          <h2 className="m-0 text-[21px] font-black leading-[28px] text-[#1C1C3A]">
            미션 목록
          </h2>
        </section>

        {isLoading ? <MissionListLoading /> : null}

        {isError ? <MissionListError onRetry={() => refetch()} /> : null}

        {!isLoading && !isError && missions.length === 0 ? (
          <MissionListEmpty keyword={keyword} />
        ) : null}

        {!isLoading && !isError && missions.length > 0 ? (
          <>
            <div className="mt-[14px] grid grid-cols-2 gap-x-[12px] gap-y-[14px]">
              {missions.map((mission) => (
                <MissionCard
                  key={mission.missionId}
                  mission={mission}
                  onClick={() => handleMoveMissionDetail(mission)}
                />
              ))}
            </div>

            <div ref={loadMoreRef} className="h-[24px] shrink-0" />

            {isFetchingNextPage ? (
              <div className="flex h-[56px] items-center justify-center gap-[8px] text-[13px] font-bold text-[#5BB5F8]">
                <Loader2 size={18} strokeWidth={2.4} className="animate-spin" />
                미션을 더 불러오는 중이에요
              </div>
            ) : null}

            {!hasNextPage ? (
              <p className="m-0 py-[20px] text-center text-[12px] font-bold leading-[18px] text-[#A2A9B2]">
                모든 미션을 불러왔어요
              </p>
            ) : null}
          </>
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
  const Icon = categoryIconMap[mission.category] ?? Sparkles;
  const isLocked = mission.userMissionStatus === "LOCKED";
  const isCompleted = mission.userMissionStatus === "COMPLETED";
  const statusStyle = getMissionStatusStyle(mission.userMissionStatus);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLocked}
      className={[
        "min-h-[276px] overflow-hidden rounded-[18px] border bg-white text-left shadow-[0_2px_8px_rgba(8,37,95,0.08)] transition active:scale-[0.99]",
        isLocked
          ? "border-[#EEF2F6] opacity-55"
          : "border-[#EAF5FF] active:border-[#5BB5F8]",
      ].join(" ")}
    >
      <div className="relative h-[104px] overflow-hidden bg-[#EAF5FF]">
        {mission.imageUrl ? (
          <img
            src={mission.imageUrl}
            alt={mission.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-[#5BB5F8]">
            <Icon size={36} strokeWidth={2.2} />
          </div>
        )}

        <span className="absolute left-[10px] top-[10px] inline-flex h-[24px] items-center gap-[4px] rounded-full bg-white px-[9px] text-[11px] font-black leading-none text-[#5BB5F8] shadow-[0_2px_6px_rgba(8,37,95,0.12)]">
          <Icon size={12} strokeWidth={2.5} />
          {categoryLabelMap[mission.category]}
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

      <div className="flex min-h-[172px] flex-col px-[12px] pb-[12px] pt-[12px]">
        <strong className="line-clamp-2 min-h-[42px] text-[15px] font-black leading-[21px] text-[#1C1C3A]">
          {mission.title}
        </strong>

        <p className="m-0 mt-[10px] truncate text-[12px] font-bold leading-[17px] text-[#A2A9B2]">
          {mission.spotName}
        </p>

        <p className="m-0 mt-[3px] truncate text-[11px] font-medium leading-[16px] text-[#A2A9B2]">
          {mission.address}
        </p>

        <div className="mt-[10px] flex items-center justify-between">
          <span className="inline-flex items-center gap-[4px] text-[11px] font-bold leading-none text-[#A2A9B2]">
            <Clock3 size={13} strokeWidth={2.3} />약{" "}
            {mission.estimatedMinutes}분
          </span>

          <span className="inline-flex items-center gap-[4px] text-[11px] font-black leading-none text-[#F59E0B]">
            <Coins size={13} strokeWidth={2.4} />
            {mission.rewardPoint}P
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-[12px]">
          <span className="inline-flex items-center gap-[4px] text-[11px] font-black leading-none text-[#FF2D45]">
            <MapPin size={13} strokeWidth={2.5} />
            {formatDistance(mission.distanceMeters)}
          </span>

          <span
            className={[
              "h-[24px] rounded-full px-[10px] text-[11px] font-black leading-[24px]",
              statusStyle,
            ].join(" ")}
          >
            {getMissionStatusLabel(mission.userMissionStatus, mission.canStart)}
          </span>
        </div>
      </div>
    </button>
  );
}

function MissionListLoading() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center py-[120px] text-center">
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

type MissionListErrorProps = {
  onRetry: () => void;
};

function MissionListError({ onRetry }: MissionListErrorProps) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center py-[120px] text-center">
      <div className="grid h-[72px] w-[72px] place-items-center rounded-full bg-[#FFECEF] text-[32px] text-[#1C1C3A]">
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
        className="mt-[20px] h-[42px] rounded-full bg-[#5BB5F8] px-[22px] text-[13px] font-black leading-none text-white"
      >
        다시 불러오기
      </button>
    </section>
  );
}

type MissionListEmptyProps = {
  keyword: string;
};

function MissionListEmpty({ keyword }: MissionListEmptyProps) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center py-[120px] text-center">
      <div className="grid h-[72px] w-[72px] place-items-center rounded-full bg-[#EAF5FF] text-[32px]">
        🔍
      </div>

      <h2 className="m-0 mt-[18px] text-[17px] font-black leading-[24px] text-[#1C1C3A]">
        검색 결과가 없어요
      </h2>

      <p className="m-0 mt-[8px] break-keep text-[13px] font-medium leading-[20px] text-[#A2A9B2]">
        {keyword.trim()
          ? `"${keyword.trim()}"에 해당하는 미션을 찾을 수 없어요.`
          : "현재 조건에 해당하는 미션이 없어요."}
      </p>
    </section>
  );
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

function getMissionStatusLabel(status: UserMissionStatus, canStart: boolean) {
  if (status === "COMPLETED") return "완료";
  if (status === "IN_PROGRESS") return "진행중";
  if (status === "LOCKED") return "잠김";
  if (canStart) return "시작 가능";

  return "시작 불가";
}

function getMissionStatusStyle(status: UserMissionStatus) {
  if (status === "COMPLETED") {
    return "bg-[#E8FBF3] text-[#00C950]";
  }

  if (status === "IN_PROGRESS") {
    return "bg-[#FFF6D9] text-[#F59E0B]";
  }

  if (status === "LOCKED") {
    return "bg-[#F1F5F9] text-[#94A3B8]";
  }

  return "bg-[#EAF5FF] text-[#5BB5F8]";
}

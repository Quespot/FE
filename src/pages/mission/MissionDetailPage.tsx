import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Building2,
  Check,
  Clock3,
  Crosshair,
  Heart,
  Landmark,
  Leaf,
  Loader2,
  Lock,
  MapPin,
  Palette,
  ShoppingBag,
  Sparkles,
  Utensils,
  Zap,
  type LucideIcon,
} from "lucide-react";

import HomeHeader from "@/components/home/HomeHeader";
import QuespotPageLayout, {
  QuespotDivider,
  QuespotPageContent,
} from "@/layouts/QuespotPageLayout";
import { useMissionDetail } from "@/hooks/queries/useMissionDetail";
import { useStartMissionAttempt } from "@/hooks/mutation/useStartMissionAttempt";
import type { MissionCategory, MissionDetail } from "@/types/mission";
import { PATH } from "@/routes/paths";
import QuestySvg from "@/assets/icons/Questy.svg";

type LatLng = {
  lat: number;
  lng: number;
};

type LocationStatus = "loading" | "success" | "error";

type MissionStep = {
  label: string;
  targetPath?: string;
};

const DEFAULT_LOCATION: LatLng = {
  lat: 37.5752,
  lng: 126.9812,
};

const categoryIconMap: Record<MissionCategory, LucideIcon> = {
  HISTORY: Landmark,
  CULTURE: Palette,
  NATURE: Leaf,
  FOOD: Utensils,
  SHOPPING: ShoppingBag,
  ACTIVITY: Zap,
};

const CATEGORY_STYLE: Record<
  MissionCategory,
  {
    hero: string;
    heroIcon: string;
    chipText: string;
  }
> = {
  HISTORY: {
    hero: "bg-[#B794FF]",
    heroIcon: "text-[#8B5CF6]",
    chipText: "text-[#8B5CF6]",
  },
  CULTURE: {
    hero: "bg-[#92C7FF]",
    heroIcon: "text-[#3B82F6]",
    chipText: "text-[#3B82F6]",
  },
  NATURE: {
    hero: "bg-[#7EE4BB]",
    heroIcon: "text-[#10B981]",
    chipText: "text-[#10B981]",
  },
  FOOD: {
    hero: "bg-[#FFD778]",
    heroIcon: "text-[#E58A14]",
    chipText: "text-[#E58A14]",
  },
  SHOPPING: {
    hero: "bg-[#FDB9D4]",
    heroIcon: "text-[#EC4899]",
    chipText: "text-[#EC4899]",
  },
  ACTIVITY: {
    hero: "bg-[#FFB86B]",
    heroIcon: "text-[#F97316]",
    chipText: "text-[#F97316]",
  },
};

const missionSteps: MissionStep[] = [
  {
    label: "장소로 이동",
    targetPath: PATH.MISSION_ROUTE,
  },
  {
    label: "GPS 도착 인증",
    targetPath: PATH.MISSION_VERIFY,
  },
  {
    label: "사진 촬영 & 제출",
    targetPath: PATH.MISSION_VERIFY,
  },
  {
    label: "AI 자동 검증",
  },
  {
    label: "보상 수령",
    targetPath: PATH.REWARDS,
  },
];

export default function MissionDetailPage() {
  const navigate = useNavigate();
  const params = useParams();

  const missionId = Number(params.missionId);
  const { currentLocation } = useCurrentLocation();

  const { mutate: startMission, isPending: isStartingMission } =
    useStartMissionAttempt();

  const { data, isLoading, isError, refetch } = useMissionDetail({
    missionId,
    latitude: currentLocation.lat,
    longitude: currentLocation.lng,
  });

  const mission = data?.result;

  const routePlace = useMemo(() => {
    if (!mission) return null;

    return {
      id: mission.missionId,
      name: mission.spotName,
      area: mission.address,
      emoji: getCategoryEmoji(mission.category),
      lat: mission.latitude,
      lng: mission.longitude,
      duration: `도보 약 ${mission.estimatedMinutes}분`,
      distance: formatDistance(mission.distanceMeters),
      direction: "목적지로",
    };
  }, [mission]);

  const handleMoveRoutePage = () => {
    if (!routePlace) return;

    navigate(PATH.MISSION_ROUTE, {
      state: {
        place: routePlace,
        origin: currentLocation,
      },
    });
  };

  const handleStartMission = () => {
    if (!mission || !mission.canStart || isStartingMission) return;

    startMission(mission.missionId, {
      onSuccess: (attempt) => {
        navigate(PATH.MISSION_VERIFY, {
          state: {
            missionId: mission.missionId,
            attemptId: attempt.attemptId,
            mission,
            missionTitle: mission.title,
          },
        });
      },
      onError: (error) => {
        console.error(error);
        alert("미션을 시작하지 못했어요. 잠시 후 다시 시도해주세요.");
      },
    });
  };

  const handleStepClick = (step: MissionStep) => {
    if (!step.targetPath || !mission) return;

    if (step.targetPath === PATH.MISSION_ROUTE) {
      handleMoveRoutePage();
      return;
    }

    if (step.targetPath === PATH.MISSION_VERIFY) {
      handleStartMission();
      return;
    }

    navigate(step.targetPath, {
      state: {
        missionId: mission.missionId,
        mission,
      },
    });
  };

  const handleMoveRecordPage = () => {
    if (!mission || !mission.canCreateArchive) return;

    navigate(PATH.MISSION_RECORD, {
      state: {
        missionId: mission.missionId,
        mission,
      },
    });
  };

  return (
    <QuespotPageLayout>
      <HomeHeader
        mascotSrc={QuestySvg}
        notificationCount={3}
        onBellClick={() => {
          // TODO: 알림함 연결
        }}
      />

      <QuespotDivider />

      {isLoading ? <MissionDetailLoading /> : null}

      {isError ? <MissionDetailError onRetry={refetch} /> : null}

      {!isLoading && !isError && mission ? (
        <QuespotPageContent>
          <MissionHero mission={mission} />

          <section className="flex flex-col gap-[16px] px-[16px] pb-[24px] pt-[20px]">
            <div className="grid grid-cols-3 gap-[12px]">
              <InfoCard
                icon={<MapPin size={22} strokeWidth={2.4} />}
                iconClassName="bg-[#FFECEF] text-[#FF2D45]"
                value={formatDistance(mission.distanceMeters)}
                label="거리"
              />

              <InfoCard
                icon={<Zap size={22} strokeWidth={2.4} />}
                iconClassName="bg-[#EAF5FF] text-[#5BB5F8]"
                value={`+${mission.rewardPoint}P`}
                label="보상 포인트"
              />

              <InfoCard
                icon={<Clock3 size={22} strokeWidth={2.4} />}
                iconClassName="bg-[#FFF6D9] text-[#F59E0B]"
                value={`약 ${mission.estimatedMinutes}분`}
                label="예상 시간"
              />
            </div>

            <div className="rounded-[16px] border border-[#EAF5FF] bg-white px-[16px] py-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <p className="m-0 text-[12px] font-medium leading-[17px] text-[#A2A9B2]">
                미션 설명
              </p>

              <p className="m-0 mt-[8px] break-keep text-[14px] font-bold leading-[22px] text-[#1C1C3A]">
                {mission.description || "장소에 방문해 미션을 수행해보세요."}
              </p>
            </div>

            <div className="h-[2px] rounded-full bg-[#EAF5FF]" />

            <section className="rounded-[16px] border border-[#EAF5FF] bg-white px-[16px] py-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <header className="flex items-center gap-[10px]">
                <span className="grid h-[28px] w-[28px] place-items-center rounded-full bg-[#EAF5FF] text-[#5BB5F8]">
                  <Crosshair size={15} strokeWidth={2.4} />
                </span>

                <h2 className="m-0 text-[15px] font-black leading-[20px] text-[#1C1C3A]">
                  수행 방법
                </h2>
              </header>

              <ol className="mt-[16px] flex flex-col gap-[12px] p-0">
                {missionSteps.map((step, index) => {
                  const isLinked = Boolean(step.targetPath);
                  const isVerifyStep = step.targetPath === PATH.MISSION_VERIFY;

                  return (
                    <li key={step.label}>
                      <button
                        type="button"
                        onClick={() => handleStepClick(step)}
                        disabled={!isLinked || (isVerifyStep && isStartingMission)}
                        className={[
                          "grid w-full grid-cols-[32px_minmax(0,1fr)_24px] items-center gap-[12px] rounded-[12px] bg-transparent p-0 text-left transition",
                          isLinked
                            ? "cursor-pointer active:scale-[0.99]"
                            : "cursor-default",
                          isVerifyStep && isStartingMission
                            ? "opacity-60"
                            : "opacity-100",
                        ].join(" ")}
                      >
                        <span className="grid h-[28px] w-[28px] place-items-center rounded-full bg-[#E8FBF3] text-[#00C950]">
                          <Check size={16} strokeWidth={3} />
                        </span>

                        <span className="text-[14px] font-bold leading-[20px] text-[#A2A9B2]">
                          {isVerifyStep && isStartingMission
                            ? "미션 시작 중..."
                            : step.label}
                        </span>

                        <span className="grid h-[22px] w-[22px] place-items-center rounded-full bg-[#EAF5FF] text-[11px] font-black text-[#A2A9B2]">
                          {index + 1}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </section>

            <div className="grid grid-cols-2 gap-[12px]">
              <SmallFeatureCard
                icon={<Utensils size={20} strokeWidth={2.4} />}
                iconClassName="bg-[#EAF5FF] text-[#5BB5F8]"
                title="주변 로컬"
                description="맛집 · 카페 추천"
                onClick={() => navigate(PATH.MISSION_LOCAL_RECOMMEND)}
              />

              <SmallFeatureCard
                icon={<Sparkles size={20} strokeWidth={2.4} />}
                iconClassName="bg-[#FFF6D9] text-[#F59E0B]"
                title="보너스 지역"
                description="추가 포인트 안내"
                highlighted
                onClick={() => navigate(PATH.MISSION_BONUS_REGION)}
              />
            </div>

            <MissionRewardCard
              mission={mission}
              isStartingMission={isStartingMission}
              onStartMission={handleStartMission}
              onMoveRecordPage={handleMoveRecordPage}
            />

            <button
              type="button"
              onClick={handleStartMission}
              disabled={!mission.canStart || isStartingMission}
              className={[
                "mt-[4px] h-[52px] rounded-[16px] text-[15px] font-black text-white shadow-[0_8px_18px_rgba(91,181,248,0.28)] transition",
                mission.canStart && !isStartingMission
                  ? "bg-[#5BB5F8] active:scale-[0.99]"
                  : "bg-[#CBD5E1]",
              ].join(" ")}
            >
              {isStartingMission
                ? "미션 시작 중..."
                : mission.canStart
                  ? "미션 인증하기"
                  : "현재 시작할 수 없어요"}
            </button>
          </section>
        </QuespotPageContent>
      ) : null}
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

type MissionHeroProps = {
  mission: MissionDetail;
};

function MissionHero({ mission }: MissionHeroProps) {
  const Icon = categoryIconMap[mission.category] ?? Building2;
  const style = CATEGORY_STYLE[mission.category];
  const isCompleted = mission.userMissionStatus === "COMPLETED";
  const isLocked = mission.userMissionStatus === "LOCKED" || !mission.canStart;

  return (
    <section className="relative h-[220px] min-h-[220px] w-full shrink-0 overflow-hidden">
      {mission.imageUrl ? (
        <img
          src={mission.imageUrl}
          alt={mission.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div
          className={[
            "absolute inset-0",
            style.hero,
            "bg-[linear-gradient(90deg,rgba(28,28,58,0.08)_1px,transparent_1px),linear-gradient(0deg,rgba(28,28,58,0.08)_1px,transparent_1px)] bg-[length:40px_40px]",
          ].join(" ")}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-[#F4F8FF]" />

      {!mission.imageUrl ? (
        <Icon
          className={[
            "absolute left-1/2 top-[54px] h-[124px] w-[124px] -translate-x-1/2 opacity-20",
            style.heroIcon,
          ].join(" ")}
          strokeWidth={1.7}
        />
      ) : null}

      <button
        type="button"
        className="absolute right-[20px] top-[20px] z-10 grid h-[44px] w-[44px] place-items-center rounded-full bg-white text-[#A2A9B2] shadow-[0_2px_8px_rgba(8,37,95,0.18)]"
        aria-label="찜하기"
      >
        <Heart
          size={22}
          strokeWidth={2.4}
          fill={mission.liked ? "#FF4D67" : "transparent"}
          className={mission.liked ? "text-[#FF4D67]" : "text-[#A2A9B2]"}
        />
      </button>

      <div className="absolute bottom-[20px] left-[20px] right-[20px] z-10 flex flex-col items-start">
        <div className="flex items-center gap-[8px]">
          <span
            className={[
              "inline-flex h-[26px] items-center gap-[5px] rounded-full bg-white/90 px-[12px] text-[12px] font-black leading-none",
              style.chipText,
            ].join(" ")}
          >
            <Icon size={13} strokeWidth={2.4} />
            {getCategoryLabel(mission.category)}
          </span>

          {isCompleted ? (
            <span className="inline-flex h-[26px] items-center gap-[5px] rounded-full bg-[#E8FBF3] px-[12px] text-[12px] font-black leading-none text-[#00C950]">
              <Check size={13} strokeWidth={3} />
              완료
            </span>
          ) : null}

          {isLocked ? (
            <span className="inline-flex h-[26px] items-center gap-[5px] rounded-full bg-[#F1F5F9] px-[12px] text-[12px] font-black leading-none text-[#94A3B8]">
              <Lock size={13} strokeWidth={2.6} />
              잠김
            </span>
          ) : null}
        </div>

        <h1 className="m-0 mt-[12px] break-keep text-[22px] font-black leading-[30px] text-[#1C1C3A]">
          {mission.title}
        </h1>

        <p className="m-0 mt-[6px] flex items-center gap-[6px] text-[13px] font-medium leading-[18px] text-[#6B7280]">
          <MapPin size={14} strokeWidth={2.2} />
          {mission.spotName}
          <span>·</span>
          {mission.address}
        </p>
      </div>
    </section>
  );
}

type InfoCardProps = {
  icon: ReactNode;
  iconClassName: string;
  value: string;
  label: string;
};

function InfoCard({ icon, iconClassName, value, label }: InfoCardProps) {
  return (
    <article className="flex min-h-[96px] flex-col items-center justify-center rounded-[16px] border border-[#EAF5FF] bg-white px-[12px] py-[12px] text-center shadow-[0_1px_3px_rgba(0,0,0,0.12)]">
      <span
        className={[
          "grid h-[40px] w-[40px] place-items-center rounded-full",
          iconClassName,
        ].join(" ")}
      >
        {icon}
      </span>

      <strong className="mt-[10px] text-[15px] font-black leading-[18px] text-[#1C1C3A]">
        {value}
      </strong>

      <span className="mt-[4px] text-[11px] font-medium leading-[15px] text-[#A2A9B2]">
        {label}
      </span>
    </article>
  );
}

type SmallFeatureCardProps = {
  icon: ReactNode;
  iconClassName: string;
  title: string;
  description: string;
  highlighted?: boolean;
  onClick?: () => void;
};

function SmallFeatureCard({
  icon,
  iconClassName,
  title,
  description,
  highlighted = false,
  onClick,
}: SmallFeatureCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative flex h-[72px] items-center gap-[12px] rounded-[16px] border bg-white px-[12px] py-[12px] text-left shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition active:scale-[0.99]",
        highlighted ? "border-[#FACC15]" : "border-[#EAF5FF]",
      ].join(" ")}
    >
      <span
        className={[
          "grid h-[40px] w-[40px] shrink-0 place-items-center rounded-full",
          iconClassName,
        ].join(" ")}
      >
        {icon}
      </span>

      <div className="min-w-0">
        <strong className="block font-sans text-[13px] font-black leading-[18px] text-[#1C1C3A]">
          {title}
        </strong>

        <p className="m-0 mt-[2px] font-sans text-[10px] font-medium leading-[14px] text-[#A2A9B2]">
          {description}
        </p>
      </div>
    </button>
  );
}

type MissionRewardCardProps = {
  mission: MissionDetail;
  isStartingMission: boolean;
  onStartMission: () => void;
  onMoveRecordPage: () => void;
};

function MissionRewardCard({
  mission,
  isStartingMission,
  onStartMission,
  onMoveRecordPage,
}: MissionRewardCardProps) {
  const isCompleted = mission.userMissionStatus === "COMPLETED";

  if (isCompleted) {
    return (
      <section className="flex items-center gap-[12px] rounded-[16px] border border-[#BBF7D0] bg-[#E8FBF3] px-[16px] py-[16px]">
        <span className="grid h-[48px] w-[48px] shrink-0 place-items-center rounded-[14px] bg-[#C6F7D9] text-[#00C950]">
          <Check size={26} strokeWidth={3} />
        </span>

        <div className="min-w-0 flex-1">
          <strong className="block text-[17px] font-black leading-[21px] text-[#008A3D]">
            미션 완료!
          </strong>

          <p className="m-0 mt-[4px] text-[14px] font-medium leading-[20px] text-[#00C950]">
            +{mission.rewardPoint}P 보상이 지급됐어요
          </p>
        </div>

        <button
          type="button"
          onClick={onMoveRecordPage}
          disabled={!mission.canCreateArchive}
          className={[
            "flex h-[32px] min-w-[76px] shrink-0 items-center justify-center whitespace-nowrap rounded-full px-[12px] font-sans text-[10px] font-black leading-none text-white",
            mission.canCreateArchive ? "bg-[#00D664]" : "bg-[#CBD5E1]",
          ].join(" ")}
        >
          기록 남기기
        </button>
      </section>
    );
  }

  return (
    <section className="flex items-center gap-[12px] rounded-[16px] border border-[#C8E8FF] bg-white px-[16px] py-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <span className="grid h-[48px] w-[48px] shrink-0 place-items-center rounded-[14px] bg-[#EAF5FF] text-[#5BB5F8]">
        <Zap size={25} strokeWidth={2.6} />
      </span>

      <div className="min-w-0 flex-1">
        <strong className="block text-[16px] font-black leading-[21px] text-[#1C1C3A]">
          미션 완료 시 보상 지급
        </strong>

        <p className="m-0 mt-[4px] text-[13px] font-medium leading-[19px] text-[#A2A9B2]">
          +{mission.rewardPoint}P를 받을 수 있어요
        </p>
      </div>

      <button
        type="button"
        onClick={onStartMission}
        disabled={!mission.canStart || isStartingMission}
        className={[
          "flex h-[32px] min-w-[76px] shrink-0 items-center justify-center whitespace-nowrap rounded-full px-[12px] font-sans text-[10px] font-black leading-none text-white",
          mission.canStart && !isStartingMission ? "bg-[#5BB5F8]" : "bg-[#CBD5E1]",
        ].join(" ")}
      >
        {isStartingMission ? "시작 중" : "시작하기"}
      </button>
    </section>
  );
}

function MissionDetailLoading() {
  return (
    <QuespotPageContent className="flex items-center justify-center bg-[#F4F8FF]">
      <section className="flex flex-col items-center text-center">
        <Loader2
          size={34}
          strokeWidth={2.4}
          className="animate-spin text-[#5BB5F8]"
        />

        <p className="m-0 mt-[16px] text-[14px] font-bold leading-[20px] text-[#A2A9B2]">
          미션 상세 정보를 불러오는 중이에요
        </p>
      </section>
    </QuespotPageContent>
  );
}

type MissionDetailErrorProps = {
  onRetry: () => void;
};

function MissionDetailError({ onRetry }: MissionDetailErrorProps) {
  const navigate = useNavigate();

  return (
    <QuespotPageContent className="flex items-center justify-center bg-[#F4F8FF] px-[24px]">
      <section className="flex flex-col items-center text-center">
        <div className="grid h-[72px] w-[72px] place-items-center rounded-full bg-[#FFECEF] text-[32px]">
          !
        </div>

        <h2 className="m-0 mt-[18px] text-[17px] font-black leading-[24px] text-[#1C1C3A]">
          미션 정보를 불러오지 못했어요
        </h2>

        <p className="m-0 mt-[8px] text-[13px] font-medium leading-[20px] text-[#A2A9B2]">
          잠시 후 다시 시도해주세요.
        </p>

        <div className="mt-[20px] flex gap-[8px]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="h-[42px] rounded-full bg-[#EAF5FF] px-[18px] text-[13px] font-black leading-none text-[#5BB5F8]"
          >
            뒤로가기
          </button>

          <button
            type="button"
            onClick={() => onRetry()}
            className="h-[42px] rounded-full bg-[#5BB5F8] px-[18px] text-[13px] font-black leading-none text-white"
          >
            다시 불러오기
          </button>
        </div>
      </section>
    </QuespotPageContent>
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
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
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
  Moon,
  Palette,
  Route,
  ShoppingBag,
  Sparkles,
  Utensils,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { Header } from "@/components/common/Header";
import QuespotPageLayout, {
  QuespotDivider,
  QuespotPageContent,
} from "@/layouts/QuespotPageLayout";
import { useMissionDetail } from "@/hooks/queries/useMissionDetail";
import { useMissionUnlockCondition } from "@/hooks/queries/useMissionUnlockCondition";
import { useStartMissionAttempt } from "@/hooks/mutation/useStartMissionAttempt";
import { useLikeMission } from "@/hooks/mutation/useLikeMission";
import { useUnlikeMission } from "@/hooks/mutation/useUnlikeMission";
import type { MissionCategory, MissionDetail } from "@/types/mission";
import { PATH } from "@/routes/paths";

type LatLng = {
  lat: number;
  lng: number;
};

type MissionStep = {
  label: string;
  targetPath?: string;
};

type CategoryStyle = {
  hero: string;
  heroIcon: string;
  chipText: string;
};

const DEFAULT_LOCATION: LatLng = {
  lat: 37.5752,
  lng: 126.9812,
};

const DEFAULT_CATEGORY_STYLE: CategoryStyle = {
  hero: "bg-[#92C7FF]",
  heroIcon: "text-[#3B82F6]",
  chipText: "text-[#5BB5F8]",
};

const categoryIconMap: Record<string, LucideIcon> = {
  HISTORY: Landmark,
  CULTURE: Palette,
  NATURE: Leaf,
  FOOD: Utensils,
  SHOPPING: ShoppingBag,
  ACTIVITY: Zap,
  NIGHT_VIEW: Moon,
  ETC: Sparkles,
};

const CATEGORY_STYLE: Record<string, CategoryStyle> = {
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
  NIGHT_VIEW: {
    hero: "bg-[#7C8CFF]",
    heroIcon: "text-[#4F46E5]",
    chipText: "text-[#4F46E5]",
  },
  ETC: {
    hero: "bg-[#A8D8FF]",
    heroIcon: "text-[#5BB5F8]",
    chipText: "text-[#5BB5F8]",
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
    label: "보상 수령",
    targetPath: PATH.REWARDS,
  },
];

export default function MissionDetailPage() {
  const navigate = useNavigate();
  const params = useParams();

  const missionId = Number(params.missionId);
  const { currentLocation } = useCurrentLocation();

  const [isLiked, setIsLiked] = useState(false);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

  const { mutate: startMission, isPending: isStartingMission } =
    useStartMissionAttempt();

  const { mutate: likeMission, isPending: isLikingMission } = useLikeMission();

  const { mutate: unlikeMission, isPending: isUnlikingMission } =
    useUnlikeMission();

  const isLikePending = isLikingMission || isUnlikingMission;

  const { data, isLoading, isError, refetch } = useMissionDetail({
    missionId,
    latitude: currentLocation.lat,
    longitude: currentLocation.lng,
  });

  const {
    data: unlockCondition,
    isLoading: isUnlockConditionLoading,
    isError: isUnlockConditionError,
    refetch: refetchUnlockCondition,
  } = useMissionUnlockCondition(missionId);

  const mission = data?.result;

  const isLockedByCondition = unlockCondition?.locked ?? false;
  const unlockMessage =
    unlockCondition?.message || "이전 미션을 먼저 완료해야 시작할 수 있어요.";
  const isMissionCompleted = mission?.userMissionStatus === "COMPLETED";
  const isMissionLocked = mission?.userMissionStatus === "LOCKED";
  const canStartMission = Boolean(
    mission?.canStart &&
      !isLockedByCondition &&
      !isMissionCompleted &&
      !isMissionLocked,
  );

  const isMissionStartBlocked = Boolean(
    !canStartMission || isUnlockConditionLoading,
  );

  useEffect(() => {
    if (!mission) return;

    setIsLiked(mission.liked);
  }, [mission?.missionId, mission?.liked]);

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

  const handleToggleLike = () => {
    if (!mission || isLikePending) return;

    const nextLiked = !isLiked;

    setIsLiked(nextLiked);

    const mutation = nextLiked ? likeMission : unlikeMission;

    mutation(mission.missionId, {
      onError: (error) => {
        console.error(error);
        setIsLiked(!nextLiked);
        alert("좋아요 처리에 실패했어요. 잠시 후 다시 시도해주세요.");
      },
    });
  };

  const handleMoveRoutePage = () => {
    if (!routePlace) return;

    navigate(PATH.MISSION_ROUTE, {
      state: {
        place: routePlace,
        origin: currentLocation,
      },
    });
  };

  const handleMoveCourseCreatePage = () => {
    if (!mission) return;

    navigate(`${PATH.MISSION_COURSE_CREATE}?missionId=${mission.missionId}`, {
      state: {
        missionId: mission.missionId,
        mission: {
          ...mission,
          liked: isLiked,
        },
      },
    });
  };

  const handleStartMission = () => {
    if (!mission || isStartingMission) return;

    if (isUnlockConditionLoading) {
      alert("미션 시작 가능 여부를 확인하고 있어요. 잠시 후 다시 시도해주세요.");
      return;
    }

    if (isLockedByCondition) {
      alert(unlockMessage);
      return;
    }

    if (!canStartMission) {
      alert("현재 이 미션은 시작할 수 없어요.");
      return;
    }

    startMission(mission.missionId, {
      onSuccess: (attempt) => {
        navigate(PATH.MISSION_VERIFY, {
          state: {
            missionId: mission.missionId,
            attemptId: attempt.attemptId,
            mission: {
              ...mission,
              liked: isLiked,
            },
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
        mission: {
          ...mission,
          liked: isLiked,
        },
      },
    });
  };

  const handleMoveRecordPage = () => {
    if (!mission || !mission.canCreateArchive) return;

    navigate(PATH.MISSION_RECORD, {
      state: {
        missionId: mission.missionId,
        mission: {
          ...mission,
          liked: isLiked,
        },
      },
    });
  };

  return (
    <QuespotPageLayout>
      <Header />

      <QuespotDivider />

      {isLoading ? <MissionDetailLoading /> : null}

      {isError ? <MissionDetailError onRetry={refetch} /> : null}

      {!isLoading && !isError && mission ? (
        <QuespotPageContent>
          <MissionHero
            mission={mission}
            isLiked={isLiked}
            isLikePending={isLikePending}
            isLockedByCondition={isLockedByCondition}
            onBack={() => navigate(-1)}
            onToggleLike={handleToggleLike}
            onOpenImage={() => setIsImagePreviewOpen(true)}
          />

          <section className="flex flex-col gap-[14px] px-[16px] pb-[24px] pt-[12px]">
            <div className="grid grid-cols-3 gap-[10px]">
              <InfoCard
                icon={<MapPin size={20} strokeWidth={2.4} />}
                iconClassName="bg-[#FFECEF] text-[#FF2D45]"
                value={formatDistance(mission.distanceMeters)}
                label="거리"
              />

              <InfoCard
                icon={<Zap size={20} strokeWidth={2.4} />}
                iconClassName="bg-[#EAF5FF] text-[#5BB5F8]"
                value={`+${mission.rewardPoint}P`}
                label="보상 포인트"
              />

              <InfoCard
                icon={<Clock3 size={20} strokeWidth={2.4} />}
                iconClassName="bg-[#FFF6D9] text-[#F59E0B]"
                value={`약 ${mission.estimatedMinutes}분`}
                label="예상 시간"
              />
            </div>

            <MissionUnlockNotice
              isLoading={isUnlockConditionLoading}
              isError={isUnlockConditionError}
              isLocked={isLockedByCondition}
              message={unlockMessage}
              onRetry={() => {
                void refetchUnlockCondition();
              }}
            />

            <div className="rounded-[16px] border border-[#EAF5FF] bg-white px-[15px] py-[13px] shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <p className="m-0 text-[12px] font-medium leading-[16px] text-[#A2A9B2]">
                미션 설명
              </p>

              <p className="m-0 mt-[7px] break-keep text-[13px] font-bold leading-[21px] text-[#1C1C3A]">
                {mission.description || "장소에 방문해 미션을 수행해보세요."}
              </p>
            </div>

            <div className="h-[2px] rounded-full bg-[#EAF5FF]" />

            <section className="rounded-[16px] border border-[#EAF5FF] bg-white px-[15px] py-[15px] shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <header className="flex items-center gap-[10px]">
                <span className="grid h-[27px] w-[27px] place-items-center rounded-full bg-[#EAF5FF] text-[#5BB5F8]">
                  <Crosshair size={14} strokeWidth={2.4} />
                </span>

                <h2 className="m-0 text-[15px] font-black leading-[20px] text-[#1C1C3A]">
                  수행 방법
                </h2>
              </header>

              <ol className="mt-[15px] flex flex-col gap-[11px] p-0">
                {missionSteps.map((step, index) => {
                  const isLinked = Boolean(step.targetPath);
                  const isVerifyStep = step.targetPath === PATH.MISSION_VERIFY;

                  return (
                    <li key={step.label}>
                      <button
                        type="button"
                        onClick={() => handleStepClick(step)}
                        disabled={
                          !isLinked || (isVerifyStep && isStartingMission)
                        }
                        className={[
                          "grid w-full grid-cols-[31px_minmax(0,1fr)_23px] items-center gap-[11px] rounded-[12px] bg-transparent p-0 text-left transition",
                          isLinked
                            ? "cursor-pointer active:scale-[0.99]"
                            : "cursor-default",
                          isVerifyStep && isStartingMission
                            ? "opacity-60"
                            : "opacity-100",
                        ].join(" ")}
                      >
                        <span className="grid h-[27px] w-[27px] place-items-center rounded-full bg-[#E8FBF3] text-[#00C950]">
                          <Check size={15} strokeWidth={3} />
                        </span>

                        <span className="text-[13px] font-bold leading-[19px] text-[#A2A9B2]">
                          {isVerifyStep && isStartingMission
                            ? "미션 시작 중..."
                            : step.label}
                        </span>

                        <span className="grid h-[21px] w-[21px] place-items-center rounded-full bg-[#EAF5FF] text-[10px] font-black text-[#A2A9B2]">
                          {index + 1}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </section>

            <MissionRewardCard
              mission={mission}
              isStartingMission={isStartingMission}
              isCheckingUnlockCondition={isUnlockConditionLoading}
              canStartMission={canStartMission}
              onStartMission={handleStartMission}
              onMoveRecordPage={handleMoveRecordPage}
            />

            <div className="mt-[2px] grid grid-cols-2 gap-[10px]">
              <button
                type="button"
                onClick={handleMoveCourseCreatePage}
                className="flex h-[50px] items-center justify-center gap-[7px] rounded-[16px] border border-[#C8E8FF] bg-white text-[13px] font-black text-[#5BB5F8] shadow-[0_4px_12px_rgba(8,37,95,0.08)] transition active:scale-[0.99]"
              >
                <Route size={16} strokeWidth={2.5} />
                코스 생성하기
              </button>

              <button
                type="button"
                onClick={handleStartMission}
                disabled={isMissionStartBlocked || isStartingMission}
                className={[
                  "flex h-[50px] items-center justify-center rounded-[16px] text-[13px] font-black text-white shadow-[0_8px_18px_rgba(91,181,248,0.28)] transition",
                  !isMissionStartBlocked && !isStartingMission
                    ? "bg-[#5BB5F8] active:scale-[0.99]"
                    : "bg-[#CBD5E1]",
                ].join(" ")}
              >
                {getStartButtonLabel({
                  isStartingMission,
                  isCheckingUnlockCondition: isUnlockConditionLoading,
                  isCompleted: isMissionCompleted,
                  isLocked: isLockedByCondition || isMissionLocked,
                  canStartMission,
                })}
              </button>
            </div>
          </section>
        </QuespotPageContent>
      ) : null}

      {isImagePreviewOpen && mission?.imageUrl ? (
        <MissionImagePreview
          imageUrl={mission.imageUrl}
          title={mission.title}
          onClose={() => setIsImagePreviewOpen(false)}
        />
      ) : null}
    </QuespotPageLayout>
  );
}

function useCurrentLocation() {
  const [currentLocation, setCurrentLocation] =
    useState<LatLng>(DEFAULT_LOCATION);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        setCurrentLocation(DEFAULT_LOCATION);
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
  };
}

type MissionHeroProps = {
  mission: MissionDetail;
  isLiked: boolean;
  isLikePending: boolean;
  isLockedByCondition: boolean;
  onBack: () => void;
  onToggleLike: () => void;
  onOpenImage: () => void;
};

function MissionHero({
  mission,
  isLiked,
  isLikePending,
  isLockedByCondition,
  onBack,
  onToggleLike,
  onOpenImage,
}: MissionHeroProps) {
  const Icon = categoryIconMap[mission.category] ?? Building2;
  const style = CATEGORY_STYLE[mission.category] ?? DEFAULT_CATEGORY_STYLE;
  const isCompleted = mission.userMissionStatus === "COMPLETED";
  const isLocked =
    mission.userMissionStatus === "LOCKED" ||
    !mission.canStart ||
    isLockedByCondition;

  return (
    <section className="relative h-[354px] min-h-[354px] w-full shrink-0 overflow-hidden bg-[#F4F8FF]">
      {mission.imageUrl ? (
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onOpenImage();
          }}
          className="absolute inset-x-0 top-0 z-10 h-[290px] w-full cursor-pointer overflow-hidden border-0 bg-transparent p-0 text-left"
          aria-label="미션 이미지 크게 보기"
        >
          <img
            src={mission.imageUrl}
            alt={mission.title}
            className="h-full w-full object-cover"
          />
        </button>
      ) : (
        <div
          className={[
            "absolute inset-x-0 top-0 z-10 h-[290px]",
            style.hero,
            "bg-[linear-gradient(90deg,rgba(28,28,58,0.08)_1px,transparent_1px),linear-gradient(0deg,rgba(28,28,58,0.08)_1px,transparent_1px)] bg-[length:40px_40px]",
          ].join(" ")}
        />
      )}

      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[290px] bg-gradient-to-b from-black/10 via-black/5 to-[#F4F8FF]" />

      {!mission.imageUrl ? (
        <Icon
          className={[
            "absolute left-1/2 top-[60px] z-20 h-[126px] w-[126px] -translate-x-1/2 opacity-20",
            style.heroIcon,
          ].join(" ")}
          strokeWidth={1.7}
        />
      ) : null}

      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onBack();
        }}
        className="absolute left-[18px] top-[18px] z-50 grid h-[44px] w-[44px] place-items-center rounded-full bg-white text-[#5BB5F8] shadow-[0_2px_8px_rgba(8,37,95,0.18)] transition active:scale-[0.94]"
        aria-label="뒤로가기"
      >
        <ArrowLeft size={22} strokeWidth={2.6} />
      </button>

      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onToggleLike();
        }}
        disabled={isLikePending}
        className={[
          "pointer-events-auto absolute right-[18px] top-[18px] z-50 grid h-[44px] w-[44px] place-items-center rounded-full bg-white shadow-[0_2px_8px_rgba(8,37,95,0.18)] transition active:scale-[0.94]",
          isLikePending ? "opacity-70" : "opacity-100",
        ].join(" ")}
        aria-label={isLiked ? "미션 좋아요 해제" : "미션 좋아요 등록"}
      >
        <Heart
          size={23}
          strokeWidth={2.4}
          fill={isLiked ? "#FF4D67" : "transparent"}
          className={isLiked ? "text-[#FF4D67]" : "text-[#A2A9B2]"}
        />
      </button>

      <article className="absolute bottom-[14px] left-[16px] right-[16px] z-40 rounded-[18px] border border-[#EAF5FF] bg-white/96 px-[15px] py-[12px] shadow-[0_8px_22px_rgba(8,37,95,0.13)] backdrop-blur">
        <div className="flex flex-wrap items-center gap-[7px]">
          <span
            className={[
              "inline-flex h-[24px] items-center gap-[5px] rounded-full bg-[#F4F8FF] px-[10px] text-[11px] font-black leading-none",
              style.chipText,
            ].join(" ")}
          >
            <Icon size={12} strokeWidth={2.4} />
            {getCategoryLabel(mission.category)}
          </span>

          {isCompleted ? (
            <span className="inline-flex h-[24px] items-center gap-[5px] rounded-full bg-[#E8FBF3] px-[10px] text-[11px] font-black leading-none text-[#00C950]">
              <Check size={12} strokeWidth={3} />
              완료
            </span>
          ) : null}

          {isLocked ? (
            <span className="inline-flex h-[24px] items-center gap-[5px] rounded-full bg-[#F1F5F9] px-[10px] text-[11px] font-black leading-none text-[#94A3B8]">
              <Lock size={12} strokeWidth={2.6} />
              잠김
            </span>
          ) : null}
        </div>

        <h1 className="m-0 mt-[9px] break-keep text-[19px] font-black leading-[26px] text-[#1C1C3A]">
          {mission.title}
        </h1>

        <p className="m-0 mt-[6px] flex items-start gap-[6px] break-keep text-[11px] font-medium leading-[16px] text-[#6B7280]">
          <MapPin
            size={13}
            strokeWidth={2.2}
            className="mt-[1px] shrink-0 text-[#A2A9B2]"
          />

          <span>
            {mission.spotName}
            <span className="px-[4px] text-[#CBD5E1]">·</span>
            {mission.address}
          </span>
        </p>
      </article>
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
    <article className="flex min-h-[86px] flex-col items-center justify-center rounded-[15px] border border-[#EAF5FF] bg-white px-[10px] py-[10px] text-center shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
      <span
        className={[
          "grid h-[36px] w-[36px] place-items-center rounded-full",
          iconClassName,
        ].join(" ")}
      >
        {icon}
      </span>

      <strong className="mt-[8px] text-[14px] font-black leading-[17px] text-[#1C1C3A]">
        {value}
      </strong>

      <span className="mt-[3px] text-[10px] font-medium leading-[14px] text-[#A2A9B2]">
        {label}
      </span>
    </article>
  );
}

type MissionUnlockNoticeProps = {
  isLoading: boolean;
  isError: boolean;
  isLocked: boolean;
  message: string;
  onRetry: () => void;
};

function MissionUnlockNotice({
  isLoading,
  isError,
  isLocked,
  message,
  onRetry,
}: MissionUnlockNoticeProps) {
  if (isLoading) {
    return (
      <section className="flex items-center gap-[10px] rounded-[16px] border border-[#C8E8FF] bg-white px-[15px] py-[13px] text-[#5BB5F8] shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <Loader2 size={17} strokeWidth={2.5} className="animate-spin" />

        <p className="m-0 text-[12px] font-black leading-[18px]">
          미션 시작 가능 여부를 확인하고 있어요.
        </p>
      </section>
    );
  }

  if (isLocked) {
    return (
      <section className="flex items-start gap-[10px] rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] px-[15px] py-[13px] text-[#64748B] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <Lock size={17} strokeWidth={2.5} className="mt-[1px] shrink-0" />

        <p className="m-0 break-keep text-[12px] font-bold leading-[19px]">
          {message}
        </p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="flex items-start justify-between gap-[10px] rounded-[16px] border border-[#FED7AA] bg-[#FFF7ED] px-[15px] py-[13px] text-[#EA580C] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <div className="flex items-start gap-[9px]">
          <AlertCircle
            size={17}
            strokeWidth={2.5}
            className="mt-[1px] shrink-0"
          />

          <p className="m-0 break-keep text-[12px] font-bold leading-[19px]">
            미션 시작 조건을 확인하지 못했어요.
          </p>
        </div>

        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 rounded-full bg-white px-[10px] py-[6px] text-[10px] font-black leading-none text-[#EA580C]"
        >
          재시도
        </button>
      </section>
    );
  }

  return null;
}

type MissionRewardCardProps = {
  mission: MissionDetail;
  isStartingMission: boolean;
  isCheckingUnlockCondition: boolean;
  canStartMission: boolean;
  onStartMission: () => void;
  onMoveRecordPage: () => void;
};

function MissionRewardCard({
  mission,
  isStartingMission,
  isCheckingUnlockCondition,
  canStartMission,
  onStartMission,
  onMoveRecordPage,
}: MissionRewardCardProps) {
  const isCompleted = mission.userMissionStatus === "COMPLETED";

  if (isCompleted) {
    return (
      <section className="flex items-center gap-[12px] rounded-[16px] border border-[#BBF7D0] bg-[#E8FBF3] px-[15px] py-[15px]">
        <span className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-[14px] bg-[#C6F7D9] text-[#00C950]">
          <Check size={24} strokeWidth={3} />
        </span>

        <div className="min-w-0 flex-1">
          <strong className="block text-[16px] font-black leading-[20px] text-[#008A3D]">
            미션 완료!
          </strong>

          <p className="m-0 mt-[4px] text-[13px] font-medium leading-[19px] text-[#00C950]">
            +{mission.rewardPoint}P 보상이 지급됐어요
          </p>
        </div>

        <button
          type="button"
          onClick={onMoveRecordPage}
          disabled={!mission.canCreateArchive}
          className={[
            "flex h-[31px] min-w-[74px] shrink-0 items-center justify-center whitespace-nowrap rounded-full px-[12px] font-sans text-[10px] font-black leading-none text-white",
            mission.canCreateArchive ? "bg-[#00D664]" : "bg-[#CBD5E1]",
          ].join(" ")}
        >
          기록 남기기
        </button>
      </section>
    );
  }

  return (
    <section className="flex items-center gap-[12px] rounded-[16px] border border-[#C8E8FF] bg-white px-[15px] py-[15px] shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <span className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-[14px] bg-[#EAF5FF] text-[#5BB5F8]">
        <Zap size={23} strokeWidth={2.6} />
      </span>

      <div className="min-w-0 flex-1">
        <strong className="block text-[15px] font-black leading-[20px] text-[#1C1C3A]">
          미션 완료 시 보상 지급
        </strong>

        <p className="m-0 mt-[4px] text-[13px] font-medium leading-[19px] text-[#A2A9B2]">
          +{mission.rewardPoint}P를 받을 수 있어요
        </p>
      </div>

      <button
        type="button"
        onClick={onStartMission}
        disabled={!canStartMission || isStartingMission || isCheckingUnlockCondition}
        className={[
          "flex h-[31px] min-w-[74px] shrink-0 items-center justify-center whitespace-nowrap rounded-full px-[12px] font-sans text-[10px] font-black leading-none text-white",
          canStartMission && !isStartingMission && !isCheckingUnlockCondition
            ? "bg-[#5BB5F8]"
            : "bg-[#CBD5E1]",
        ].join(" ")}
      >
        {isCheckingUnlockCondition
          ? "확인 중"
          : isStartingMission
            ? "시작 중"
            : canStartMission
              ? "시작하기"
              : "시작 불가"}
      </button>
    </section>
  );
}

type MissionImagePreviewProps = {
  imageUrl: string;
  title: string;
  onClose: () => void;
};

function MissionImagePreview({
  imageUrl,
  title,
  onClose,
}: MissionImagePreviewProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClose}
      onKeyDown={(event) => {
        if (event.key === "Escape" || event.key === "Enter") {
          onClose();
        }
      }}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/85 px-[16px]"
      aria-label="이미지 미리보기 닫기"
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
        className="absolute right-[18px] top-[18px] z-10 grid h-[42px] w-[42px] place-items-center rounded-full bg-white/95 text-[#1C1C3A] shadow-[0_4px_16px_rgba(0,0,0,0.25)] transition active:scale-[0.94]"
        aria-label="닫기"
      >
        <X size={22} strokeWidth={2.8} />
      </button>

      <img
        src={imageUrl}
        alt={title}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[86vh] max-w-full rounded-[18px] object-contain shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
      />
    </div>
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

function getStartButtonLabel({
  isStartingMission,
  isCheckingUnlockCondition,
  isCompleted,
  isLocked,
  canStartMission,
}: {
  isStartingMission: boolean;
  isCheckingUnlockCondition: boolean;
  isCompleted: boolean;
  isLocked: boolean;
  canStartMission: boolean;
}) {
  if (isCheckingUnlockCondition) return "확인 중...";
  if (isStartingMission) return "시작 중...";
  if (isCompleted) return "완료";
  if (isLocked) return "잠김";
  if (canStartMission) return "미션 인증하기";

  return "시작 불가";
}

function getCategoryLabel(category: MissionCategory) {
  const categoryLabelMap: Record<string, string> = {
    HISTORY: "역사",
    CULTURE: "문화",
    NATURE: "자연",
    FOOD: "음식",
    SHOPPING: "쇼핑",
    ACTIVITY: "활동",
    NIGHT_VIEW: "야경·전망",
    ETC: "기타",
  };

  return categoryLabelMap[category] ?? "기타";
}

function getCategoryEmoji(category: MissionCategory) {
  const categoryEmojiMap: Record<string, string> = {
    HISTORY: "🏯",
    CULTURE: "🎨",
    NATURE: "🌳",
    FOOD: "🍜",
    SHOPPING: "🛍️",
    ACTIVITY: "🏃",
    NIGHT_VIEW: "🌙",
    ETC: "✨",
  };

  return categoryEmojiMap[category] ?? "📍";
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
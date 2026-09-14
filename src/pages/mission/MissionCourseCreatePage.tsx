import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Clock3,
  Loader2,
  MapPin,
  Route,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

import QuespotPageLayout, {
  QuespotDivider,
  QuespotPageContent,
} from "@/layouts/QuespotPageLayout";
import { useCreateMissionCourse } from "@/hooks/mutation/useCreateMissionCourse";
import type { MissionDetail } from "@/types/mission";
import type {
  MissionCourseDetail,
  MissionCourseMission,
} from "@/types/missionCourse";
import { PATH } from "@/routes/paths";

type MissionCourseCreateState = {
  missionId?: number;
  mission?: MissionDetail;
};

export default function MissionCourseCreatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const state = location.state as MissionCourseCreateState | null;

  const searchMissionId = Number(searchParams.get("missionId"));
  const anchorMissionId =
    state?.missionId ??
    state?.mission?.missionId ??
    (Number.isFinite(searchMissionId) && searchMissionId > 0
      ? searchMissionId
      : null);

  const anchorMission = state?.mission ?? null;

  const [createdCourse, setCreatedCourse] =
    useState<MissionCourseDetail | null>(null);

  const {
    mutate: createCourse,
    isPending: isCreatingCourse,
    error,
  } = useCreateMissionCourse();

  const errorMessage = useMemo(() => {
    if (!error) return "";

    if (error instanceof Error) {
      return error.message;
    }

    return "미션 코스를 생성하지 못했어요.";
  }, [error]);

  const handleCreateCourse = () => {
    if (!anchorMissionId || isCreatingCourse) return;

    createCourse(
      {
        anchorMissionId,
      },
      {
        onSuccess: (course) => {
          setCreatedCourse(course);
        },
      },
    );
  };

  const handleMoveMissionDetail = (missionId: number) => {
    navigate(PATH.MISSION_DETAIL.replace(":missionId", String(missionId)));
  };

  return (
    <QuespotPageLayout className="bg-[#F4F8FF]">
      <header className="shrink-0 bg-white">
        <div className="flex h-[80px] items-center gap-[14px] px-[16px]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="grid h-[40px] w-[40px] place-items-center rounded-full bg-[#F4F8FF] text-[#1C1C3A] transition active:scale-[0.98]"
            aria-label="뒤로가기"
          >
            <ArrowLeft size={21} strokeWidth={2.6} />
          </button>

          <div className="min-w-0">
            <h1 className="m-0 text-[20px] font-black leading-[26px] text-[#1C1C3A]">
              미션 코스 생성
            </h1>

            <p className="m-0 mt-[3px] text-[12px] font-medium leading-[17px] text-[#A2A9B2]">
              선택한 미션 기준으로 코스를 만들어요
            </p>
          </div>
        </div>
      </header>

      <QuespotDivider />

      <QuespotPageContent className="bg-[#F4F8FF] px-[16px] pb-[28px] pt-[20px]">
        {!anchorMissionId ? (
          <EmptyAnchorMission onMoveMissions={() => navigate(PATH.MISSIONS)} />
        ) : (
          <>
            <section className="rounded-[22px] border border-[#C8E8FF] bg-white p-[16px] shadow-[0_4px_14px_rgba(8,37,95,0.08)]">
              <div className="flex items-center gap-[10px]">
                <span className="grid h-[34px] w-[34px] place-items-center rounded-full bg-[#EAF5FF] text-[#5BB5F8]">
                  <Target size={18} strokeWidth={2.5} />
                </span>

                <div>
                  <p className="m-0 text-[12px] font-black leading-[16px] text-[#5BB5F8]">
                    기준 미션
                  </p>

                  <h2 className="m-0 mt-[2px] text-[18px] font-black leading-[24px] text-[#1C1C3A]">
                    {anchorMission?.title ?? `미션 #${anchorMissionId}`}
                  </h2>
                </div>
              </div>

              {anchorMission ? (
                <div className="mt-[14px] flex gap-[12px]">
                  {anchorMission.imageUrl ? (
                    <img
                      src={anchorMission.imageUrl}
                      alt={anchorMission.title}
                      className="h-[86px] w-[86px] shrink-0 rounded-[18px] object-cover"
                    />
                  ) : (
                    <div className="grid h-[86px] w-[86px] shrink-0 place-items-center rounded-[18px] bg-[#EAF5FF] text-[32px]">
                      🧭
                    </div>
                  )}

                  <div className="min-w-0 flex-1 py-[2px]">
                    <p className="m-0 flex items-center gap-[5px] truncate text-[12px] font-medium leading-[17px] text-[#A2A9B2]">
                      <MapPin size={13} strokeWidth={2.3} />
                      {anchorMission.spotName}
                    </p>

                    <p className="m-0 mt-[6px] line-clamp-2 text-[13px] font-bold leading-[20px] text-[#1C1C3A]">
                      {anchorMission.description ||
                        "이 미션을 기준으로 주변 미션 코스를 생성합니다."}
                    </p>

                    <div className="mt-[10px] flex items-center gap-[8px]">
                      <span className="inline-flex h-[24px] items-center gap-[4px] rounded-full bg-[#EAF5FF] px-[9px] text-[11px] font-black text-[#5BB5F8]">
                        <Zap size={12} strokeWidth={2.5} />
                        +{anchorMission.rewardPoint}P
                      </span>

                      <span className="inline-flex h-[24px] items-center gap-[4px] rounded-full bg-[#FFF6D9] px-[9px] text-[11px] font-black text-[#F59E0B]">
                        <Clock3 size={12} strokeWidth={2.5} />약{" "}
                        {anchorMission.estimatedMinutes}분
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}
            </section>

            {!createdCourse ? (
              <CourseCreateReadySection
                isCreatingCourse={isCreatingCourse}
                errorMessage={errorMessage}
                onCreateCourse={handleCreateCourse}
              />
            ) : (
              <CreatedCourseSection
                course={createdCourse}
                onMoveMissionDetail={handleMoveMissionDetail}
              />
            )}
          </>
        )}
      </QuespotPageContent>
    </QuespotPageLayout>
  );
}

type CourseCreateReadySectionProps = {
  isCreatingCourse: boolean;
  errorMessage: string;
  onCreateCourse: () => void;
};

function CourseCreateReadySection({
  isCreatingCourse,
  errorMessage,
  onCreateCourse,
}: CourseCreateReadySectionProps) {
  return (
    <>
      <section className="mt-[16px] rounded-[22px] border border-[#EAF5FF] bg-white p-[18px] shadow-[0_4px_14px_rgba(8,37,95,0.08)]">
        <div className="flex items-start gap-[12px]">
          <span className="grid h-[44px] w-[44px] shrink-0 place-items-center rounded-[16px] bg-[#EAF5FF] text-[#5BB5F8]">
            <Route size={24} strokeWidth={2.5} />
          </span>

          <div className="min-w-0">
            <h2 className="m-0 text-[18px] font-black leading-[25px] text-[#1C1C3A]">
              주변 미션을 자동으로 묶어드릴게요
            </h2>

            <p className="m-0 mt-[8px] break-keep text-[13px] font-medium leading-[21px] text-[#A2A9B2]">
              선택한 미션을 기준으로 주변에서 함께 수행하기 좋은 미션을
              조합해 3곳짜리 여행 코스를 생성합니다.
            </p>
          </div>
        </div>

        <div className="mt-[18px] grid grid-cols-3 gap-[10px]">
          <InfoBox
            icon={<Target size={19} strokeWidth={2.5} />}
            label="기준 미션"
            value="1개"
            className="bg-[#EAF5FF] text-[#5BB5F8]"
          />

          <InfoBox
            icon={<Sparkles size={19} strokeWidth={2.5} />}
            label="추천 미션"
            value="+2개"
            className="bg-[#FFF6D9] text-[#F59E0B]"
          />

          <InfoBox
            icon={<Trophy size={19} strokeWidth={2.5} />}
            label="코스 보상"
            value="보너스"
            className="bg-[#E8FBF3] text-[#00C950]"
          />
        </div>
      </section>

      {errorMessage ? (
        <section className="mt-[14px] rounded-[16px] border border-[#FED7AA] bg-[#FFF7ED] px-[16px] py-[13px]">
          <p className="m-0 text-[13px] font-bold leading-[20px] text-[#EA580C]">
            {errorMessage}
          </p>

          <p className="m-0 mt-[4px] text-[12px] font-medium leading-[18px] text-[#9A6A00]">
            이미 시작한 미션이거나 주변 미션이 부족하면 코스를 만들 수
            없어요.
          </p>
        </section>
      ) : null}

      <button
        type="button"
        onClick={onCreateCourse}
        disabled={isCreatingCourse}
        className={[
          "mt-[20px] flex h-[56px] w-full items-center justify-center gap-[8px] rounded-[18px] text-[15px] font-black text-white shadow-[0_8px_18px_rgba(91,181,248,0.28)] transition",
          isCreatingCourse
            ? "bg-[#CBD5E1]"
            : "bg-[#5BB5F8] active:scale-[0.99]",
        ].join(" ")}
      >
        {isCreatingCourse ? (
          <>
            <Loader2 size={18} strokeWidth={2.5} className="animate-spin" />
            코스 생성 중...
          </>
        ) : (
          <>
            <Route size={18} strokeWidth={2.5} />
            코스 생성하기
          </>
        )}
      </button>
    </>
  );
}

type CreatedCourseSectionProps = {
  course: MissionCourseDetail;
  onMoveMissionDetail: (missionId: number) => void;
};

function CreatedCourseSection({
  course,
  onMoveMissionDetail,
}: CreatedCourseSectionProps) {
  const firstAvailableMission =
    course.missions.find((mission) => mission.status === "AVAILABLE") ??
    course.missions[0];

  return (
    <>
      <section className="mt-[16px] rounded-[22px] border border-[#BBF7D0] bg-[#E8FBF3] p-[18px] shadow-[0_4px_14px_rgba(8,37,95,0.08)]">
        <div className="flex items-center gap-[12px]">
          <span className="grid h-[48px] w-[48px] place-items-center rounded-full bg-[#C6F7D9] text-[#00C950]">
            <Check size={26} strokeWidth={3} />
          </span>

          <div>
            <p className="m-0 text-[13px] font-black leading-[18px] text-[#00A63E]">
              코스 생성 완료
            </p>

            <h2 className="m-0 mt-[3px] text-[20px] font-black leading-[27px] text-[#1C1C3A]">
              {course.name}
            </h2>
          </div>
        </div>

        <p className="m-0 mt-[12px] break-keep text-[13px] font-medium leading-[21px] text-[#008A3D]">
          {course.description || "선택한 미션을 기준으로 코스가 생성됐어요."}
        </p>
      </section>

      <div className="mt-[14px] grid grid-cols-3 gap-[10px]">
        <InfoBox
          icon={<Zap size={19} strokeWidth={2.5} />}
          label="총 보상"
          value={`+${course.totalRewardPoint}P`}
          className="bg-[#EAF5FF] text-[#5BB5F8]"
        />

        <InfoBox
          icon={<Sparkles size={19} strokeWidth={2.5} />}
          label="보너스"
          value={`+${course.bonusPoint}P`}
          className="bg-[#FFF6D9] text-[#F59E0B]"
        />

        <InfoBox
          icon={<Clock3 size={19} strokeWidth={2.5} />}
          label="예상 시간"
          value={`${course.estimatedMinutes}분`}
          className="bg-[#FFECEF] text-[#FF2D45]"
        />
      </div>

      <section className="mt-[16px] rounded-[22px] border border-[#EAF5FF] bg-white p-[16px] shadow-[0_4px_14px_rgba(8,37,95,0.08)]">
        <div className="flex items-center justify-between">
          <h3 className="m-0 text-[17px] font-black leading-[24px] text-[#1C1C3A]">
            생성된 코스
          </h3>

          <span className="text-[12px] font-bold leading-[16px] text-[#5BB5F8]">
            {course.missions.length}개 미션
          </span>
        </div>

        <div className="mt-[14px] flex flex-col gap-[10px]">
          {course.missions.map((mission) => (
            <CourseMissionCard
              key={mission.missionId}
              mission={mission}
              onClick={() => onMoveMissionDetail(mission.missionId)}
            />
          ))}
        </div>
      </section>

      {firstAvailableMission ? (
        <button
          type="button"
          onClick={() => onMoveMissionDetail(firstAvailableMission.missionId)}
          className="mt-[20px] flex h-[56px] w-full items-center justify-center gap-[8px] rounded-[18px] bg-[#5BB5F8] text-[15px] font-black text-white shadow-[0_8px_18px_rgba(91,181,248,0.28)] transition active:scale-[0.99]"
        >
          첫 미션 시작하기
        </button>
      ) : null}
    </>
  );
}

type CourseMissionCardProps = {
  mission: MissionCourseMission;
  onClick: () => void;
};

function CourseMissionCard({ mission, onClick }: CourseMissionCardProps) {
  const isLocked = mission.status === "LOCKED";
  const isCompleted = mission.status === "COMPLETED";
  const isAvailable = mission.status === "AVAILABLE";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLocked}
      className={[
        "flex min-h-[74px] w-full items-center gap-[12px] rounded-[16px] border p-[12px] text-left transition",
        isLocked
          ? "border-[#E5E7EB] bg-[#F8FAFC] opacity-65"
          : "border-[#EAF5FF] bg-white active:scale-[0.99]",
      ].join(" ")}
    >
      <span
        className={[
          "grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full text-[13px] font-black",
          isCompleted
            ? "bg-[#E8FBF3] text-[#00C950]"
            : isAvailable
              ? "bg-[#EAF5FF] text-[#5BB5F8]"
              : "bg-[#F1F5F9] text-[#94A3B8]",
        ].join(" ")}
      >
        {mission.seq}
      </span>

      {mission.imageUrl ? (
        <img
          src={mission.imageUrl}
          alt={mission.title}
          className="h-[48px] w-[48px] shrink-0 rounded-[14px] object-cover"
        />
      ) : (
        <div className="grid h-[48px] w-[48px] shrink-0 place-items-center rounded-[14px] bg-[#EAF5FF] text-[22px]">
          🧭
        </div>
      )}

      <div className="min-w-0 flex-1">
        <strong className="block truncate text-[14px] font-black leading-[20px] text-[#1C1C3A]">
          {mission.title}
        </strong>

        <div className="mt-[6px] flex items-center gap-[7px]">
          <span className="text-[11px] font-bold leading-none text-[#F59E0B]">
            +{mission.rewardPoint}P
          </span>

          <span
            className={[
              "rounded-full px-[8px] py-[4px] text-[10px] font-black leading-none",
              isCompleted
                ? "bg-[#E8FBF3] text-[#00C950]"
                : isAvailable
                  ? "bg-[#EAF5FF] text-[#5BB5F8]"
                  : "bg-[#F1F5F9] text-[#94A3B8]",
            ].join(" ")}
          >
            {getMissionStatusLabel(mission.status)}
          </span>
        </div>
      </div>
    </button>
  );
}

type InfoBoxProps = {
  icon: ReactNode;
  label: string;
  value: string;
  className: string;
};

function InfoBox({ icon, label, value, className }: InfoBoxProps) {
  return (
    <article className="flex min-h-[86px] flex-col items-center justify-center rounded-[18px] border border-[#EAF5FF] bg-white px-[8px] py-[12px] text-center shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <span
        className={[
          "grid h-[34px] w-[34px] place-items-center rounded-full",
          className,
        ].join(" ")}
      >
        {icon}
      </span>

      <strong className="mt-[8px] text-[13px] font-black leading-[17px] text-[#1C1C3A]">
        {value}
      </strong>

      <span className="mt-[3px] text-[10px] font-medium leading-[14px] text-[#A2A9B2]">
        {label}
      </span>
    </article>
  );
}

type EmptyAnchorMissionProps = {
  onMoveMissions: () => void;
};

function EmptyAnchorMission({ onMoveMissions }: EmptyAnchorMissionProps) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-[20px] text-center">
      <div className="grid h-[78px] w-[78px] place-items-center rounded-full bg-[#FFECEF] text-[34px]">
        !
      </div>

      <h2 className="m-0 mt-[18px] text-[18px] font-black leading-[25px] text-[#1C1C3A]">
        기준 미션이 없어요
      </h2>

      <p className="m-0 mt-[8px] break-keep text-[13px] font-medium leading-[21px] text-[#A2A9B2]">
        코스를 생성하려면 먼저 미션 상세 페이지에서 기준 미션을 선택해야
        해요.
      </p>

      <button
        type="button"
        onClick={onMoveMissions}
        className="mt-[22px] h-[46px] rounded-full bg-[#5BB5F8] px-[22px] text-[14px] font-black text-white"
      >
        미션 보러가기
      </button>
    </section>
  );
}

function getMissionStatusLabel(status: string) {
  const labelMap: Record<string, string> = {
    LOCKED: "잠김",
    AVAILABLE: "시작 가능",
    IN_PROGRESS: "진행 중",
    COMPLETED: "완료",
  };

  return labelMap[status] ?? status;
}
import {
  AlertCircle,
  Camera,
  ChevronRight,
  Clock3,
  Flag,
  Loader2,
  Search,
  Trash2,
} from "lucide-react";

import Button from "@/components/common/Button";
import QuespotPageLayout, {
  QuespotPageContent,
} from "@/layouts/QuespotPageLayout";
import type { MissionAttempt } from "@/types/missionAttempt";

type InProgressMissionViewProps = {
  attempts: MissionAttempt[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  onRetry: () => void;
  onExplore: () => void;
  onViewDetail: (attempt: MissionAttempt) => void;
  onContinue: (attempt: MissionAttempt) => void;
};

export default function InProgressMissionView({
  attempts,
  isLoading,
  isError,
  error,
  onRetry,
  onExplore,
  onViewDetail,
  onContinue,
}: InProgressMissionViewProps) {
  if (isLoading) {
    return (
      <QuespotPageLayout className="bg-[#F4F8FF]">
        <QuespotPageContent className="flex items-center justify-center bg-[#F4F8FF] px-[24px]">
          <section className="flex flex-col items-center text-center">
            <Loader2
              size={34}
              strokeWidth={2.4}
              className="animate-spin text-[#5BB5F8]"
            />

            <p className="m-0 mt-[16px] text-[14px] font-bold leading-[20px] text-[#A2A9B2]">
              진행 중인 미션을 불러오는 중이에요
            </p>
          </section>
        </QuespotPageContent>
      </QuespotPageLayout>
    );
  }

  if (isError) {
    return (
      <QuespotPageLayout className="bg-[#F4F8FF]">
        <QuespotPageContent className="bg-[#F4F8FF] px-[16px] py-[24px]">
          <section className="flex min-h-[360px] flex-col items-center justify-center rounded-[24px] border border-[#FFE1E7] bg-white px-[22px] py-[34px] text-center shadow-[0_4px_14px_rgba(8,37,95,0.06)]">
            <div className="grid h-[74px] w-[74px] place-items-center rounded-full bg-[#FFECEF] text-[#FF4D67]">
              <AlertCircle size={34} strokeWidth={2.4} />
            </div>

            <h2 className="m-0 mt-[18px] text-[19px] font-black leading-[27px] text-[#1C1C3A]">
              진행 중인 미션을 불러오지 못했어요
            </h2>

            <p className="m-0 mt-[8px] break-keep text-[13px] font-medium leading-[20px] text-[#A2A9B2]">
              {error instanceof Error
                ? error.message
                : "잠시 후 다시 시도해주세요."}
            </p>

            <Button className="mt-[22px]" onClick={onRetry}>
              다시 불러오기
            </Button>
          </section>
        </QuespotPageContent>
      </QuespotPageLayout>
    );
  }

  if (attempts.length === 0) {
    return (
      <QuespotPageLayout className="bg-[#F4F8FF]">
        <QuespotPageContent className="bg-[#F4F8FF] px-[16px] py-[24px]">
          <section className="flex min-h-[380px] flex-col items-center justify-center rounded-[24px] border border-[#EAF5FF] bg-white px-[22px] py-[36px] text-center shadow-[0_4px_14px_rgba(8,37,95,0.06)]">
            <div className="grid h-[76px] w-[76px] place-items-center rounded-[24px] bg-[#EAF5FF] text-[#5BB5F8]">
              <Search size={34} strokeWidth={2.5} />
            </div>

            <h2 className="m-0 mt-[18px] text-[20px] font-black leading-[28px] text-[#1C1C3A]">
              진행 중인 미션이 없어요
            </h2>

            <p className="m-0 mt-[8px] break-keep text-[13px] font-medium leading-[21px] text-[#6F7B8D]">
              마음에 드는 미션을 시작하면
              <br />
              이곳에서 이어서 인증할 수 있어요.
            </p>

            <Button className="mt-[24px]" onClick={onExplore}>
              미션 탐색하기
            </Button>
          </section>
        </QuespotPageContent>
      </QuespotPageLayout>
    );
  }

  return (
    <QuespotPageLayout className="bg-[#F4F8FF]">
      <QuespotPageContent className="bg-[#F4F8FF] px-[16px] pb-[28px] pt-[20px]">
        <section className="mb-[16px] flex items-end justify-between">
          <div>
            <p className="m-0 text-[13px] font-black leading-[18px] text-[#5BB5F8]">
              지금 이어서 도전해보세요
            </p>

            <h2 className="m-0 mt-[4px] text-[23px] font-black leading-[31px] text-[#1C1C3A]">
              진행 중인 미션
            </h2>
          </div>

          <span className="mb-[3px] text-[13px] font-black text-[#A2A9B2]">
            {attempts.length}개
          </span>
        </section>

        <div className="flex flex-col gap-[16px]">
          {attempts.map((attempt) => (
            <InProgressMissionCard
              key={attempt.attemptId}
              attempt={attempt}
              onViewDetail={() => onViewDetail(attempt)}
              onContinue={() => onContinue(attempt)}
            />
          ))}
        </div>
      </QuespotPageContent>
    </QuespotPageLayout>
  );
}

type InProgressMissionCardProps = {
  attempt: MissionAttempt;
  onViewDetail: () => void;
  onContinue: () => void;
};

function InProgressMissionCard({
  attempt,
  onViewDetail,
  onContinue,
}: InProgressMissionCardProps) {
  return (
    <article className="overflow-hidden rounded-[24px] border border-[#EAF5FF] bg-white shadow-[0_4px_16px_rgba(8,37,95,0.08)]">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#C8E8FF_0%,#DDF1FF_54%,#E8FBF3_100%)] px-[18px] pb-[22px] pt-[20px]">
        <div className="absolute right-[-18px] top-[-24px] h-[116px] w-[116px] rounded-full bg-white/26" />

        <div className="relative flex items-start justify-between gap-[14px]">
          <div className="min-w-0 flex-1">
            <span className="inline-flex h-[28px] items-center rounded-full bg-white px-[12px] text-[11px] font-black leading-none text-[#5BB5F8] shadow-[0_3px_10px_rgba(8,37,95,0.08)]">
              진행 중
            </span>

            <p className="m-0 mt-[18px] flex items-center gap-[6px] text-[12px] font-black leading-[17px] text-[#5D6A7D]">
              <Clock3 size={14} strokeWidth={2.4} />
              {formatStartedAt(attempt.startedAt)} 시작
            </p>
          </div>

          <div className="relative grid h-[64px] w-[64px] shrink-0 place-items-center rounded-[20px] bg-white/82 text-[#5BB5F8] shadow-[0_8px_18px_rgba(8,37,95,0.10)]">
            <Flag size={31} strokeWidth={2.3} />
          </div>
        </div>
      </section>

      <section className="px-[18px] pb-[18px] pt-[18px]">
        <h3 className="m-0 break-keep text-[18px] font-black leading-[26px] text-[#1C1C3A]">
          {attempt.missionTitle}
        </h3>

        <div className="mt-[16px] rounded-[16px] bg-[#F8FBFF] px-[14px] py-[12px]">
          <div className="flex items-center gap-[8px]">
            <span className="grid h-[24px] w-[24px] place-items-center rounded-full bg-[#EAF5FF] text-[#5BB5F8]">
              <Camera size={14} strokeWidth={2.5} />
            </span>

            <p className="m-0 text-[12px] font-bold leading-[18px] text-[#6F7B8D]">
              미션 장소에서 위치와 사진을 인증해주세요
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onViewDetail}
          className="mt-[12px] flex h-[44px] w-full items-center justify-between rounded-[14px] border border-[#EAF5FF] bg-white px-[14px] text-[13px] font-black text-[#6F7B8D] shadow-[0_2px_8px_rgba(8,37,95,0.04)] transition active:scale-[0.99]"
        >
          미션 상세 확인하기
          <ChevronRight size={17} strokeWidth={2.6} />
        </button>

        <div className="mt-[16px] grid grid-cols-[78px_minmax(0,1fr)] gap-[9px]">
          <button
            type="button"
            className="h-[48px] rounded-[15px] border border-[#FFCCD4] bg-[#FFF6F8] text-[13px] font-black text-[#FF4D67] transition active:scale-[0.98]"
          >
            포기하기
          </button>

          <button
            type="button"
            onClick={onContinue}
            className="flex h-[48px] items-center justify-center gap-[5px] rounded-[15px] bg-[#5BB5F8] text-[14px] font-black text-white shadow-[0_8px_18px_rgba(91,181,248,0.25)] transition active:scale-[0.98]"
          >
            인증 계속하기
            <ChevronRight size={17} strokeWidth={2.6} />
          </button>
        </div>
      </section>
    </article>
  );
}

function formatStartedAt(value: string) {
  const normalizedValue = normalizeServerDateTime(value);
  const date = new Date(normalizedValue);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function normalizeServerDateTime(value: string) {
  const hasTimezone = /([zZ]|[+-]\d{2}:\d{2})$/.test(value);

  if (hasTimezone) {
    return value;
  }

  return `${value}Z`;
}
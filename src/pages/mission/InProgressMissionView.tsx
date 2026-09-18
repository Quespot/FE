import { useState } from "react";
import { AlertTriangle, Flag, X } from "lucide-react";
import { QuespotPageContent } from "@/layouts/QuespotPageLayout";
import type { MissionAttempt } from "@/types/missionAttempt";
import { useQuitMissionAttempt } from "@/hooks/mutation/useQuitMissionAttempt";
import Button from "@/components/common/Button";
import InProgressMissionCard from "@/components/mission/InProgressMissionCard/InProgressMissionCard";
import InProgressMissionCardSkeleton from "@/components/mission/InProgressMissionCard/InProgressMissionCardSkeleton";

type Props = {
  attempts: MissionAttempt[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
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
}: Props) {
  const [quitTarget, setQuitTarget] = useState<MissionAttempt | null>(null);
  const {
    mutateAsync: quitAttempt,
    isPending: isQuitting,
    error: quitError,
    reset: resetQuit,
  } = useQuitMissionAttempt();

  const closeQuitModal = () => {
    if (isQuitting) return;
    resetQuit();
    setQuitTarget(null);
  };

  const handleQuit = async () => {
    if (!quitTarget) return;

    try {
      await quitAttempt(quitTarget.attemptId);
      setQuitTarget(null);
    } catch {}
  };

  return (
    <QuespotPageContent className="bg-[#F4F8FF] px-[16px] pb-[28px] pt-[18px]">
      <div className="flex items-end justify-between">
        <div>
          <p className="m-0 text-[12px] font-black leading-[18px] text-[#5BB5F8]">
            지금 이어서 도전해보세요
          </p>
          <h2 className="m-0 mt-[2px] text-[21px] font-black leading-[29px] text-[#1C1C3A]">
            진행 중인 미션
          </h2>
        </div>
        {!isLoading && !isError ? (
          <span className="text-[12px] font-bold text-[#A2A9B2]">
            {attempts.length}개
          </span>
        ) : null}
      </div>

      {isLoading ? (
        <div role="status" aria-label="진행 중인 미션을 불러오는 중">
          <InProgressMissionCardSkeleton />
        </div>
      ) : isError ? (
        <div
          role="alert"
          className="mt-[18px] rounded-[20px] bg-white px-[20px] py-[32px] text-center"
        >
          <h3 className="m-0 text-[16px] font-black text-[#1C1C3A]">
            미션을 불러오지 못했어요
          </h3>
          <p className="mt-[10px] break-keep text-[13px] leading-[20px] text-[#6F7B8D]">
            {error?.message ?? "잠시 후 다시 시도해주세요."}
          </p>
          <Button
            size="sm"
            onClick={onRetry}
            className="mx-auto mt-[8px] !px-[20px] !py-[12px] !text-[13px]"
          >
            다시 불러오기
          </Button>
        </div>
      ) : attempts.length === 0 ? (
        <div className="mt-[18px] rounded-[20px] bg-white px-[20px] py-[42px] text-center">
          <div className="mx-auto grid h-[64px] w-[64px] place-items-center rounded-[20px] bg-[#EAF5FF] text-[#5BB5F8]">
            <Flag size={28} />
          </div>
          <h3 className="m-0 mt-[18px] text-[17px] font-black text-[#1C1C3A]">
            진행 중인 미션이 없어요
          </h3>
          <p className="mt-[8px] text-[13px] leading-[20px] text-[#A2A9B2]">
            마음에 드는 미션을 찾아 시작해보세요
          </p>
          <Button
            size="sm"
            onClick={onExplore}
            className="mx-auto mt-[10px] !px-[22px] !py-[12px] !text-[13px]"
          >
            미션 탐색하기
          </Button>
        </div>
      ) : (
        attempts.map((attempt) => (
          <InProgressMissionCard
            key={attempt.attemptId}
            attempt={attempt}
            onViewDetail={() => onViewDetail(attempt)}
            onContinue={() => onContinue(attempt)}
            onQuit={() => {
              resetQuit();
              setQuitTarget(attempt);
            }}
          />
        ))
      )}

      {quitTarget ? (
        <div
          className="fixed inset-y-0 left-1/2 z-[100] flex w-full max-w-[430px] -translate-x-1/2 items-center justify-center bg-[#1C1C3A]/40 px-[24px] backdrop-blur-[2px]"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeQuitModal();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="quit-mission-title"
            className="w-full max-w-[330px] rounded-[24px] bg-white px-[20px] pb-[22px] pt-[18px] text-center shadow-[0_18px_40px_rgba(8,37,95,0.28)]"
          >
            <div className="flex justify-end">
              <Button
                size="sm"
                variant="secondary"
                onClick={closeQuitModal}
                disabled={isQuitting}
                aria-label="닫기"
                className="!h-[34px] !w-[34px] !rounded-full !bg-[#F4F8FF] !p-0 !text-[#6F7B8D] disabled:opacity-40"
              >
                <X size={18} />
              </Button>
            </div>

            <div className="mx-auto mt-[4px] grid h-[58px] w-[58px] place-items-center rounded-[18px] bg-[#FFF2E8] text-[#F59E0B]">
              <AlertTriangle size={28} strokeWidth={2.3} />
            </div>
            <h2
              id="quit-mission-title"
              className="m-0 mt-[16px] text-center text-[19px] font-black text-[#1C1C3A]"
            >
              미션을 포기할까요?
            </h2>
            <p className="mx-auto mt-[8px] max-w-[300px] break-keep text-center text-[13px] leading-[20px] text-[#6F7B8D]">
              ‘{quitTarget.missionTitle}’의 현재 진행 기록이 종료돼요.
            </p>

            {quitError ? (
              <p
                role="alert"
                className="mt-[12px] rounded-[12px] bg-[#FFF1F2] px-[12px] py-[10px] text-center text-[12px] font-bold text-[#E54855]"
              >
                {quitError.message ||
                  "미션을 포기하지 못했어요. 다시 시도해주세요."}
              </p>
            ) : null}

            <Button
              variant="red"
              size="md"
              onClick={() => void handleQuit()}
              isLoading={isQuitting}
              className="mt-[20px] !h-[48px] !rounded-[15px] !bg-[#F05B67] !text-[14px]"
            >
              {isQuitting ? "포기 처리 중" : "미션 포기하기"}
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={closeQuitModal}
              disabled={isQuitting}
              className="mt-[8px] !h-[42px] !rounded-[14px] !bg-[#F4F8FF] !text-[13px] !text-[#5D6A7D]"
            >
              계속 진행하기
            </Button>
          </section>
        </div>
      ) : null}
    </QuespotPageContent>
  );
}

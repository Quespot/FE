import { Camera, ChevronRight, Clock3, Flag } from "lucide-react";

import Button from "@/components/common/Button";
import type { MissionAttempt } from "@/types/missionAttempt";

type Props = {
  attempt: MissionAttempt;
  onQuit: () => void;
  onViewDetail: () => void;
  onContinue: () => void;
};

export default function InProgressMissionCard({
  attempt,
  onQuit,
  onViewDetail,
  onContinue,
}: Props) {
  return (
    <article className="mt-[16px] overflow-hidden rounded-[22px] border border-[#DCEEFF] bg-white shadow-[0_8px_24px_rgba(51,111,161,0.10)]">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#BCE4FF] via-[#DCF2FF] to-[#E8FBF3] px-[20px] py-[24px]">
        <div className="absolute -right-[16px] -top-[28px] h-[120px] w-[120px] rounded-full bg-white/35" />
        <div className="relative flex items-center justify-between gap-[12px]">
          <div className="min-w-0">
            <span className="inline-flex rounded-full bg-white/85 px-[11px] py-[6px] text-[11px] font-black text-[#388FD0]">
              진행 중
            </span>
            <p className="m-0 mt-[13px] flex items-center gap-[5px] text-[12px] font-bold text-[#5D6A7D]">
              <Clock3 size={14} className="shrink-0" />
              {formatStartedAt(attempt.startedAt)}
            </p>
          </div>
          <div className="grid h-[64px] w-[64px] shrink-0 place-items-center rounded-[20px] border border-white/70 bg-white/65 text-[#4AA9EB]">
            <Flag size={30} strokeWidth={2.2} />
          </div>
        </div>
      </div>

      <div className="px-[18px] pb-[18px] pt-[19px]">
        <h3 className="m-0 break-keep text-[19px] font-black leading-[27px] text-[#1C1C3A]">
          {attempt.missionTitle}
        </h3>
        <div className="mt-[17px] flex items-center gap-[10px] rounded-[14px] bg-[#F7FAFE] px-[14px] py-[14px]">
          <Camera size={20} className="shrink-0 text-[#5BB5F8]" />
          <p className="m-0 text-[12px] font-medium leading-[19px] text-[#6F7B8D]">
            미션 장소에서 위치와 사진을 인증해주세요
          </p>
        </div>

        <Button
          variant="secondary"
          size="md"
          onClick={onViewDetail}
          className="mt-[10px] !justify-between !rounded-[13px] !border !border-[#E1EDFA] !bg-white !px-[14px] !text-[#5D6A7D] active:!bg-[#F7FAFE]"
          icon={null}
        >
          <span>미션 상세 확인하기</span>
          <ChevronRight size={16} className="text-[#8B97A7]" />
        </Button>

        <div className="mt-[16px] flex gap-[9px]">
          <Button
            variant="redSecondary"
            size="md"
            onClick={onQuit}
            className="!h-[50px] !w-auto shrink-0 !rounded-[16px] !border !border-[#FFDADD] !bg-[#FFF7F8] !px-[16px] !text-[13px] !text-[#F05B67]"
          >
            포기하기
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={onContinue}
            className="!h-[50px] min-w-0 flex-1 !rounded-[16px] !text-[14px] shadow-[0_7px_16px_rgba(91,181,248,0.27)]"
          >
            인증 계속하기 <ChevronRight size={17} strokeWidth={2.6} />
          </Button>
        </div>
      </div>
    </article>
  );
}

function formatStartedAt(value: string) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "시작 시간 확인 불가";
  return `${new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)} 시작`;
}

import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Lightbulb, Loader2, NotebookPen } from "lucide-react";

import Button from "@/components/common/Button";
import { PATH } from "@/routes/paths";
import { useMissionAttemptResult } from "@/hooks/queries/useMissionAttemptResult";
import type { MissionDetail } from "@/types/mission";

import Questy from "@/assets/icons/QuestyMain.svg";
import SadQuesty from "@/assets/questy_sad.svg";

type VerifyResultPageState = {
  missionId?: number;
  attemptId?: number | null;
  mission?: MissionDetail;
  missionTitle?: string;
  isDemoMode?: boolean;
  isSuccess?: boolean;
};

export default function VerifyResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as VerifyResultPageState | null;

  const attemptId = state?.attemptId ?? null;

  const { data, isLoading, isError } = useMissionAttemptResult(attemptId);

  const [previewStatus, setPreviewStatus] = useState<"success" | "fail">(
    state?.isSuccess === false ? "fail" : "success",
  );

  // getMissionAttemptResult()는 payload.result만 반환하므로 data를 그대로 사용
  const result = data;

  const resultViewData = useMemo(() => {
    return {
      missionTitle:
        result?.missionTitle ??
        state?.missionTitle ??
        state?.mission?.title ??
        "미션",
      earnedPoint: result?.earnedPoint ?? state?.mission?.rewardPoint ?? 120,
      photoUrl: result?.photoUrl,
    };
  }, [result, state]);

  const isSuccess = previewStatus === "success";

  if (attemptId && isLoading) {
    return <ResultLoading />;
  }

  return (
    <div
      className={`
        min-h-screen flex flex-col
        ${
          isSuccess
            ? "bg-gradient-to-b from-[#CFF8E5] to-[#EDFFF6]"
            : "bg-gradient-to-b from-[#FFE4E4] to-[#FFF4F4]"
        }
      `}
    >
      <div className="bg-white h-12 flex justify-end items-center pr-4">
        <div className="flex gap-2">
          <Button
            size="sm"
            className={
              isSuccess
                ? "type-body4"
                : "!bg-[#EAF5FF] !text-[#A2A9B2] type-body4"
            }
            onClick={() => setPreviewStatus("success")}
          >
            성공 예시
          </Button>

          <Button
            size="sm"
            variant={isSuccess ? "secondary" : "primary"}
            className="type-body4"
            onClick={() => setPreviewStatus("fail")}
          >
            실패 예시
          </Button>
        </div>
      </div>

      {isError && attemptId ? (
        <div className="mx-5 mt-4 rounded-2xl bg-white px-4 py-3 text-center text-[12px] font-bold text-[#F59E0B]">
          완료 결과 조회 API 응답을 불러오지 못해서 임시 결과를 표시하고
          있어요.
        </div>
      ) : null}

      {isSuccess ? (
        <SuccessResult navigate={navigate} result={resultViewData} />
      ) : (
        <FailResult navigate={navigate} state={state} />
      )}
    </div>
  );
}

function ResultLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F4F8FF]">
      <Loader2
        size={34}
        strokeWidth={2.4}
        className="animate-spin text-[#5BB5F8]"
      />

      <p className="mt-4 text-[14px] font-bold text-[#A2A9B2]">
        인증 결과를 불러오는 중이에요
      </p>
    </div>
  );
}

type SuccessResultProps = {
  navigate: ReturnType<typeof useNavigate>;
  result: {
    missionTitle: string;
    earnedPoint: number;
    photoUrl?: string;
  };
};

function SuccessResult({ navigate, result }: SuccessResultProps) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6">
      <img
        src={Questy}
        alt="퀘스티"
        className="w-[160px] h-[180px] object-cover"
      />

      <div className="w-full flex flex-col gap-5">
        <div className="mt-7 text-center">
          <h3 className="type-h3 text-[#008236]">미션 완료!</h3>

          <p className="type-body3 text-[#00A63E]">
            {result.missionTitle} 인증 성공
          </p>
        </div>

        {result.photoUrl ? (
          <div className="overflow-hidden rounded-2xl border border-[#B8E8CF] bg-white shadow-sm">
            <img
              src={result.photoUrl}
              alt="인증 사진"
              className="h-[160px] w-full object-cover"
            />
          </div>
        ) : null}

        <div className="rounded-2xl border border-[#B8E8CF] bg-white px-5 py-4 shadow-sm text-center">
          <p className="text-[30px] font-extrabold text-[#00A63E]">
            +{result.earnedPoint}P
          </p>

          <p className="type-body3 text-[#00C950]">포인트 지급 완료</p>
        </div>

        <div className="flex w-full gap-3">
          <Button
            variant="greenSecondary"
            size="md"
            onClick={() => navigate(PATH.MISSION_RECORD)}
          >
            <NotebookPen size={16} />
            감상 기록하기
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => navigate(PATH.MISSIONS)}
          >
            다음 미션
            <ArrowRight size={17} />
          </Button>
        </div>
      </div>
    </main>
  );
}

type FailResultProps = {
  navigate: ReturnType<typeof useNavigate>;
  state: VerifyResultPageState | null;
};

function FailResult({ navigate, state }: FailResultProps) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6">
      <img src={SadQuesty} alt="우는 퀘스티" className="w-[160px] h-[160px]" />

      <div className="w-full flex flex-col gap-5">
        <div className="mt-7 text-center">
          <h3 className="type-h3 text-red">인증 실패</h3>

          <p className="type-body3 text-red2">
            구도가 다르거나 장소가 맞지 않아요.
            <br />
            재촬영 기회가 <span className="type-caption3">2회</span> 남아
            있어요.
          </p>
        </div>

        <div className="rounded-2xl border border-[#FCA5A5] bg-white px-5 py-4 shadow-sm">
          <h2 className="text-[12px] font-black text-red">❌ 실패 이유</h2>

          <ul className="mt-2 flex flex-col gap-1 type-body3 text-red2">
            <li>· 간판이 사진에 포함되지 않았어요</li>
            <li>· GPS 위치와 사진 위치가 달라요</li>
          </ul>
        </div>

        <div>
          <Button
            variant="red"
            onClick={() =>
              navigate(PATH.MISSION_VERIFY, {
                replace: true,
                state: {
                  missionId: state?.missionId,
                  attemptId: state?.attemptId,
                  mission: state?.mission,
                  missionTitle: state?.missionTitle,
                },
              })
            }
          >
            다시 촬영하기
          </Button>

          <div className="mt-3 flex w-full gap-3">
            <Button variant="redSecondary" size="md">
              <Lightbulb size={15} />
              힌트 보기
            </Button>

            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate(PATH.MISSIONS)}
            >
              나중에 다시 도전
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
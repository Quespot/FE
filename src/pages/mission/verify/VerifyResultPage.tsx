import Button from "@/components/common/Button";
import { PATH } from "@/routes/paths";
import { ArrowRight, Lightbulb, NotebookPen } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Questy from "@/assets/icons/QuestyMain.svg";
import SadQuesty from "@/assets/questy_sad.svg";

export default function VerifyResultPage() {
  const navigate = useNavigate();
  const { status } = useParams();

  const isSuccess = status === "success";

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
            className="!bg-[#EAF5FF] !text-[#A2A9B2] type-body4"
          >
            성공 예시
          </Button>
          <Button size="sm" variant="primary" className="type-body4">
            실패 예시
          </Button>
        </div>
      </div>
      {isSuccess ? (
        <SuccessResult navigate={navigate} />
      ) : (
        <FailResult navigate={navigate} />
      )}
    </div>
  );
}

function SuccessResult({
  navigate,
}: {
  navigate: ReturnType<typeof useNavigate>;
}) {
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
            인사동 전통찻집 방문 인증 성공
          </p>
        </div>

        {/* 포인트 */}
        <div className="rounded-2xl border border-[#B8E8CF] bg-white px-5 py-4 shadow-sm text-center">
          <p className="text-[30px] font-extrabold text-[#00A63E]">+120P</p>

          <p className="type-body3 text-[#00C950]">포인트 지급 완료</p>
        </div>

        {/* 버튼 */}
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

function FailResult({
  navigate,
}: {
  navigate: ReturnType<typeof useNavigate>;
}) {
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

import { ArrowLeft, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

import QuespotPageLayout, {
  QuespotDivider,
  QuespotPageContent,
} from "@/layouts/QuespotPageLayout";
import { PATH } from "@/routes/paths";

export default function BonusRegionPage() {
  const navigate = useNavigate();

  return (
    <QuespotPageLayout>
      <header className="shrink-0 bg-white">
        <div className="flex h-[80px] items-center gap-[16px] px-[16px]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="grid h-[40px] w-[40px] shrink-0 place-items-center rounded-full bg-[#EAF5FF] text-[#5BB5F8]"
            aria-label="뒤로가기"
          >
            <ArrowLeft size={20} strokeWidth={2.6} />
          </button>

          <h1 className="m-0 text-[22px] font-black leading-[30px] text-[#1C1C3A]">
            추가 보상 지역
          </h1>
        </div>

        <QuespotDivider />
      </header>

      <QuespotPageContent className="gap-[16px] px-[16px] py-[16px]">
        <section className="flex min-h-[176px] shrink-0 flex-col items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#DFF3FF_0%,#EAF7FF_100%)] px-[20px] py-[20px] text-center">
          <BrightStarIcon />

          <h2 className="m-0 mt-[16px] text-[22px] font-black leading-[30px] text-[#1C1C3A]">
            추가 보상 지역이에요!
          </h2>

          <p className="m-0 mt-[12px] break-keep text-[15px] font-medium leading-[24px] text-[#7B8794]">
            이 지역은 인구감소 및 관광 활성화 지원 지역으로,
            <br />
            미션 완료 시 추가 포인트가 지급돼요.
          </p>
        </section>

        <section className="shrink-0 rounded-[16px] border border-[#EAF5FF] bg-white px-[16px] py-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <h2 className="m-0 text-[16px] font-black leading-[22px] text-[#1C1C3A]">
            💰 보상 구성
          </h2>

          <div className="mt-[22px] flex flex-col">
            <RewardRow label="기본 미션 포인트" value="+250P" />

            <RewardRow
              label="지역 가중치 보너스 (+20%)"
              value="+50P"
              valueClassName="text-[#F59E0B]"
            />

            <RewardRow
              label="🎫 소도시 특별 스탬프"
              value="증정"
              valueClassName="text-[#8B5CF6]"
            />

            <div className="mt-[12px] h-px bg-[#EAF5FF]" />

            <div className="flex items-center justify-between pt-[20px]">
              <strong className="text-[17px] font-black leading-[24px] text-[#1C1C3A]">
                총 예상 보상
              </strong>

              <strong className="text-[28px] font-black leading-[34px] text-[#5BB5F8]">
                +300P
              </strong>
            </div>
          </div>
        </section>

        <section className="shrink-0 rounded-[16px] border border-[#EAF5FF] bg-white px-[16px] py-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <h2 className="m-0 text-[16px] font-black leading-[22px] text-[#1C1C3A]">
            ❓ 왜 추가 보상을 주나요?
          </h2>

          <p className="m-0 mt-[16px] break-keep text-[15px] font-medium leading-[25px] text-[#7B8794]">
            Quespot은 여행객이 잘 가지 않는 지역, 인구가 감소하는 소도시를
            활성화하기 위해 해당 지역 미션에 추가 보상을 제공합니다. 새로운 곳을
            탐험하고 지역 경제에도 도움을 주세요!
          </p>
        </section>

        <button
          type="button"
          onClick={() => navigate(PATH.MISSION_PHOTO)}
          className="mt-[12px] h-[56px] shrink-0 rounded-[16px] bg-[#5BB5F8] text-[16px] font-black leading-none text-white shadow-[0_8px_18px_rgba(91,181,248,0.24)]"
        >
          이 미션 시작하기
        </button>
      </QuespotPageContent>
    </QuespotPageLayout>
  );
}

function BrightStarIcon() {
  return (
    <div className="relative grid h-[72px] w-[72px] place-items-center">
      <span className="absolute h-[58px] w-[58px] rounded-full bg-[#FFF4B8] blur-[10px]" />
      <span className="absolute h-[48px] w-[48px] rounded-full bg-[#FFF7D6]" />

      <Star
        size={54}
        fill="#FFD84D"
        stroke="#FFB800"
        strokeWidth={1.8}
        className="relative z-10 drop-shadow-[0_4px_6px_rgba(255,184,0,0.35)]"
      />
    </div>
  );
}

type RewardRowProps = {
  label: string;
  value: string;
  valueClassName?: string;
};

function RewardRow({
  label,
  value,
  valueClassName = "text-[#6B7280]",
}: RewardRowProps) {
  return (
    <div className="flex min-h-[44px] items-center justify-between border-b border-[#EAF5FF] last:border-b-0">
      <span className="text-[15px] font-medium leading-[22px] text-[#7B8794]">
        {label}
      </span>

      <strong
        className={[
          "text-[18px] font-black leading-[24px]",
          valueClassName,
        ].join(" ")}
      >
        {value}
      </strong>
    </div>
  );
}
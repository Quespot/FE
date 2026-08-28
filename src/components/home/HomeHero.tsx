import { ChevronRight } from "lucide-react";
import { Button } from "@/components/UI";

type HomeHeroProps = {
  nickname: string;
  mascotSrc: string;
  onExploreClick: () => void;
};

export default function HomeHero({
  nickname,
  mascotSrc,
  onExploreClick,
}: HomeHeroProps) {
  return (
    <section className="-mx-[18px] grid grid-cols-[minmax(0,1fr)_152px] items-center gap-2 bg-[linear-gradient(180deg,#cdeeff_0%,#e9f7ff_100%)] px-[22px] pb-[26px] pt-[20px] max-[380px]:grid-cols-[1fr_126px]">
      <div>
        <span className="inline-flex items-center rounded-full bg-white/90 px-[14px] py-[7px] text-[12px] font-black text-[#5bb5f8] before:mr-2 before:h-[7px] before:w-[7px] before:rounded-full before:bg-[#5bb5f8] before:content-['']">
          {nickname}님 안녕하세요!
        </span>

        <h1 className="m-0 mt-[18px] text-[26px] font-black leading-[1.22] tracking-[-0.3px] text-[#1c1c3a]">
          미션으로 떠나는
          <br />
          <span className="text-[#5bb5f8]">특별한 여행</span>
        </h1>

        <p className="mb-[18px] mt-[12px] text-[14px] leading-[1.55] text-[#718198]">
          Questy와 함께 일상을
          <br />
          여행으로 바꿔보세요
        </p>

        <Button
          className="min-h-10 w-fit rounded-[18px] bg-[#5bb5f8] px-[18px] text-[13px] font-black shadow-[0_8px_16px_rgba(91,181,248,0.28)]"
          icon={<ChevronRight size={16} strokeWidth={2.6} />}
          onClick={onExploreClick}
        >
          미션 탐색
        </Button>
      </div>

      <img
        className="h-[158px] w-[158px] justify-self-end object-contain drop-shadow-[0_18px_18px_rgba(43,143,219,0.18)] max-[380px]:h-[126px] max-[380px]:w-[126px]"
        src={mascotSrc}
        alt="Quespot 캐릭터"
      />
    </section>
  );
}
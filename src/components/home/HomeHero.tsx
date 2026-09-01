import { ChevronRight } from "lucide-react";

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
    <section className="relative flex min-h-[190px] w-full items-center overflow-hidden">
      <div className="z-10 min-w-0 flex-1 py-[10px]">
        <span className="inline-flex h-[28px] items-center rounded-full bg-white px-[14px] text-[12px] font-black leading-none text-[#5BB5F8] shadow-[0_2px_6px_rgba(91,181,248,0.12)]">
          안녕 {nickname}님!
        </span>

        <h1 className="m-0 mt-[16px] break-keep text-[24px] font-black leading-[32px] text-[#1C1C3A]">
          미션으로 떠나는
          <br />
          <span className="text-[#5BB5F8]">특별한 여행</span>
        </h1>

        <p className="m-0 mt-[12px] break-keep text-[13px] font-medium leading-[21px] text-[#7B8794]">
          Questy와 함께 일상을
          <br />
          여행으로 바꿔보세요
        </p>

        <button
          type="button"
          onClick={onExploreClick}
          className="mt-[18px] inline-flex items-center gap-[6px] rounded-[16px] bg-[#5BB5F8] px-[16px] py-[10px] text-[13px] font-black leading-[16px] text-white shadow-[0_4px_6px_-1px_#BEDDFF] transition active:scale-[0.98]"
        >
          미션 탐색
          <ChevronRight size={15} strokeWidth={2.8} />
        </button>
      </div>

      <div className="pointer-events-none absolute bottom-[4px] right-[-10px] top-[4px] flex w-[205px] items-center justify-end">
        <img
          src={mascotSrc}
          alt="퀘스티"
          className="animate-questy-tumble h-[198px] w-[160px] object-contain drop-shadow-[0_12px_20px_rgba(8,37,95,0.14)]"
        />
      </div>
    </section>
  );
}
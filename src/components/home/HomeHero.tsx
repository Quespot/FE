import { ChevronRight } from "lucide-react";

type HomeHeroProps = {
  nickname: string;
  questySrc: string;
  onExploreClick: () => void;
};

export default function HomeHero({
  nickname,
  questySrc,
  onExploreClick,
}: HomeHeroProps) {
  return (
    <section className="relative flex min-h-[218px] w-full items-center overflow-hidden rounded-[28px] border border-white/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.58)_0%,rgba(216,241,255,0.35)_100%)] px-[16px] shadow-[0_12px_35px_rgba(54,145,204,0.10)]">
      <span className="pointer-events-none absolute -left-8 -top-10 h-24 w-24 rounded-full bg-white/45" />
      <span className="pointer-events-none absolute bottom-[-36px] right-20 h-28 w-28 rounded-full bg-[#a9ddff]/25" />
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
          나만의 Questy와 함께 일상을
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

      <div className="pointer-events-none absolute bottom-0 right-[-4px] top-0 z-0 w-[190px] overflow-visible">
        <img
          src={questySrc}
          alt="퀘스티"
          className="absolute bottom-[5px] right-[-4px] z-[2] h-[194px] w-[194px] object-contain drop-shadow-[0_14px_18px_rgba(32,104,151,0.18)]"
        />
      </div>
    </section>
  );
}

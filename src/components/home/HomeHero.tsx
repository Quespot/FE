import { ChevronRight } from "lucide-react";

type HomeHeroProps = {
  nickname: string;
  questySrc: string;
  airplaneSrc: string;
  onExploreClick: () => void;
};

export default function HomeHero({
  nickname,
  questySrc,
  airplaneSrc,
  onExploreClick,
}: HomeHeroProps) {
  return (
    <section className="relative flex min-h-[198px] w-full items-center overflow-hidden">
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

      <div className="pointer-events-none absolute bottom-[4px] right-[-16px] top-[0px] z-0 w-[248px] overflow-visible">
        {/* 1) 처음 가만히 떠 있는 퀘스티 */}
        <img
          src={questySrc}
          alt="퀘스티"
          className="absolute bottom-[8px] right-[48px] z-[2] h-[132px] w-[132px] object-contain animate-questy-wait"
        />

        {/* 2) 1~2초 뒤 들어오는 비행기 + 탑승 퀘스티 */}
        <div className="absolute bottom-[2px] right-[-170px] z-[3] h-[150px] w-[240px] animate-plane-enter-and-fly">
          <img
            src={airplaneSrc}
            alt="퀘스티 비행기"
            className="absolute inset-0 h-full w-full object-contain"
          />

          <img
            src={questySrc}
            alt="비행기를 타는 퀘스티"
            className="absolute left-[84px] top-[22px] h-[58px] w-[58px] object-contain animate-questy-on-plane"
          />

          <span className="absolute left-[28px] top-[74px] h-[4px] w-[26px] rounded-full bg-white/80 animate-air-trail-1" />
          <span className="absolute left-[8px] top-[92px] h-[3px] w-[20px] rounded-full bg-white/65 animate-air-trail-2" />
          <span className="absolute left-[20px] top-[108px] h-[3px] w-[16px] rounded-full bg-white/55 animate-air-trail-3" />
        </div>
      </div>
    </section>
  );
}
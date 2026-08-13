import { useState } from "react";
import {
  Bell,
  Building2,
  Camera,
  ChevronRight,
  ClipboardCheck,
  Compass,
  Heart,
  Leaf,
  MapPin,
  Palette,
  ShoppingBag,
  Star,
  Sunrise,
  Utensils,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { Button, SearchInput } from "../components/UI";
import {
  figmaAssets,
  homeCategories,
  nearbySpots,
  recommendedMissions,
} from "../data/quespot";
import { useNavigate } from "react-router-dom";
import { PATH } from "@/routes/paths";

const categoryToneClasses = {
  violet: "bg-[#eee1ff] text-[#8b5cf6]",
  green: "bg-[#e1faef] text-green-600",
  amber: "bg-[#fff1c9] text-amber-600",
  blue: "bg-[#dcecff] text-[#2577ff]",
  pink: "bg-[#ffe1f0] text-pink-500",
  cyan: "bg-[#cff9fb] text-cyan-600",
  rose: "bg-[#ffdede] text-red-500",
  purple: "bg-[#f0e3ff] text-purple-600",
} as const;

const missionToneClasses = {
  cream: "bg-[linear-gradient(145deg,_#fff6cc_0%,_#fffef6_100%)]",
  lavender: "bg-[linear-gradient(145deg,_#f6f0ff_0%,_#fffaff_100%)] bg-[linear-gradient(145deg,_#f1e8ff_0%,_#fffaff_100%)]",
  mint: "bg-[linear-gradient(145deg,_#ddfaee_0%,_#fafffd_100%)]",
  peach: "bg-[linear-gradient(145deg,_#ffe6d7_0%,_#fff9f5_100%)]",
  blue: "bg-[linear-gradient(145deg,#dff1ff_0%,#f7fcff_100%)]",
} as const;


const categoryIcons: Record<string, LucideIcon> = {
  history: Building2,
  nature: Leaf,
  food: Utensils,
  night: Sunrise,
  photo: Camera,
  activity: Waves,
  shopping: ShoppingBag,
  art: Palette,
};

export default function HomePage() {
  const [showAllMissions, setShowAllMissions] = useState(false);
  const visibleMissions = showAllMissions
    ? recommendedMissions
    : recommendedMissions.slice(0, 2);
  const navigate = useNavigate();
  return (
    <section className="flex flex-col py-6 px-5 gap-3 p-[12px_16px_0] gap-4 min-h-[100%] [overflow-y:auto] p-[18px_16px_16px] flex-1 gap-[22px] min-h-0 p-[0_18px_22px] bg-[#f2f7ff]">
      <header className="flex items-center justify-between min-h-[42px] min-h-14 m-[0_-18px] p-[0_22px] bg-white">
        <div className="flex items-center gap-2">
          <img className="w-[34px] h-[34px] object-contain" src={figmaAssets.mascot} alt="" />
          <strong className="block text-[var(--primary)] text-[22px] font-black text-[var(--primary-soft)] text-2xl leading-none">Quespot</strong>
        </div>
        <button className="relative grid w-9 h-9 place-items-center rounded-full bg-transparent text-[#b7c2d1]" type="button" aria-label="알림">
          <Bell size={19} strokeWidth={2.4} />
          <span className="absolute right-0 top-[2px] grid w-[18px] h-[18px] place-items-center border-[2px_solid_#fff] rounded-full bg-red-500 text-white text-[10px] font-black">3</span>
        </button>
      </header>

      <section className="grid [grid-template-columns:minmax(0,_1fr)_152px] gap-2 items-center m-[0_-18px] p-[20px_22px_26px] bg-[linear-gradient(180deg,_#cdeeff_0%,_#e9f7ff_100%)] max-[380px]:[grid-template-columns:1fr_126px]">
        <div>
          <span className="inline-flex items-center rounded-full p-[7px_14px] bg-[rgba(255,_255,_255,_0.86)] text-[var(--primary-soft)] text-xs font-black before:[content:''] before:w-[7px] before:h-[7px] before:mr-2 before:rounded-full before:bg-[var(--primary-soft)]">꿀법님 안녕하세요!</span>
          <h1 className="m-0 text-[var(--navy)] text-[13px] leading-[1.38] m-[18px_0_10px] text-[var(--ink)] text-[26px] leading-[1.22] tracking-[0] bg-[linear-gradient(_180deg,_var(--ink)_0_48%,_var(--primary-soft)_48%_100%_)] [-webkit-background-clip:text] [background-clip:text] text-transparent">
            미션으로 떠나는
            <br />
            특별한 여행
          </h1>
          <p className="m-[0_0_18px] text-[#718198] text-sm leading-[1.55]">
            Quespot과 함께 일상을
            <br />
            여행으로 바꿔보세요
          </p>
          <Button
            className="w-fit min-h-10 rounded-[18px] p-[0_18px] bg-[var(--primary-soft)] text-[13px] [box-shadow:0_8px_16px_rgba(91,_181,_248,_0.28)]"
            icon={<ChevronRight size={16} strokeWidth={2.6} />}
            onClick={() => navigate(PATH.MISSION_PHOTO)}
          >
            미션 탐색
          </Button>
        </div>
        <img className="justify-self-[end] w-[158px] h-[158px] object-contain [filter:drop-shadow(0_18px_18px_rgba(43,_143,_219,_0.18))] max-[380px]:w-[126px] max-[380px]:h-[126px]" src={figmaAssets.heroMascot} alt="Quespot 캐릭터" />
      </section>

      <SearchInput placeholder="미션 · 장소 · 지역을 검색해보세요" />

      <section className="grid [grid-template-columns:repeat(4,_minmax(0,_1fr))] overflow-hidden rounded-[18px] bg-white [box-shadow:0_2px_8px_rgba(8,_37,_95,_0.08)] px-1.5" aria-label="활동 요약">
        <article className="grid gap-[5px] justify-items-center min-h-[70px] py-4 [border-right:1px_solid_#e8eff8] text-center last:[border-right:0]">
          <strong className="text-[var(--primary-soft)] text-lg leading-none">2개</strong>
          <span className="text-[#8b98aa] text-[10px] font-bold">완료 미션</span>
        </article>
        <article className="grid gap-[5px] justify-items-center min-h-[70px] py-4 [border-right:1px_solid_#e8eff8] text-center last:[border-right:0]">
          <strong className="text-[var(--primary-soft)] text-lg leading-none">350P</strong>
          <span className="text-[#8b98aa] text-[10px] font-bold">누적 보상</span>
        </article>
        <article className="grid gap-[5px] justify-items-center min-h-[70px] py-4 [border-right:1px_solid_#e8eff8] text-center last:[border-right:0]">
          <strong className="text-[var(--primary-soft)] text-lg leading-none">2개</strong>
          <span className="text-[#8b98aa] text-[10px] font-bold">획득 배지</span>
        </article>
        <article className="grid gap-[5px] justify-items-center min-h-[70px] py-4 [border-right:1px_solid_#e8eff8] text-center last:[border-right:0]">
          <strong className="text-[var(--primary-soft)] text-lg leading-none">2개</strong>
          <span className="text-[#8b98aa] text-[10px] font-bold">스탬프</span>
        </article>
      </section>

      <section className="grid gap-3.5">
        <h2 className="m-0 text-[var(--ink)] text-lg leading-tight tracking-[0]">카테고리</h2>
        <div className="grid [grid-template-columns:repeat(4,_minmax(0,_1fr))] gap-2.5 max-[380px]:gap-2">
          {homeCategories.map((category) => {
            const Icon = categoryIcons[category.id] ?? Compass;

            return (
              <button
                className="grid min-h-24 justify-items-center gap-2.5 rounded-[15px] border border-[#dce8f5] bg-white px-1.5 pb-3 pt-3.5 text-[var(--ink)] shadow-[0_2px_6px_rgba(8,37,95,0.11)]"
                key={category.id}
                type="button"
              >
                <span className={`grid h-[50px] w-[50px] place-items-center rounded-[17px] ${categoryToneClasses[category.tone]}`}>
                  <Icon size={26} strokeWidth={2.3} />
                </span>
                <strong className="text-[#59677a] text-[11px] leading-tight text-center max-[380px]:text-[10px]">{category.label}</strong>
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid gap-3.5">
        <div className="flex items-center justify-between">
          <h2 className="m-0 text-[var(--ink)] text-lg leading-tight tracking-[0] m-0 text-[var(--navy)] text-lg inline-flex items-center gap-[5px]">추천 미션</h2>
          <button className="bg-transparent text-[var(--primary)] text-xs font-black inline-flex items-center gap-[3px] text-[var(--primary-soft)] text-[13px]"
            onClick={() => setShowAllMissions((value) => !value)}
            type="button"
          >
            {showAllMissions ? "접기" : "전체보기"}{" "}
            <ChevronRight size={15} strokeWidth={2.6} />
          </button>
        </div>
        <div
          className={`grid [grid-template-columns:repeat(2,_minmax(0,_1fr))] gap-3 ${showAllMissions ? "" : ""}`}
        >
          {visibleMissions.map((mission) => (
            <article
              className="overflow-hidden border-[1px_solid_#dce8f5] rounded-2xl bg-white [box-shadow:0_2px_8px_rgba(8,_37,_95,_0.09)] cursor-pointer"
              key={mission.id}
              onClick={() => navigate(PATH.MISSION_DETAIL)}
            >
              <div className={`relative grid min-h-[122px] place-items-center ${missionToneClasses[mission.tone]}`}>
                <button className="absolute right-[10px] top-[10px] grid w-7 h-7 place-items-center rounded-full bg-[rgba(255,_255,_255,_0.85)] text-[#b8c3d2]"
                  onClick={(event) => event.stopPropagation()}
                  type="button"
                  aria-label={`${mission.title} 찜하기`}
                >
                  <Heart size={15} strokeWidth={2.3} />
                </button>
                <span className="text-[44px] [filter:drop-shadow(0_10px_12px_rgba(8,_37,_95,_0.12))]">{mission.visual}</span>
              </div>
              <div className="p-[12px_12px_14px]">
                <span className="inline-flex rounded-full p-[5px_9px] bg-[#fff0c9] text-[#f59e0b] text-[11px] font-black">{mission.category}</span>
                <strong className="block mt-[9px] text-[var(--ink)] text-sm leading-[1.35]">{mission.title}</strong>
                <footer className="flex items-center justify-between mt-3 text-[#99a6b8] text-xs">
                  <span>
                    <MapPin size={12} strokeWidth={2.4} />
                    {mission.distance}
                  </span>
                  <b>+{mission.points}P</b>
                </footer>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-3.5">
        <div className="flex items-center justify-between">
          <h2 className="m-0 text-[var(--ink)] text-lg leading-tight tracking-[0] m-0 text-[var(--ink)] text-lg leading-tight tracking-[0] m-0 text-[var(--navy)] text-lg inline-flex items-center gap-[5px]">
            <MapPin size={15} fill="#ef4444" strokeWidth={2.2} />내 주변 스팟
          </h2>
          <button className="bg-transparent text-[var(--primary)] text-xs font-black inline-flex items-center gap-[3px] text-[var(--primary-soft)] text-[13px]" onClick={() => navigate(PATH.MAP)} type="button">
            지도보기 <ChevronRight size={15} strokeWidth={2.6} />
          </button>
        </div>
        <div className="grid gap-3">
          {nearbySpots.map((spot) => (
            <article className="grid grid-cols-[56px_minmax(0,1fr)_auto_34px] items-center gap-2.5 rounded-[18px] border border-[#dce8f5] bg-white px-3 py-2.5 shadow-[0_2px_8px_rgba(8,37,95,0.09)]" key={spot.id}>
              <span className={`relative grid h-[50px] w-[50px] place-items-center rounded-[17px] ${spot.done ? "bg-[#e7fff4] text-[#14d98b]" : "bg-[#e9f5ff] text-[var(--primary-soft)]"}`}>
                <MapPin size={22} strokeWidth={2.4} />
                {spot.done ? (
                  <ClipboardCheck
                    className="absolute right-[-2px] top-[-7px] grid place-items-center border-[2px_solid_#fff] rounded-full bg-[#16d889] text-white"
                    size={15}
                    strokeWidth={2.5}
                  />
                ) : null}
                {spot.badge ? <b className="absolute -right-0.5 -top-[7px] grid h-[22px] w-[22px] place-items-center rounded-full border-2 border-white bg-[var(--primary-soft)] text-[10px] font-black text-white">{spot.badge}</b> : null}
              </span>
              <div className="">
                <strong className="block overflow-hidden text-[var(--ink)] text-base [text-overflow:ellipsis] whitespace-nowrap">{spot.name}</strong>
                <p className="flex items-center gap-[9px] m-[7px_0_0] text-[#9aa6b8] text-xs">
                  {spot.distance}
                  <i className="w-[1px] h-2.5 bg-[#d9e2ee]" />
                  {spot.status === "완료" ? (
                    <em className="text-[#16c77a] not-italic font-black">완료</em>
                  ) : (
                    `미션 ${spot.missionCount}개`
                  )}
                </p>
              </div>
              <span className="inline-flex items-center gap-[3px] text-[#697789] text-xs font-extrabold">
                <Star size={12} fill="#f5b01a" strokeWidth={0} />
                {spot.rating}
              </span>
              <button
                onClick={
                  spot.done
                    ? () => navigate(PATH.MISSION_RECORD)
                    : () => navigate(PATH.MISSION_DETAIL)
                }
                type="button"
                aria-label={`${spot.name} 열기`}
              >
                <ChevronRight size={17} strokeWidth={2.6} />
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="grid min-h-24 grid-cols-[82px_minmax(0,1fr)] items-center gap-3 overflow-hidden rounded-3xl bg-[radial-gradient(circle_at_right_40%,rgba(255,255,255,0.13)_0_62px,transparent_63px),linear-gradient(135deg,#55b8fb_0%,#63bded_100%)] px-5 py-[18px] text-white">
        <img className="h-[72px] w-[72px] object-contain" src={figmaAssets.mascot} alt="" />
        <div>
          <strong className="block text-base leading-snug">소도시 미션에서 추가 보너스 포인트!</strong>
          <p className="mb-0 mt-1.5 text-[11px] text-white/80">인구감소지역 미션 완료 시 +20% 보너스</p>
        </div>
      </section>
    </section>
  );
}

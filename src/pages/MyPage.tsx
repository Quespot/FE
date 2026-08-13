import {
  Archive,
  Bell,
  ChevronRight,
  Heart,
  MapPin,
  Plane,
  Star,
  Trophy,
} from "lucide-react";
import { figmaAssets } from "../data/quespot";
import { useNavigate } from "react-router-dom";
import { PATH } from "@/routes/paths";

const styleTags = ["🏯 역사·문화", "📸 사진 여행", "🍲 맛집 탐방", "🌿 자연"];

const panelClass =
  "rounded-[20px] border border-[#dce8f5] bg-white p-[18px] shadow-[0_2px_8px_rgba(8,37,95,0.08)]";
const panelTitleClass =
  "mb-[15px] flex items-center gap-1.5 text-base text-[var(--ink)]";

export default function MyPage() {
  const navigate = useNavigate();

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#f2f7ff]">
      <header className="flex min-h-[66px] shrink-0 items-center justify-between bg-white px-[30px]">
        <div className="flex items-center gap-2">
          <img className="h-9 w-9 object-contain" src={figmaAssets.mascot} alt="" />
          <strong className="text-2xl font-black text-[var(--primary-soft)]">Quespot</strong>
        </div>
        <button
          className="relative grid h-9 w-9 place-items-center rounded-full bg-transparent text-[#b7c2d1]"
          type="button"
          aria-label="알림"
        >
          <Bell size={19} strokeWidth={2.4} />
          <span className="absolute right-0 top-0.5 grid h-[18px] w-[18px] place-items-center rounded-full border-2 border-white bg-red-500 text-[10px] font-black text-white">
            3
          </span>
        </button>
      </header>

      <section className="relative grid min-h-[350px] justify-items-center overflow-hidden bg-[linear-gradient(180deg,#cfefff_0%,#e7f6ff_100%)] px-6 pb-[30px] pt-11 text-center after:absolute after:right-[-64px] after:top-0 after:h-[190px] after:w-[190px] after:rounded-full after:bg-[rgba(8,37,95,0.08)] after:content-['']">
        <div className="relative z-10 grid h-28 w-28 place-items-center rounded-full bg-white shadow-[0_8px_20px_rgba(8,37,95,0.14)]">
          <img className="h-[86px] w-[86px] object-contain" src={figmaAssets.mascot} alt="퀘스티" />
          <button
            className="absolute -right-1 bottom-2 grid h-[34px] w-[34px] place-items-center rounded-full bg-[var(--primary-soft)] text-white shadow-[0_6px_12px_rgba(91,181,248,0.28)]"
            type="button"
            aria-label="프로필 편집"
          >
            ✏️
          </button>
        </div>
        <h1 className="z-10 mb-1 mt-[22px] text-2xl font-bold leading-tight text-[var(--ink)]">
          Quespot 탐험가
        </h1>
        <p className="z-10 m-0 text-[15px] text-[#9aa6b8]">@quespotter_001</p>
        <div className="z-10 mt-[26px] grid w-[250px] grid-cols-3">
          {[['2', '완료 미션'], ['1,240', '포인트'], ['2', '배지']].map(([value, label]) => (
            <article className="grid gap-[7px]" key={label}>
              <strong className="text-2xl leading-none text-[var(--primary-soft)]">{value}</strong>
              <span className="text-xs font-extrabold text-[#9aa6b8]">{label}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 px-[22px] pb-6 pt-7">
        <button
          className="grid min-h-32 grid-cols-[86px_minmax(0,1fr)_22px] items-center gap-3.5 rounded-[20px] border border-[#cde9ff] bg-white p-[18px] text-left text-[var(--ink)] shadow-[0_2px_8px_rgba(8,37,95,0.11)]"
          onClick={() => navigate(PATH.QUESTY_CUSTOMIZE)}
          type="button"
        >
          <img className="h-[76px] w-[76px] animate-[questyFloat_3.2s_ease-in-out_infinite] object-contain" src={figmaAssets.mascot} alt="퀘스티" />
          <div>
            <strong className="block text-lg leading-tight">마스코트 꾸미기</strong>
            <p className="mb-2.5 mt-1.5 text-xs leading-snug text-[#9aa6b8]">
              포인트로 아이템을 구매하고 나만의 Quespot을 만들어요
            </p>
            <span className="flex gap-[7px]">
              <b className="rounded-full bg-[var(--primary-soft)] px-2.5 py-1.5 text-xs font-black text-white">3개 보유</b>
              <em className="rounded-full bg-[#fff0c9] px-2.5 py-1.5 text-xs font-black not-italic text-[#ea8a00]">전설 1개</em>
            </span>
          </div>
          <ChevronRight className="text-[#c8e8ff]" size={20} strokeWidth={2.5} />
        </button>

        <section className="grid grid-cols-3 gap-3" aria-label="내 활동 바로가기">
          {[
            { icon: <Heart size={28} fill="#ef4444" strokeWidth={0} />, label: "좋아요" },
            { icon: <MapPin size={30} strokeWidth={2.4} />, label: "저장 장소" },
            { icon: <Archive size={29} strokeWidth={2.3} />, label: "아카이브" },
          ].map(({ icon, label }) => (
            <button className="grid min-h-[116px] justify-items-center gap-2.5 rounded-[18px] border border-[#dce8f5] bg-white px-1.5 pb-[18px] pt-6 text-[#7d8794] shadow-[0_2px_8px_rgba(8,37,95,0.1)]" type="button" key={label}>
              {icon}
              <strong className="text-sm">{label}</strong>
            </button>
          ))}
        </section>

        <section className={panelClass}>
          <h2 className={panelTitleClass}><Plane size={17} strokeWidth={2.5} />내 여행 스타일</h2>
          <div className="flex flex-wrap gap-2.5">
            {styleTags.map((tag) => (
              <span className="rounded-full bg-[var(--primary-soft)] px-3.5 py-2.5 text-[13px] font-black text-white" key={tag}>{tag}</span>
            ))}
          </div>
        </section>

        <section className={`${panelClass} grid gap-[11px]`}>
          <h2 className={panelTitleClass}><Trophy size={17} strokeWidth={2.5} />달성 현황</h2>
          <div className="flex items-center justify-between text-[13px] font-extrabold text-[#8a98aa]">
            <span>미션 완료</span><strong className="text-base text-[var(--ink)]">2 / 20</strong>
          </div>
          <progress className="h-2.5 w-full overflow-hidden rounded-full border-0 bg-[var(--sky-100)] [&::-webkit-progress-bar]:bg-[var(--sky-100)] [&::-webkit-progress-value]:rounded-[inherit] [&::-webkit-progress-value]:bg-[var(--primary-soft)]" max={20} value={2} />
          <div className="flex items-center justify-between text-[13px] font-extrabold text-[#8a98aa]">
            <span>획득 배지</span><strong className="text-base text-[var(--ink)]">2 / 12</strong>
          </div>
          <progress className="h-2.5 w-full overflow-hidden rounded-full border-0 bg-[var(--sky-100)] [&::-webkit-progress-bar]:bg-[var(--sky-100)] [&::-webkit-progress-value]:rounded-[inherit] [&::-webkit-progress-value]:bg-[var(--primary-soft)]" max={12} value={2} />
        </section>

        <section className={panelClass}>
          <h2 className={panelTitleClass}><Star size={17} fill="#f5b01a" strokeWidth={0} />최근 기록</h2>
          <p className="m-0 text-[13px] leading-relaxed text-[#65758b]">인사동 전통찻집에서 “따뜻함” 감상을 남겼어요.</p>
        </section>
      </section>
    </section>
  );
}



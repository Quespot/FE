import { useState, type ReactNode } from "react";
import { ArrowLeft, LocateFixed, MapPin, Minus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ThemeIcon, { getThemeConfig, type ThemeKey } from "@/components/common/ThemeIcon";
import { PATH } from "@/routes/paths";

type ArchiveRecord = {
  id: string;
  title: string;
  date: string;
  points: number;
  theme: ThemeKey;
  left: string;
  top: string;
};

const filters = ["전체", "7월", "6월", "서울", "부산"];
const pinColors: Partial<Record<ThemeKey, { main: string; soft: string }>> = {
  history: { main: "#8b5cf6", soft: "#f0e8ff" },
  culture: { main: "#4ea9e9", soft: "#e6f5ff" },
  cafe: { main: "#b87848", soft: "#f7eadd" },
  nature: { main: "#2dbb78", soft: "#e4f8ed" },
  food: { main: "#efa82f", soft: "#fff3d5" },
};
const records: ArchiveRecord[] = [
  { id: "gyeongbokgung", title: "경복궁", date: "07.05", points: 150, theme: "history", left: "31%", top: "25%" },
  { id: "bukchon", title: "북촌", date: "07.06", points: 200, theme: "culture", left: "58%", top: "17%" },
  { id: "insadong", title: "인사동", date: "07.08", points: 120, theme: "cafe", left: "47%", top: "44%" },
];

export default function ArchivePage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("전체");

  return (
    <main className="flex min-h-dvh flex-col overflow-hidden bg-[#eef7ff] text-[#18213b]">
      <header className="relative z-20 bg-white">
        <div className="flex h-[76px] items-end border-b border-[#edf1f5] px-[18px] pb-[13px]">
          <button className="grid h-9 w-9 place-items-center rounded-full bg-[#eaf6ff] text-[#4faae7] transition active:scale-95" aria-label="마이페이지로 돌아가기" onClick={() => navigate(PATH.MY)} type="button"><ArrowLeft size={18} strokeWidth={2.2} /></button>
          <h1 className="ml-3 self-center pt-[21px] text-[16px] font-extrabold">나의 여행 아카이브</h1>
        </div>
        <nav className="flex items-center gap-2 border-b border-[#eaf0f5] px-[18px] py-[13px]" aria-label="아카이브 필터">
          {filters.map((filter) => {
            const selected = activeFilter === filter;
            return <button className="h-8 shrink-0 rounded-full px-[14px] text-[10px] font-extrabold transition-colors" key={filter} onClick={() => setActiveFilter(filter)} style={{ backgroundColor: selected ? "#5bb5f8" : "#e8f3fb", color: selected ? "#ffffff" : "#98a6b3" }} type="button">{filter}</button>;
          })}
        </nav>
      </header>

      <section className="relative min-h-0 flex-1 overflow-hidden bg-[#dff3ff]" aria-label="방문 기록 지도">
        <div className="absolute inset-0 opacity-70" style={{ backgroundImage: "linear-gradient(rgba(93,169,214,.14) 1px,transparent 1px),linear-gradient(90deg,rgba(93,169,214,.14) 1px,transparent 1px)", backgroundSize: "28px 28px" }} aria-hidden="true" />
        <div className="absolute -left-10 top-12 h-10 w-44 -rotate-6 rounded-full border-[5px] border-white/65" aria-hidden="true" />
        <div className="absolute -right-16 bottom-32 h-52 w-52 rounded-full bg-[#ccecff]/60" aria-hidden="true" />

        <div className="absolute right-[14px] top-[14px] z-10 grid gap-2">
          <MapControl label="현재 위치"><LocateFixed size={16} /></MapControl>
          <div className="overflow-hidden rounded-[14px] border border-[#dce5ed] bg-white shadow-[0_4px_12px_rgba(56,89,113,0.12)]">
            <button className="grid h-10 w-10 place-items-center text-[#4aa9e8]" aria-label="지도 확대" type="button"><Plus size={17} /></button>
            <i className="mx-auto block h-px w-6 bg-[#e8edf2]" />
            <button className="grid h-10 w-10 place-items-center text-[#4aa9e8]" aria-label="지도 축소" type="button"><Minus size={17} /></button>
          </div>
        </div>

        {records.map((record) => <ArchivePin key={record.id} record={record} />)}

        <aside className="absolute bottom-[92px] left-[14px] rounded-[16px] border border-[#dbe6ef] bg-white/95 px-3.5 py-3 shadow-[0_6px_18px_rgba(48,88,118,0.13)] backdrop-blur-md">
          <strong className="block text-[10.5px] font-extrabold">내 여행 발자국</strong>
          <p className="mt-1 text-[9px] text-[#91a0af]">완료 <b className="text-[#38c890]">{records.length}개</b><i className="mx-1.5 not-italic text-[#c7d0d8]">·</i>총 <b className="text-[#3ca9ec]">{records.reduce((sum, record) => sum + record.points, 0)}P</b></p>
        </aside>

        <section className="absolute inset-x-0 bottom-0 bg-white px-[14px] pb-[max(14px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-6px_18px_rgba(41,79,112,0.08)]" aria-label="최근 방문 기록">
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {records.map((record) => <article className="flex min-w-[126px] items-center gap-2 rounded-[15px] border border-[#d9e9f4] bg-[#f8fcff] px-2.5 py-2" key={record.id}><ThemeIcon className="h-8 w-8 rounded-full" size={15} theme={record.theme} /><span><strong className="block text-[10px] font-extrabold">{record.title}</strong><small className="mt-0.5 block text-[8px] font-semibold text-[#63aedd]">{record.date}</small></span></article>)}
          </div>
        </section>
      </section>
    </main>
  );
}

function MapControl({ label, children }: { label: string; children: ReactNode }) {
  return <button className="grid h-10 w-10 place-items-center rounded-[14px] border border-[#dce5ed] bg-white text-[#4aa9e8] shadow-[0_4px_12px_rgba(56,89,113,0.12)]" aria-label={label} type="button">{children}</button>;
}

function ArchivePin({ record }: { record: ArchiveRecord }) {
  const theme = getThemeConfig(record.theme);
  const colors = pinColors[record.theme] ?? { main: "#5bb5f8", soft: "#e8f6ff" };
  const Icon = theme.icon;
  return (
    <div className="absolute z-[5] -translate-x-1/2 -translate-y-1/2" style={{ left: record.left, top: record.top }}>
      <span className="relative mx-auto block h-[52px] w-[46px] drop-shadow-[0_6px_6px_rgba(57,85,107,0.22)]">
        <MapPin className="absolute inset-0" fill={colors.main} size={46} stroke="white" strokeWidth={1.5} />
      </span>
      <div className="relative z-10 -mt-0.5 min-w-[78px] rounded-full border border-[#d9e4ec] bg-white px-2.5 py-1.5 text-center shadow-[0_4px_10px_rgba(47,80,104,0.12)]"><strong className="flex items-center justify-center gap-1 text-[9px] font-extrabold"><span className="grid h-4 w-4 place-items-center rounded-full" style={{ backgroundColor: colors.soft, color: colors.main }}><Icon size={9} strokeWidth={2.4} /></span>{record.title}</strong><small className="mt-0.5 block whitespace-nowrap text-[7px] text-[#93a0ad]">{record.date} · +{record.points}P</small></div>
    </div>
  );
}

import { useState } from "react";
import { ArrowLeft, MapPin, Sparkles } from "lucide-react";
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
  { id: "gyeongbokgung", title: "경복궁", date: "07.05", points: 150, theme: "history", left: "24%", top: "23%" },
  { id: "bukchon", title: "북촌", date: "07.06", points: 200, theme: "culture", left: "43%", top: "18%" },
  { id: "insadong", title: "인사동", date: "07.08", points: 120, theme: "cafe", left: "37%", top: "32%" },
];

export default function ArchivePage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("전체");
  const [selectedRecord, setSelectedRecord] = useState(records[2].id);

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

      <section className="relative min-h-0 flex-1 overflow-hidden bg-[#dff4fb]" aria-label="방문 기록 대한민국 전체 일러스트 지도">
        <IllustratedMap />

        <div className="absolute right-[14px] top-[14px] z-10 flex items-center gap-1.5 rounded-full border border-white/80 bg-white/90 px-3 py-2 text-[9px] font-extrabold text-[#5f8b7b] shadow-[0_5px_16px_rgba(63,104,88,0.12)] backdrop-blur-md">
          <Sparkles size={12} className="text-[#f2aa42]" fill="#ffd982" />
          나만의 여행 지도
        </div>

        {records.map((record) => <ArchivePin key={record.id} record={record} selected={selectedRecord === record.id} onSelect={() => setSelectedRecord(record.id)} />)}

        <aside className="absolute bottom-[92px] left-[14px] rounded-[18px] border border-white/80 bg-white/92 px-3.5 py-3 shadow-[0_8px_24px_rgba(48,88,78,0.13)] backdrop-blur-md">
          <strong className="block text-[10.5px] font-extrabold">내 여행 발자국</strong>
          <p className="mt-1 text-[9px] text-[#91a0af]">완료 <b className="text-[#38c890]">{records.length}개</b><i className="mx-1.5 not-italic text-[#c7d0d8]">·</i>총 <b className="text-[#3ca9ec]">{records.reduce((sum, record) => sum + record.points, 0)}P</b></p>
        </aside>

        <section className="absolute inset-x-0 bottom-0 bg-white px-[14px] pb-[max(14px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-6px_18px_rgba(41,79,112,0.08)]" aria-label="최근 방문 기록">
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {records.map((record) => <button className={`flex min-w-[126px] items-center gap-2 rounded-[15px] border px-2.5 py-2 text-left transition ${selectedRecord === record.id ? "border-[#8ed1bc] bg-[#effaf6] shadow-[0_4px_12px_rgba(61,147,116,0.12)]" : "border-[#d9e9f4] bg-[#f8fcff]"}`} key={record.id} onClick={() => setSelectedRecord(record.id)} type="button"><ThemeIcon className="h-8 w-8 rounded-full" size={15} theme={record.theme} /><span><strong className="block text-[10px] font-extrabold">{record.title}</strong><small className="mt-0.5 block text-[8px] font-semibold text-[#63aedd]">{record.date} · +{record.points}P</small></span></button>)}
          </div>
        </section>
      </section>
    </main>
  );
}

function IllustratedMap() {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 390 620" preserveAspectRatio="xMidYMid slice" role="img" aria-label="대한민국 전역을 표현한 여행 일러스트 지도">
      <defs>
        <linearGradient id="archive-map-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eaf9fd" />
          <stop offset="1" stopColor="#cfeef8" />
        </linearGradient>
        <linearGradient id="archive-map-land" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6f4d8" />
          <stop offset="0.55" stopColor="#e4f1cb" />
          <stop offset="1" stopColor="#c9e6c5" />
        </linearGradient>
        <filter id="archive-map-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#57846f" floodOpacity=".14" />
        </filter>
      </defs>

      <rect width="390" height="620" fill="url(#archive-map-sea)" />

      <g fill="none" stroke="#ffffff" strokeLinecap="round" opacity=".72">
        <path d="M-20 77c55-30 107-28 151 1" strokeWidth="2" />
        <path d="M286 91c46-19 91-15 129 11" strokeWidth="2" />
        <path d="M-17 495c50-21 89-18 122 8" strokeWidth="3" />
        <path d="M309 468c34-14 67-11 102 10" strokeWidth="2" />
      </g>

      <g filter="url(#archive-map-shadow)">
        <path d="M130 42c18-13 45-18 72-13 31 5 58 24 78 54 16 23 24 53 31 86 7 31 17 59 33 88 15 28 13 58-2 84-13 23-29 44-38 70-8 24-25 38-49 43-24 5-39 18-48 41-7 18-22 28-43 25-20-2-34-14-40-34-6-21-18-36-34-49-17-14-24-34-19-55 5-24 4-44-8-64-14-23-13-47 3-69 14-20 20-43 17-69-4-33 6-58 28-76 20-17 27-39 19-72Z" fill="url(#archive-map-land)" stroke="#acd6bc" strokeWidth="4" />
        <path d="M141 539c18-10 49-11 70-2 12 5 13 16 2 23-19 12-56 13-76 2-12-6-10-16 4-23Z" fill="#dcebc3" stroke="#acd6bc" strokeWidth="3" />
        <circle cx="108" cy="469" r="6" fill="#dcebc3" stroke="#acd6bc" strokeWidth="2" />
        <circle cx="88" cy="483" r="4" fill="#dcebc3" stroke="#acd6bc" strokeWidth="2" />
        <circle cx="322" cy="431" r="5" fill="#dcebc3" stroke="#acd6bc" strokeWidth="2" />
      </g>

      <g fill="none" stroke="#b5d4b6" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 5" opacity=".95">
        <path d="M117 151c38 21 80 20 126 0 27-12 49-12 68-4" />
        <path d="M87 239c43-14 82-9 118 14 37 24 78 26 122 8" />
        <path d="M76 338c43-17 86-13 128 13 42 26 82 27 120 7" />
        <path d="M135 83c25 36 30 77 17 123-10 36-5 77 15 121 17 36 17 79 1 129" />
        <path d="M247 73c-18 41-21 81-8 121 14 41 14 80 1 118-13 39-8 78 15 117" />
      </g>

      <g fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" opacity=".82">
        <path d="M113 126c35 48 79 97 132 148 39 38 53 85 41 141" />
        <path d="M92 292c59 1 118 20 177 58" />
      </g>
      <g fill="none" stroke="#f3c66e" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 7">
        <path d="M113 126c35 48 79 97 132 148 39 38 53 85 41 141" />
        <path d="M92 292c59 1 118 20 177 58" />
      </g>

      <g fontFamily="Pretendard Variable, sans-serif" fontSize="10" fontWeight="800" textAnchor="middle">
        <g fill="#6d927c">
          <text x="205" y="108">강원</text>
          <text x="130" y="213">경기</text>
          <text x="161" y="302">충청</text>
          <text x="126" y="391">전라</text>
          <text x="267" y="355">경상</text>
          <text x="176" y="555">제주</text>
        </g>
        <text x="51" y="305" fill="#69afd0" fontSize="9">서해</text>
        <text x="352" y="284" fill="#69afd0" fontSize="9">동해</text>
        <text x="326" y="447" fill="#69afd0" fontSize="8">독도</text>
      </g>

      <g aria-hidden="true">
        <g transform="translate(288 393)">
          <path d="M0 16h35" stroke="#e5b867" strokeWidth="3" strokeLinecap="round" />
          <path d="m7 16 11-12 11 12Z" fill="#f29a77" />
          <rect x="12" y="16" width="12" height="15" rx="2" fill="#fff8dd" stroke="#d7b87b" />
        </g>
        <g transform="translate(96 400)" fill="#7cc69a">
          <circle cx="10" cy="10" r="10" /><circle cx="24" cy="8" r="8" /><rect x="8" y="15" width="18" height="4" rx="2" fill="#9c7a55" />
        </g>
        <g fill="#ffffff" opacity=".9">
          <circle cx="38" cy="112" r="3" /><circle cx="344" cy="132" r="4" /><circle cx="45" cy="423" r="4" /><circle cx="353" cy="520" r="3" />
        </g>
      </g>
    </svg>
  );
}

function ArchivePin({ record, selected, onSelect }: { record: ArchiveRecord; selected: boolean; onSelect: () => void }) {
  const theme = getThemeConfig(record.theme);
  const colors = pinColors[record.theme] ?? { main: "#5bb5f8", soft: "#e8f6ff" };
  const Icon = theme.icon;
  return (
    <button className={`absolute z-[5] -translate-x-1/2 -translate-y-1/2 transition duration-300 ${selected ? "scale-110" : "hover:scale-105"}`} style={{ left: record.left, top: record.top }} onClick={onSelect} type="button" aria-label={`${record.title}, ${record.date}, ${record.points}포인트`}>
      <span className={`relative mx-auto block h-[52px] w-[46px] drop-shadow-[0_6px_6px_rgba(57,85,107,0.22)] ${selected ? "animate-[bounce_1.5s_ease-in-out_infinite]" : ""}`}>
        <MapPin className="absolute inset-0" fill={colors.main} size={46} stroke="white" strokeWidth={1.5} />
      </span>
      <span className={`relative z-10 -mt-0.5 block min-w-[78px] rounded-full border bg-white px-2.5 py-1.5 text-center shadow-[0_4px_10px_rgba(47,80,104,0.12)] ${selected ? "border-[#8bcdb8] ring-4 ring-white/55" : "border-[#d9e4ec]"}`}><strong className="flex items-center justify-center gap-1 text-[9px] font-extrabold"><span className="grid h-4 w-4 place-items-center rounded-full" style={{ backgroundColor: colors.soft, color: colors.main }}><Icon size={9} strokeWidth={2.4} /></span>{record.title}</strong><small className="mt-0.5 block whitespace-nowrap text-[7px] text-[#93a0ad]">{record.date} · +{record.points}P</small></span>
    </button>
  );
}

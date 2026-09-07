import { useState } from "react";
import { ArrowLeft, Heart, MapPin, Play, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ThemeIcon, { getThemeConfig, type ThemeKey } from "@/components/common/ThemeIcon";
import { PATH } from "@/routes/paths";

type TabKey = "mission" | "place" | "course";
type FavoriteItem = {
  id: string;
  title: string;
  theme: ThemeKey;
  location: string;
  distance?: string;
  rating?: number;
  points?: number;
  completed?: boolean;
  stops?: number;
};

const tabs: Array<{ id: TabKey; label: string }> = [
  { id: "mission", label: "미션" },
  { id: "place", label: "장소" },
  { id: "course", label: "코스" },
];

const UNLIKED_STORAGE_KEY = "quespot-pending-unlikes";

const initialFavorites: Record<TabKey, FavoriteItem[]> = {
  mission: [
    { id: "palace-photo", title: "경복궁 정문 인증샷", theme: "history", location: "경복궁", distance: "1.2km", completed: true },
    { id: "hanok-experience", title: "북촌 한옥 골목 탐험", theme: "culture", location: "북촌 한옥마을", distance: "2.1km", completed: true },
    { id: "tea-house", title: "인사동 전통찻집 방문", theme: "cafe", location: "인사동", distance: "2.5km", points: 120 },
    { id: "namsan-night", title: "남산타워 야경 포착", theme: "night", location: "남산서울타워", distance: "4.8km", points: 300 },
  ],
  place: [
    { id: "tea-cafe", title: "전통 찻집 다향", theme: "cafe", location: "카페", distance: "50m", rating: 4.9 },
    { id: "insadong-art", title: "인사아트센터", theme: "culture", location: "문화", distance: "100m", rating: 4.6 },
    { id: "bibimbap", title: "인사동 전통 비빔밥", theme: "food", location: "음식", distance: "80m", rating: 4.8 },
  ],
  course: [
    { id: "seoul-history", title: "서울 역사 탐방 코스", theme: "history", location: "서울 종로구", stops: 5, points: 820 },
    { id: "bukhan-nature", title: "북한산 자연 힐링 코스", theme: "nature", location: "서울 강북구", stops: 3, points: 500 },
  ],
};

function readUnlikedIds(): string[] {
  try { return JSON.parse(localStorage.getItem(UNLIKED_STORAGE_KEY) ?? "[]") as string[]; }
  catch { return []; }
}

function readFavorites(): Record<TabKey, FavoriteItem[]> {
  const unlikedIds = new Set(readUnlikedIds());
  return {
    mission: initialFavorites.mission.filter((item) => !unlikedIds.has(item.id)),
    place: initialFavorites.place.filter((item) => !unlikedIds.has(item.id)),
    course: initialFavorites.course.filter((item) => !unlikedIds.has(item.id)),
  };
}

export default function LikesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>("mission");
  const [favorites] = useState(readFavorites);
  const [pendingUnlikes, setPendingUnlikes] = useState<Set<string>>(new Set());
  const items = favorites[activeTab];

  const toggleFavorite = (id: string) => {
    setPendingUnlikes((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      const persisted = new Set(readUnlikedIds());
      if (next.has(id)) persisted.add(id);
      else persisted.delete(id);
      localStorage.setItem(UNLIKED_STORAGE_KEY, JSON.stringify([...persisted]));
      return next;
    });
  };

  return (
    <main className="flex min-h-dvh flex-col bg-[#f2f7ff] text-[#18213b]">
      <header className="sticky top-0 z-20 bg-white">
        <div className="flex h-[76px] items-end border-b border-[#edf1f5] px-[18px] pb-[13px]">
          <button className="grid h-9 w-9 place-items-center rounded-full bg-[#eaf6ff] text-[#4faae7] transition active:scale-95" aria-label="마이페이지로 돌아가기" onClick={() => navigate(PATH.MY)} type="button"><ArrowLeft size={18} strokeWidth={2.2} /></button>
          <h1 className="ml-3 flex-1 self-center pt-[21px] text-[16px] font-extrabold">좋아요 목록</h1>
        </div>
        <nav className="grid h-[48px] grid-cols-3 border-b border-[#eaf0f5]" aria-label="좋아요 유형">
          {tabs.map((tab) => <button className={`relative text-[12px] font-extrabold transition ${activeTab === tab.id ? "text-[#43a7e9]" : "text-[#9aa9b9]"}`} key={tab.id} onClick={() => setActiveTab(tab.id)} type="button">{tab.label}<span className={`absolute inset-x-0 bottom-0 mx-auto h-0.5 bg-[#4eb0ef] transition-all ${activeTab === tab.id ? "w-full" : "w-0"}`} /></button>)}
        </nav>
      </header>

      <section className="grid gap-3 px-[18px] pb-9 pt-4" aria-live="polite">
        {items.length === 0 ? <EmptyState /> : activeTab === "course"
          ? items.map((item) => <CourseCard item={item} key={item.id} liked={!pendingUnlikes.has(item.id)} onToggle={() => toggleFavorite(item.id)} />)
          : items.map((item) => <CompactCard item={item} key={item.id} liked={!pendingUnlikes.has(item.id)} onToggle={() => toggleFavorite(item.id)} />)}
      </section>
    </main>
  );
}

function CompactCard({ item, liked, onToggle }: { item: FavoriteItem; liked: boolean; onToggle: () => void }) {
  const theme = getThemeConfig(item.theme);
  return (
    <article className="flex min-h-[88px] items-center gap-3 rounded-[18px] border border-[#dbe6f0] bg-white p-3 shadow-[0_3px_10px_rgba(41,79,112,0.08)]">
      <ThemeIcon className="h-[54px] w-[54px] rounded-[16px]" size={25} theme={item.theme} />
      <div className="min-w-0 flex-1">
        <span className={`inline-flex rounded-full px-2 py-0.5 text-[8.5px] font-extrabold ${theme.tone}`}>{theme.label}</span>
        <h2 className="mt-1 truncate text-[13px] font-extrabold">{item.title}</h2>
        <p className="mt-1 flex items-center gap-1.5 text-[9.5px] text-[#93a0af]"><span>{item.location}</span>{item.distance ? <><i className="h-0.5 w-0.5 rounded-full bg-[#bdc8d2]" />{item.distance}</> : null}{item.rating ? <><Star size={10} fill="#f5b51b" strokeWidth={0} /><strong className="text-[#59677a]">{item.rating}</strong></> : null}</p>
        {item.completed ? <p className="mt-1 text-[9px] font-bold text-[#42bd8e]">✓ 완료</p> : item.points ? <p className="mt-1 text-[9px] font-extrabold text-[#38a6eb]">+{item.points}P</p> : null}
      </div>
      <button className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition active:scale-90 ${liked ? "text-[#f14b59]" : "text-[#aeb9c5]"}`} aria-label={`${item.title} ${liked ? "좋아요 해제" : "다시 좋아요"}`} aria-pressed={liked} onClick={onToggle} type="button"><Heart size={19} fill={liked ? "currentColor" : "none"} strokeWidth={liked ? 0 : 2} /></button>
    </article>
  );
}

function CourseCard({ item, liked, onToggle }: { item: FavoriteItem; liked: boolean; onToggle: () => void }) {
  return (
    <article className="overflow-hidden rounded-[20px] border border-[#dbe6f0] bg-white shadow-[0_3px_10px_rgba(41,79,112,0.08)]">
      <div className="grid h-[105px] place-items-center bg-[linear-gradient(135deg,#dff2ff,#cae9ff)]"><ThemeIcon className="h-[66px] w-[66px] rounded-[22px] bg-white/70 shadow-sm" size={33} theme={item.theme} /></div>
      <div className="p-[14px]">
        <div className="flex items-start gap-2"><div className="min-w-0 flex-1"><h2 className="truncate text-[14px] font-extrabold">{item.title}</h2><p className="mt-1 text-[9.5px] text-[#929eac]">{item.location}</p></div><button className={`grid h-8 w-8 place-items-center ${liked ? "text-[#f46470]" : "text-[#aeb9c5]"}`} aria-label={`${item.title} ${liked ? "좋아요 해제" : "다시 좋아요"}`} aria-pressed={liked} onClick={onToggle} type="button"><Heart size={19} fill={liked ? "currentColor" : "none"} strokeWidth={liked ? 0 : 2} /></button></div>
        <p className="mt-2 flex items-center gap-2 text-[9px] font-bold text-[#718094]"><span className="flex items-center gap-1"><MapPin size={11} className="text-[#f15d67]" />{item.stops}곳</span><span className="text-[#35a5ea]">+{item.points}P</span></p>
        <button className="mt-3 flex h-10 w-full items-center justify-center gap-1.5 rounded-[13px] bg-[linear-gradient(135deg,#58b5ef,#319ce3)] text-[11px] font-extrabold text-white shadow-[0_5px_12px_rgba(53,159,228,0.2)]" type="button"><Play size={12} fill="currentColor" />코스 시작하기</button>
      </div>
    </article>
  );
}

function EmptyState() {
  return <div className="grid min-h-[280px] place-items-center text-center"><div><ThemeIcon className="mx-auto h-16 w-16 rounded-[22px]" size={28} theme="unknown" /><h2 className="mt-4 text-[14px] font-extrabold">좋아요한 항목이 없어요</h2><p className="mt-1.5 text-[10px] text-[#95a3b2]">마음에 드는 여행을 저장해보세요.</p></div></div>;
}

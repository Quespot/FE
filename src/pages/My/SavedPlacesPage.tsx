import { useMemo, useState } from "react";
import { ArrowLeft, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ThemeIcon, { type ThemeKey } from "@/components/common/ThemeIcon";
import { PATH } from "@/routes/paths";

type PlaceFilter = "all" | "food" | "cafe" | "attraction" | "culture";
type SavedPlace = {
  id: string;
  title: string;
  region: string;
  filter: Exclude<PlaceFilter, "all">;
  theme: ThemeKey;
};

const filters: Array<{ id: PlaceFilter; label: string }> = [
  { id: "all", label: "전체" },
  { id: "food", label: "음식점" },
  { id: "cafe", label: "카페" },
  { id: "attraction", label: "관광지" },
  { id: "culture", label: "문화" },
];

const savedPlaces: SavedPlace[] = [
  { id: "insadong-bibimbap", title: "인사동 전통 비빔밥", region: "서울 종로구", filter: "food", theme: "food" },
  { id: "dahyang", title: "전통 찻집 다향", region: "서울 종로구", filter: "cafe", theme: "cafe" },
  { id: "gyeongbokgung", title: "경복궁 돌담길", region: "서울 종로구", filter: "attraction", theme: "history" },
  { id: "insa-art", title: "인사아트센터", region: "서울 종로구", filter: "culture", theme: "culture" },
];

export default function SavedPlacesPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<PlaceFilter>("all");
  const [bookmarked, setBookmarked] = useState<Set<string>>(() => new Set(savedPlaces.map((place) => place.id)));
  const visiblePlaces = useMemo(() => activeFilter === "all" ? savedPlaces : savedPlaces.filter((place) => place.filter === activeFilter), [activeFilter]);

  const toggleBookmark = (id: string) => {
    setBookmarked((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <main className="flex min-h-dvh flex-col bg-[#f2f7ff] text-[#18213b]">
      <header className="sticky top-0 z-20 bg-white">
        <div className="flex h-[76px] items-end border-b border-[#edf1f5] px-[18px] pb-[13px]">
          <button className="grid h-9 w-9 place-items-center rounded-full bg-[#eaf6ff] text-[#4faae7] transition active:scale-95" aria-label="마이페이지로 돌아가기" onClick={() => navigate(PATH.MY)} type="button"><ArrowLeft size={18} strokeWidth={2.2} /></button>
          <h1 className="ml-3 self-center pt-[21px] text-[16px] font-extrabold">저장한 장소</h1>
        </div>
        <nav className="flex items-center gap-2 border-b border-[#eaf0f5] px-[18px] py-[16px]" aria-label="장소 카테고리">
          {filters.map((filter) => {
            const selected = activeFilter === filter.id;
            return <button aria-pressed={selected} className="h-9 shrink-0 rounded-full px-[18px] text-[11px] font-extrabold transition-colors active:scale-95" key={filter.id} onClick={() => setActiveFilter(filter.id)} style={{ backgroundColor: selected ? "#5bb5f8" : "#e5f1fb", color: selected ? "#ffffff" : "#98a6b3" }} type="button">{filter.label}</button>;
          })}
        </nav>
      </header>

      <section className="grid gap-[10px] px-[18px] pb-9 pt-4" aria-live="polite">
        {visiblePlaces.map((place) => {
          const isBookmarked = bookmarked.has(place.id);
          return (
            <article className="flex min-h-[82px] items-center gap-3 rounded-[18px] border border-[#dbe6f0] bg-white p-3 shadow-[0_3px_10px_rgba(41,79,112,0.08)]" key={place.id}>
              <ThemeIcon className="h-[52px] w-[52px] rounded-[16px]" size={24} theme={place.theme} />
              <div className="min-w-0 flex-1"><h2 className="truncate text-[13px] font-extrabold">{place.title}</h2><p className="mt-1.5 text-[9.5px] text-[#95a2b0]">{place.region}</p></div>
              <button className={`grid h-10 w-10 shrink-0 place-items-center rounded-full transition active:scale-90 ${isBookmarked ? "text-[#5bb5f8]" : "text-[#aeb9c5]"}`} aria-label={`${place.title} ${isBookmarked ? "스크랩 해제" : "다시 스크랩"}`} aria-pressed={isBookmarked} onClick={() => toggleBookmark(place.id)} type="button"><Bookmark size={20} fill={isBookmarked ? "#5bb5f8" : "none"} stroke={isBookmarked ? "#5bb5f8" : "currentColor"} strokeWidth={isBookmarked ? 1.8 : 2} /></button>
            </article>
          );
        })}
      </section>
    </main>
  );
}

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type WheelEvent as ReactWheelEvent } from "react";
import { AdvancedMarker, APIProvider, Map, useMap } from "@vis.gl/react-google-maps";
import { ArrowLeft, Compass, Image as ImageIcon, MapPin, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { ArchiveCategory, ArchiveFeedItem } from "@/apis/archive";
import MonthPicker from "@/components/archive/MonthPicker";
import ThemeIcon, { getThemeConfig, type ThemeKey } from "@/components/common/ThemeIcon";
import { categoryIcons, categoryToneClasses } from "@/components/home/CategoryGrid";
import { homeCategories } from "@/data/quespot";
import { useArchiveMap, useArchivePhotos } from "@/hooks/queries/useArchive";
import { PATH } from "@/routes/paths";

type ArchiveRecord = {
  id: string;
  title: string;
  caption: string;
  date: string;
  points: number;
  theme: ThemeKey;
  categoryId: string;
  position: { lat: number; lng: number };
  spotName: string;
  photoUrl: string | null;
};

const archiveCategories = [{ id: "all", label: "전체", tone: "blue" }, ...homeCategories];
const KOREA_CENTER = { lat: 36.35, lng: 127.85 };
const CATEGORY_API: Record<string, ArchiveCategory> = {
  history: "HISTORY", culture: "CULTURE", nature: "NATURE", food: "FOOD", night: "NIGHT_VIEW", etc: "ETC",
};
const CATEGORY_ID: Record<ArchiveCategory, string> = {
  HISTORY: "history", CULTURE: "culture", NATURE: "nature", FOOD: "food", NIGHT_VIEW: "night", ETC: "etc",
};
const categoryColors: Record<string, { main: string; soft: string }> = {
  history: { main: "#8b5cf6", soft: "#eee1ff" }, culture: { main: "#ec4899", soft: "#ffe1f0" },
  nature: { main: "#16a34a", soft: "#e1faef" }, food: { main: "#d97706", soft: "#fff1c9" },
  night: { main: "#2577ff", soft: "#dcecff" }, etc: { main: "#0891b2", soft: "#cff9fb" },
};
const now = new Date();
const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

function formatArchiveDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(5, 10).replace("-", ".");
  return `${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

export default function ArchivePage() {
  const navigate = useNavigate();
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const [activeFilter, setActiveFilter] = useState("all");
  const [yearMonth, setYearMonth] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<"info" | "photo">("info");
  const filterDragRef = useRef<{ pointerId: number; startX: number; scrollLeft: number; moved: boolean } | null>(null);
  const suppressFilterClickRef = useRef(false);
  const category = activeFilter === "all" ? undefined : CATEGORY_API[activeFilter];
  const mapQuery = useArchiveMap({ yearMonth: yearMonth || undefined, category });
  const photosQuery = useArchivePhotos();

  const records = useMemo(() => {
    const photosByMissionId = new globalThis.Map<number, ArchiveFeedItem>();
    for (const photo of photosQuery.data ?? []) {
      if (photo.source === "MISSION" && photo.missionId != null && !photosByMissionId.has(photo.missionId)) {
        photosByMissionId.set(photo.missionId, photo);
      }
    }

    return (mapQuery.data?.completedMissions ?? []).map<ArchiveRecord>((mission) => {
      const photo = photosByMissionId.get(mission.missionId);
      const categoryId = photo?.missionCategory ? CATEGORY_ID[photo.missionCategory] : category ? CATEGORY_ID[category] : "etc";
      return {
        id: String(mission.missionId),
        title: photo?.missionTitle || `${mission.spotName} 미션`,
        caption: photo?.caption || `${mission.spotName}에서 완료한 미션이에요.`,
        date: formatArchiveDate(mission.completedAt),
        points: mission.earnedPoint,
        theme: categoryId as ThemeKey,
        categoryId,
        position: { lat: mission.latitude, lng: mission.longitude },
        spotName: mission.spotName,
        photoUrl: photo?.imageUrl || null,
      };
    });
  }, [category, mapQuery.data?.completedMissions, photosQuery.data]);

  const activeRecord = records.find((record) => record.id === selectedRecord);
  const resetSelection = () => setSelectedRecord(null);
  const selectRecord = (recordId: string) => { setSelectedRecord(recordId); setDetailTab("info"); };
  const handleFilterPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    filterDragRef.current = { pointerId: event.pointerId, startX: event.clientX, scrollLeft: event.currentTarget.scrollLeft, moved: false };
  };
  const handleFilterPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const drag = filterDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const distance = event.clientX - drag.startX;
    if (Math.abs(distance) > 4) drag.moved = true;
    event.currentTarget.scrollLeft = drag.scrollLeft - distance;
  };
  const handleFilterPointerEnd = (event: ReactPointerEvent<HTMLElement>) => {
    const drag = filterDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    suppressFilterClickRef.current = drag.moved;
    window.setTimeout(() => { suppressFilterClickRef.current = false; }, 0);
    filterDragRef.current = null;
  };

  return (
    <main className="flex min-h-dvh flex-col overflow-hidden bg-[#eef7ff] text-[#18213b]">
      <header className="relative z-20 bg-white">
        <div className="flex h-[76px] items-end border-b border-[#edf1f5] px-[18px] pb-[13px]">
          <button className="grid h-9 w-9 place-items-center rounded-full bg-[#eaf6ff] text-[#4faae7] transition active:scale-95" aria-label="마이페이지로 돌아가기" onClick={() => navigate(PATH.MY)} type="button"><ArrowLeft size={18} strokeWidth={2.2} /></button>
          <h1 className="ml-3 self-center pt-[21px] text-[16px] font-extrabold">나의 여행 아카이브</h1>
        </div>
        <nav className="no-scrollbar flex cursor-grab touch-none select-none items-center gap-2 overflow-x-auto overscroll-x-contain border-b border-[#eaf0f5] px-[18px] py-[12px] active:cursor-grabbing" aria-label="아카이브 카테고리" onPointerDown={handleFilterPointerDown} onPointerMove={handleFilterPointerMove} onPointerUp={handleFilterPointerEnd} onPointerCancel={handleFilterPointerEnd} onPointerLeave={handleFilterPointerEnd} onWheel={(event: ReactWheelEvent<HTMLElement>) => { event.currentTarget.scrollLeft += event.deltaX || event.deltaY; }}>
          {archiveCategories.map((filter) => {
            const selected = activeFilter === filter.id;
            const Icon = filter.id === "all" ? Compass : categoryIcons[filter.id] ?? Compass;
            const toneClass = categoryToneClasses[filter.tone] ?? categoryToneClasses.blue;
            return <button className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[10px] font-extrabold transition ${selected ? `${toneClass} border-current shadow-[0_3px_9px_rgba(55,95,125,.12)] ring-2 ring-white` : "border-[#e0eaf2] bg-[#f4f8fb] text-[#8d9daa]"}`} key={filter.id} onClick={() => { if (suppressFilterClickRef.current) { suppressFilterClickRef.current = false; return; } setActiveFilter(filter.id); resetSelection(); }} type="button"><Icon size={13} strokeWidth={2.4} />{filter.label}</button>;
          })}
        </nav>
        <div className="flex items-center border-b border-[#eaf0f5] px-[18px] py-2.5">
          <MonthPicker max={currentYearMonth} onChange={(value) => { setYearMonth(value); resetSelection(); }} value={yearMonth} />
        </div>
      </header>

      <section className="relative min-h-0 flex-1 overflow-hidden bg-[#e8f1f7]" aria-label="방문 기록 실제 지도">
        <div className="absolute inset-x-0 bottom-[76px] top-0">
          {apiKey ? (
            <APIProvider apiKey={apiKey} language="ko" region="KR">
              <Map className="h-full w-full" defaultCenter={KOREA_CENTER} defaultZoom={7} mapId="quespot-map" disableDefaultUI zoomControl clickableIcons={false} gestureHandling="greedy" reuseMaps>
                <ArchiveMapBounds records={records} />
                {records.map((record) => <AdvancedMarker key={record.id} position={record.position} onClick={() => selectRecord(record.id)} zIndex={selectedRecord === record.id ? 999 : 10} title={`${record.spotName} 상세 보기`}><ArchiveMapMarker record={record} selected={selectedRecord === record.id} /></AdvancedMarker>)}
              </Map>
            </APIProvider>
          ) : <MapApiKeyFallback />}
          {activeRecord ? <SelectedRecordCard activeTab={detailTab} record={activeRecord} photoError={photosQuery.isError} photoLoading={photosQuery.isLoading} onChangeTab={setDetailTab} onClose={resetSelection} /> : <ArchiveSummary count={mapQuery.data?.footprint.completedMissionCount ?? 0} error={mapQuery.isError} loading={mapQuery.isLoading} points={mapQuery.data?.footprint.totalEarnedPoint ?? 0} onRetry={() => void mapQuery.refetch()} />}
        </div>

        <section className="absolute inset-x-0 bottom-0 bg-white px-[14px] pb-[max(14px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-6px_18px_rgba(41,79,112,0.08)]" aria-label="최근 방문 기록">
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {records.map((record) => <button className={`flex min-w-[126px] items-center gap-2 rounded-[15px] border px-2.5 py-2 text-left transition ${selectedRecord === record.id ? "border-[#8ed1bc] bg-[#effaf6] shadow-[0_4px_12px_rgba(61,147,116,0.12)]" : "border-[#d9e9f4] bg-[#f8fcff]"}`} key={record.id} onClick={() => selectRecord(record.id)} type="button"><ThemeIcon className="h-8 w-8 rounded-full" size={15} theme={record.theme} /><span><strong className="block max-w-[82px] truncate text-[10px] font-extrabold">{record.spotName}</strong><small className="mt-0.5 block text-[8px] font-semibold text-[#63aedd]">{record.date} · +{record.points}P</small></span></button>)}
            {mapQuery.isLoading ? <p className="w-full py-2 text-center text-[10px] font-bold text-[#96a5b2]">방문 기록을 불러오는 중이에요.</p> : null}
            {!mapQuery.isLoading && !mapQuery.isError && records.length === 0 ? <p className="w-full py-2 text-center text-[10px] font-bold text-[#96a5b2]">선택한 조건의 방문 기록이 없어요.</p> : null}
          </div>
        </section>
      </section>
    </main>
  );
}

function ArchiveMapBounds({ records }: { records: ArchiveRecord[] }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    if (records.length === 0) { map.setCenter(KOREA_CENTER); map.setZoom(7); return; }
    if (records.length === 1) { map.setCenter(records[0].position); map.setZoom(15); return; }
    const bounds = records.reduce(
      (current, record) => ({
        north: Math.max(current.north, record.position.lat),
        south: Math.min(current.south, record.position.lat),
        east: Math.max(current.east, record.position.lng),
        west: Math.min(current.west, record.position.lng),
      }),
      { north: -90, south: 90, east: -180, west: 180 },
    );
    map.fitBounds(bounds, { top: 72, right: 46, bottom: 72, left: 46 });
  }, [map, records]);
  return null;
}

function ArchiveMapMarker({ record, selected }: { record: ArchiveRecord; selected: boolean }) {
  const colors = categoryColors[record.categoryId] ?? categoryColors.etc;
  const Icon = getThemeConfig(record.theme).icon;
  return <div className={`group relative grid h-[54px] w-[54px] cursor-pointer place-items-center transition duration-200 ${selected ? "scale-110" : "hover:scale-105"}`} aria-hidden="true"><span className={`absolute inset-[3px] rounded-[18px] border-[3px] border-white shadow-[0_7px_16px_rgba(30,67,98,0.3)] ${selected ? "ring-[5px] ring-white/75" : ""}`} style={{ background: `linear-gradient(145deg, #ffffff 0%, ${colors.soft} 65%)` }} /><span className="absolute bottom-0 left-1/2 h-[14px] w-[14px] -translate-x-1/2 rotate-45 rounded-[3px] border-b-[3px] border-r-[3px] border-white shadow-[3px_3px_5px_rgba(30,67,98,0.12)]" style={{ backgroundColor: colors.soft }} /><span className="relative grid h-[32px] w-[32px] place-items-center rounded-[12px] text-white shadow-[inset_0_1px_0_rgba(255,255,255,.35)]" style={{ backgroundColor: colors.main }}><Icon size={17} strokeWidth={2.5} /></span><span className="absolute -right-0.5 -top-0.5 rounded-full border-2 border-white bg-[#50afea] px-1.5 py-0.5 text-[7px] font-black tracking-[-0.04em] text-white shadow-sm">Q</span></div>;
}

function ArchiveSummary({ count, points, loading, error, onRetry }: { count: number; points: number; loading: boolean; error: boolean; onRetry: () => void }) {
  return <aside className="absolute left-[14px] top-[14px] z-10 rounded-[17px] border border-white/80 bg-white/95 px-3.5 py-3 shadow-[0_7px_20px_rgba(47,80,104,0.15)] backdrop-blur-md"><strong className="block text-[10.5px] font-extrabold">내 여행 발자국</strong>{loading ? <p className="mt-1 text-[9px] font-bold text-[#91a0af]">현황을 불러오는 중이에요.</p> : error ? <button className="mt-1 text-[9px] font-extrabold text-[#e07070]" onClick={onRetry} type="button">불러오지 못했어요 · 다시 시도</button> : <p className="mt-1 text-[9px] text-[#91a0af]">완료 <b className="text-[#38c890]">{count}개</b><i className="mx-1.5 not-italic text-[#c7d0d8]">·</i>총 <b className="text-[#3ca9ec]">{points}P</b></p>}</aside>;
}

function SelectedRecordCard({ activeTab, record, photoLoading, photoError, onChangeTab, onClose }: { activeTab: "info" | "photo"; record: ArchiveRecord; photoLoading: boolean; photoError: boolean; onChangeTab: (tab: "info" | "photo") => void; onClose: () => void }) {
  const colors = categoryColors[record.categoryId] ?? categoryColors.etc;
  return <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center bg-[#17314f]/10 px-5 backdrop-blur-[1px]"><aside className="pointer-events-auto w-full max-w-[330px] overflow-hidden rounded-[26px] border border-white/90 bg-white shadow-[0_18px_50px_rgba(30,59,86,0.25)]" aria-live="polite">
    <div className="relative flex items-center gap-3 px-5 pb-4 pt-5"><ThemeIcon className="h-12 w-12 shrink-0 rounded-[16px]" size={22} theme={record.theme} /><span className="min-w-0 pr-8"><strong className="block truncate text-[16px] font-black">{record.spotName}</strong><small className="mt-1 block truncate text-[10px] font-bold" style={{ color: colors.main }}>{record.title}</small></span><button className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-[#f0f5f8] text-[#8d9ba7] transition hover:bg-[#e5eef4]" onClick={onClose} type="button" aria-label="장소 상세 닫기"><X size={16} strokeWidth={2.4} /></button></div>
    <div className="mx-5 flex rounded-[14px] bg-[#edf5fa] p-1.5" role="tablist" aria-label="방문 기록 상세"><button className={`h-9 flex-1 rounded-[10px] text-[11px] font-extrabold transition ${activeTab === "info" ? "bg-white text-[#329fe8] shadow-sm" : "text-[#94a3af]"}`} onClick={() => onChangeTab("info")} role="tab" aria-selected={activeTab === "info"} type="button">정보</button><button className={`flex h-9 flex-1 items-center justify-center gap-1.5 rounded-[10px] text-[11px] font-extrabold transition ${activeTab === "photo" ? "bg-white text-[#329fe8] shadow-sm" : "text-[#94a3af]"}`} onClick={() => onChangeTab("photo")} role="tab" aria-selected={activeTab === "photo"} type="button"><ImageIcon size={14} /> 인증 사진</button></div>
    {activeTab === "info" ? <div className="px-5 pb-6 pt-5"><span className="inline-flex rounded-full px-2.5 py-1 text-[9px] font-extrabold" style={{ backgroundColor: colors.soft, color: colors.main }}>미션 완료</span><p className="mt-3 text-[12px] font-semibold leading-5 text-[#657585]">{record.caption}</p><div className="mt-4 flex gap-2"><span className="flex-1 rounded-[13px] bg-[#f4f8fb] px-3 py-2.5"><small className="block text-[9px] font-bold text-[#98a6b2]">완료일</small><b className="mt-1 block text-[12px] text-[#526575]">{record.date}</b></span><span className="flex-1 rounded-[13px] bg-[#f4f8fb] px-3 py-2.5"><small className="block text-[9px] font-bold text-[#98a6b2]">획득 포인트</small><b className="mt-1 block text-[12px]" style={{ color: colors.main }}>+{record.points}P</b></span></div></div> : photoLoading ? <div className="grid min-h-[236px] place-items-center text-[11px] font-bold text-[#8797a5]">인증 사진을 불러오는 중이에요.</div> : record.photoUrl ? <div className="p-5 pt-4"><img className="h-[220px] w-full rounded-[18px] bg-[#edf4f8] object-cover shadow-inner" src={record.photoUrl} alt={`${record.spotName} 미션 인증 사진`} /><p className="mt-3 text-center text-[10px] font-semibold text-[#8293a2]">미션 인증 때 등록한 사진이에요</p></div> : <div className="grid min-h-[236px] place-items-center px-5 pb-6 pt-4 text-center"><div><span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#edf6fc] text-[#8fc9ed]"><ImageIcon size={24} /></span><p className="mt-3 text-[11px] font-bold text-[#8797a5]">{photoError ? "인증 사진을 불러오지 못했어요" : "등록된 인증 사진이 없어요"}</p><small className="mt-1 block text-[9px] text-[#a1aeb8]">{photoError ? "잠시 후 다시 확인해주세요" : "사진 인증 미션을 완료하면 자동으로 표시돼요"}</small></div></div>}
  </aside></div>;
}

function MapApiKeyFallback() {
  return <div className="grid h-full place-items-center bg-[#e9f4f9] px-8 text-center"><div><MapPin className="mx-auto text-[#5bb5f8]" size={34} /><strong className="mt-3 block text-[13px] font-extrabold">지도를 불러올 수 없어요</strong><p className="mt-1 text-[10px] leading-4 text-[#8999a8]">VITE_GOOGLE_MAPS_API_KEY 환경변수를 확인해주세요.</p></div></div>;
}

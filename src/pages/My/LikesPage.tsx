import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, Clock3, Heart, MapPin, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getLikedCourses, getLikedMissions, getLikesErrorMessage,
  type LikedCourse, type LikedMission,
} from "@/apis/likes";
import ThemeIcon, { getThemeConfig, type ThemeKey } from "@/components/common/ThemeIcon";
import { PATH } from "@/routes/paths";

type TabKey = "mission" | "course";

const tabs: Array<{ id: TabKey; label: string }> = [
  { id: "mission", label: "미션" },
  { id: "course", label: "코스" },
];

const courseStatusLabel: Record<string, string> = {
  NOT_STARTED: "시작 전",
  IN_PROGRESS: "진행 중",
  COMPLETED: "완료",
};

const toTheme = (category: string): ThemeKey => category.toLowerCase() as ThemeKey;

export default function LikesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>("mission");
  const missionQuery = useQuery({
    queryKey: ["likes", "missions"],
    queryFn: getLikedMissions,
    retry: false,
  });
  const courseQuery = useQuery({
    queryKey: ["likes", "courses"],
    queryFn: getLikedCourses,
    retry: false,
  });

  const activeQuery = activeTab === "mission" ? missionQuery : courseQuery;
  const totalCount = activeTab === "mission" ? missionQuery.data?.totalCount : courseQuery.data?.totalCount;
  const items = activeQuery.data?.items ?? [];

  return (
    <main className="flex min-h-dvh flex-col bg-[#f2f7ff] text-[#18213b]">
      <header className="sticky top-0 z-20 bg-white">
        <div className="flex h-[76px] items-end border-b border-[#edf1f5] px-[18px] pb-[13px]">
          <button className="grid h-9 w-9 place-items-center rounded-full bg-[#eaf6ff] text-[#4faae7] transition active:scale-95" aria-label="마이페이지로 돌아가기" onClick={() => navigate(PATH.MY)} type="button"><ArrowLeft size={18} strokeWidth={2.2} /></button>
          <h1 className="ml-3 flex-1 self-center pt-[21px] text-[16px] font-extrabold">좋아요 목록</h1>
        </div>
        <nav className="grid h-[48px] grid-cols-2 border-b border-[#eaf0f5]" aria-label="좋아요 유형">
          {tabs.map((tab) => <button className={`relative text-[12px] font-extrabold transition ${activeTab === tab.id ? "text-[#43a7e9]" : "text-[#9aa9b9]"}`} key={tab.id} onClick={() => setActiveTab(tab.id)} type="button">{tab.label}<span className={`absolute inset-x-0 bottom-0 mx-auto h-0.5 bg-[#4eb0ef] transition-all ${activeTab === tab.id ? "w-full" : "w-0"}`} /></button>)}
        </nav>
      </header>

      <section className="grid gap-3 px-[18px] pb-9 pt-4" aria-busy={activeQuery.isLoading} aria-live="polite">
        {!activeQuery.isLoading && !activeQuery.error ? <p className="px-1 text-[9px] font-bold text-[#8da0b2]">총 <strong className="text-[11px] font-black text-[#65798c]">{totalCount ?? items.length}</strong>개</p> : null}
        {activeQuery.isLoading ? <LoadingState /> : activeQuery.error ? <ErrorState message={getLikesErrorMessage(activeQuery.error)} onRetry={() => void activeQuery.refetch()} /> : items.length === 0 ? <EmptyState tab={activeTab} /> : activeTab === "course"
          ? (items as LikedCourse[]).map((item) => <CourseCard item={item} key={item.courseId} />)
          : (items as LikedMission[]).map((item) => <MissionCard item={item} key={item.missionId} onOpen={() => navigate(PATH.MISSION_DETAIL.replace(":missionId", String(item.missionId)))} />)}
      </section>
    </main>
  );
}

function MissionCard({ item, onOpen }: { item: LikedMission; onOpen: () => void }) {
  const themeKey = toTheme(item.category);
  const theme = getThemeConfig(themeKey);
  return (
    <article className="flex min-h-[96px] cursor-pointer items-center gap-3 rounded-[18px] border border-[#dbe6f0] bg-white p-3 shadow-[0_3px_10px_rgba(41,79,112,0.08)] transition active:scale-[0.99]" onClick={onOpen}>
      <ItemImage alt="" fallbackTheme={themeKey} src={item.imageUrl} />
      <div className="min-w-0 flex-1">
        <span className={`inline-flex rounded-full px-2 py-0.5 text-[8.5px] font-extrabold ${theme.tone}`}>{theme.label}</span>
        <h2 className="mt-1 truncate text-[13px] font-extrabold">{item.title}</h2>
        <p className="mt-1 flex items-center gap-2 text-[9px] text-[#93a0af]"><span className="flex min-w-0 items-center gap-1 truncate"><MapPin size={10} className="shrink-0 text-[#f15d67]" />{item.spotName}</span><span className="flex shrink-0 items-center gap-1"><Clock3 size={10} />약 {item.estimatedMinutes}분</span></p>
        <p className="mt-1 text-[9px] font-extrabold text-[#38a6eb]">+{item.rewardPoint.toLocaleString()}P</p>
      </div>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[#f14b59]" aria-label="좋아요한 미션"><Heart size={19} fill="currentColor" strokeWidth={0} /></span>
    </article>
  );
}

function CourseCard({ item }: { item: LikedCourse }) {
  const status = courseStatusLabel[item.myStatus] ?? item.myStatus;
  return (
    <article className="overflow-hidden rounded-[20px] border border-[#dbe6f0] bg-white shadow-[0_3px_10px_rgba(41,79,112,0.08)]">
      <div className="relative h-[122px] overflow-hidden bg-[linear-gradient(135deg,#dff2ff,#cae9ff)]">
        <ItemImage alt="" className="h-full w-full rounded-none" fallbackTheme="course" src={item.coverImageUrl} />
        <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-[#f46470] shadow-sm" aria-label="좋아요한 코스"><Heart size={18} fill="currentColor" strokeWidth={0} /></span>
      </div>
      <div className="p-[14px]">
        <div className="flex items-start gap-2"><div className="min-w-0 flex-1"><h2 className="truncate text-[14px] font-extrabold">{item.name}</h2><p className="mt-1 flex items-center gap-1 text-[9.5px] text-[#929eac]"><MapPin size={10} className="text-[#f15d67]" />{item.regionCode}</p></div><span className={`shrink-0 rounded-full px-2 py-1 text-[8px] font-extrabold ${item.myStatus === "COMPLETED" ? "bg-[#e8f8f2] text-[#36aa81]" : item.myStatus === "IN_PROGRESS" ? "bg-[#e8f5ff] text-[#3ba5e8]" : "bg-[#f1f4f7] text-[#82909d]"}`}>{status}</span></div>
        <p className="mt-2 flex flex-wrap items-center gap-2 text-[9px] font-bold text-[#718094]"><span className="flex items-center gap-1"><MapPin size={11} className="text-[#f15d67]" />미션 {item.missionCount}개</span><span className="flex items-center gap-1"><Clock3 size={11} />약 {item.estimatedMinutes}분</span><span className="text-[#35a5ea]">+{item.totalRewardPoint.toLocaleString()}P</span>{item.bonusPoint > 0 ? <span className="text-[#e99a24]">보너스 +{item.bonusPoint.toLocaleString()}P</span> : null}</p>
        <button className="mt-3 flex h-10 w-full items-center justify-center gap-1.5 rounded-[13px] bg-[linear-gradient(135deg,#58b5ef,#319ce3)] text-[11px] font-extrabold text-white shadow-[0_5px_12px_rgba(53,159,228,0.2)]" type="button"><Play size={12} fill="currentColor" />{item.myStatus === "IN_PROGRESS" ? "코스 이어하기" : item.myStatus === "COMPLETED" ? "코스 다시 보기" : "코스 시작하기"}</button>
      </div>
    </article>
  );
}

function ItemImage({ src, alt, fallbackTheme, className = "h-[62px] w-[62px] rounded-[16px]" }: { src: string; alt: string; fallbackTheme: ThemeKey; className?: string }) {
  const [failed, setFailed] = useState(false);
  return <div className={`grid shrink-0 place-items-center overflow-hidden bg-[#eaf5ff] ${className}`}>{src && !failed ? <img alt={alt} className="h-full w-full object-cover" onError={() => setFailed(true)} src={src} /> : <ThemeIcon className="h-full w-full rounded-none" size={28} theme={fallbackTheme} />}</div>;
}

function LoadingState() {
  return <div className="grid gap-3" aria-label="좋아요 목록 불러오는 중">{[0, 1, 2].map((item) => <div className="flex h-[96px] animate-pulse items-center gap-3 rounded-[18px] border border-[#e4ebf2] bg-white p-3" key={item}><span className="h-[62px] w-[62px] rounded-[16px] bg-[#e7f0f7]" /><span className="grid flex-1 gap-2"><i className="h-3 w-14 rounded bg-[#e7f0f7]" /><i className="h-4 w-2/3 rounded bg-[#edf2f6]" /><i className="h-3 w-1/2 rounded bg-[#edf2f6]" /></span></div>)}</div>;
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return <div className="grid min-h-[280px] place-items-center text-center"><div><span className="mx-auto grid h-16 w-16 place-items-center rounded-[22px] bg-[#fff0f1] text-[#dc6970]"><AlertCircle size={28} /></span><h2 className="mt-4 text-[14px] font-extrabold">목록을 불러오지 못했어요</h2><p className="mt-1.5 break-keep text-[10px] text-[#95a3b2]">{message}</p><button className="mt-4 h-9 rounded-[11px] bg-[#55afe9] px-4 text-[10px] font-extrabold text-white" onClick={onRetry} type="button">다시 시도</button></div></div>;
}

function EmptyState({ tab }: { tab: TabKey }) {
  return <div className="grid min-h-[280px] place-items-center text-center"><div><ThemeIcon className="mx-auto h-16 w-16 rounded-[22px]" size={28} theme={tab === "mission" ? "etc" : "course"} /><h2 className="mt-4 text-[14px] font-extrabold">좋아요한 {tab === "mission" ? "미션" : "코스"}가 없어요</h2><p className="mt-1.5 text-[10px] text-[#95a3b2]">마음에 드는 여행을 저장해보세요.</p></div></div>;
}

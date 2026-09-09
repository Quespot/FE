import { useMemo, useState, type ComponentType } from "react";
import {
  Archive,
  ArrowLeft,
  Backpack,
  Briefcase,
  Check,
  CircleUserRound,
  Glasses,
  LayoutGrid,
  Shirt,
  ShoppingBag,
  Sparkles,
  Store,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { customizeAssets } from "@/assets/customize";
import { getQuestyCombinationAsset } from "@/assets/customize/combinations";

type ViewMode = "closet" | "shop";
type Slot = "head" | "face" | "neck" | "outfit" | "bag" | "hand";
type FilterKey = "all" | Slot;

type CustomizeItem = {
  id: string;
  name: string;
  slot: Slot;
  thumbnail: string;
  incompatibleIds?: string[];
};

const filters: Array<{ id: FilterKey; label: string; icon: ComponentType<{ size?: number }> }> = [
  { id: "all", label: "전체", icon: LayoutGrid },
  { id: "head", label: "머리", icon: CircleUserRound },
  { id: "face", label: "얼굴", icon: Glasses },
  { id: "neck", label: "목", icon: Sparkles },
  { id: "outfit", label: "의상", icon: Shirt },
  { id: "bag", label: "가방", icon: Backpack },
  { id: "hand", label: "손소품", icon: Briefcase },
];

const items: CustomizeItem[] = [
  { id: "explorer-hat", name: "탐험가 모자", slot: "head", thumbnail: customizeAssets.explorerHat },
  { id: "purple-sunglasses", name: "보라 선글라스", slot: "face", thumbnail: customizeAssets.purpleSunglasses, incompatibleIds: ["magnifying-glass"] },
  { id: "red-scarf", name: "빨간 스카프", slot: "neck", thumbnail: customizeAssets.redScarf, incompatibleIds: ["yellow-raincoat"] },
  { id: "yellow-raincoat", name: "노란 우비", slot: "outfit", thumbnail: customizeAssets.yellowRaincoat, incompatibleIds: ["red-scarf"] },
  { id: "explorer-vest", name: "탐험 조끼", slot: "outfit", thumbnail: customizeAssets.explorerVest },
  { id: "travel-satchel", name: "여행 가방", slot: "bag", thumbnail: customizeAssets.travelSatchel },
  { id: "magnifying-glass", name: "탐험 돋보기", slot: "hand", thumbnail: customizeAssets.magnifyingGlass, incompatibleIds: ["purple-sunglasses"] },
];

const initiallyOwned = new Set(items.map((item) => item.id));

export default function QuestyCustomizePage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<ViewMode>("closet");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [owned, setOwned] = useState(initiallyOwned);
  const [equipped, setEquipped] = useState<Partial<Record<Slot, string>>>({});
  const points = 1240;

  const visibleItems = useMemo(() => items.filter((item) => {
    const belongsToView = mode === "closet" ? owned.has(item.id) : !owned.has(item.id);
    return belongsToView && (filter === "all" || item.slot === filter);
  }), [filter, mode, owned]);

  const equippedItems = Object.values(equipped).map((id) => items.find((item) => item.id === id)).filter((item): item is CustomizeItem => Boolean(item));
  const equippedAsset = getQuestyCombinationAsset(equippedItems.map((item) => item.id));

  const toggleEquip = (item: CustomizeItem) => {
    setEquipped((current) => {
      if (current[item.slot] === item.id) return { ...current, [item.slot]: undefined };

      const next = { ...current };
      for (const [slot, equippedId] of Object.entries(next)) {
        if (equippedId && item.incompatibleIds?.includes(equippedId)) next[slot as Slot] = undefined;
      }
      next[item.slot] = item.id;
      return next;
    });
  };

  return (
    <main className="min-h-dvh bg-[#f3f8fe] text-[#19233b]">
      <header className="sticky top-0 z-[100] flex h-[72px] items-end border-b border-[#e6edf4] bg-white px-[18px] pb-[12px]">
        <button className="grid h-9 w-9 place-items-center rounded-full bg-[#eaf6ff] text-[#4ba9e8]" aria-label="마이페이지로 돌아가기" onClick={() => navigate(-1)} type="button"><ArrowLeft size={18} /></button>
        <h1 className="ml-3 flex-1 self-center pt-5 text-[16px] font-extrabold">마스코트 꾸미기</h1>
        <span className="flex h-8 items-center gap-1 rounded-full bg-[#eaf6ff] px-3 text-[10px] font-extrabold text-[#47a8e9]"><Zap size={12} fill="currentColor" strokeWidth={0} />{points.toLocaleString()}P</span>
      </header>

      <section className="relative flex min-h-[300px] flex-col items-center overflow-hidden bg-[linear-gradient(180deg,#d0efff,#edf9ff)] px-5 pb-5 pt-4">
        <div className="absolute left-7 top-8 h-2 w-2 rounded-full bg-[#f8d85b] shadow-[0_0_0_5px_rgba(255,222,87,.16)]" />
        <div className="absolute right-9 top-14 h-1.5 w-1.5 rounded-full bg-[#7bc9f5] shadow-[0_0_0_5px_rgba(123,201,245,.15)]" />
        <div className="relative h-[244px] w-[244px] overflow-hidden rounded-[38px] border border-white/90 bg-[linear-gradient(180deg,#bfe9ff_0%,#eaf8ff_62%,#dff3d6_63%,#ccebbf_100%)] shadow-[0_16px_38px_rgba(53,133,184,0.16)]">
          <div className="absolute left-5 top-5 h-11 w-11 rounded-full bg-[#ffe57a] opacity-90 shadow-[0_0_24px_rgba(255,224,95,.65)]" />

          <div className="animate-questy-cloud absolute left-[-20px] top-[54px] flex items-end opacity-80" aria-hidden="true">
            <span className="h-5 w-10 rounded-full bg-white/85" />
            <span className="-ml-7 h-8 w-9 rounded-full bg-white/90" />
            <span className="-ml-6 h-5 w-12 rounded-full bg-white/85" />
          </div>
          <div className="animate-questy-cloud-delayed absolute right-[-14px] top-[31px] flex items-end scale-75 opacity-70" aria-hidden="true">
            <span className="h-5 w-10 rounded-full bg-white/85" />
            <span className="-ml-7 h-8 w-9 rounded-full bg-white/90" />
            <span className="-ml-6 h-5 w-12 rounded-full bg-white/85" />
          </div>

          <div className="absolute bottom-[34px] left-[-30px] h-[64px] w-[156px] rounded-[50%] bg-[#a9dc9b]/80" />
          <div className="absolute bottom-[29px] right-[-40px] h-[75px] w-[180px] rounded-[50%] bg-[#8fd18b]/75" />
          <div className="absolute inset-x-0 bottom-0 h-[50px] bg-[linear-gradient(180deg,#bde5a8,#a8d88f)]" />
          <div className="absolute inset-x-0 bottom-[47px] h-[3px] bg-white/30" />

          <Sparkles className="animate-questy-sparkle absolute right-[25px] top-[76px] text-white/90" size={15} strokeWidth={2.4} aria-hidden="true" />
          <Sparkles className="animate-questy-sparkle-delayed absolute left-[30px] top-[105px] text-[#fff3a8]" size={11} strokeWidth={2.4} aria-hidden="true" />
          <span className="animate-questy-shadow absolute bottom-[18px] left-1/2 h-[12px] w-[112px] -translate-x-1/2 rounded-full bg-[#34766b]/20 blur-[2px]" aria-hidden="true" />

          <div className="absolute bottom-[10px] left-1/2 z-10 h-[210px] w-[210px] -translate-x-1/2">
            <div className="animate-questy-dressup relative h-full w-full motion-reduce:animate-none">
              <img
                alt="꾸미기 중인 퀘스티"
                className="pointer-events-none absolute inset-0 h-full w-full object-contain drop-shadow-[0_12px_14px_rgba(38,90,125,.16)]"
                src={equippedAsset}
              />
            </div>
          </div>
        </div>

      </section>

      <section className="relative -mt-1 rounded-t-[28px] bg-[#f7faff] px-[16px] pb-10 pt-[15px] shadow-[0_-8px_24px_rgba(64,108,143,0.06)]">
        <div className="grid grid-cols-2 rounded-[17px] bg-[#e7f2fb] p-1">
          <ModeButton active={mode === "closet"} icon={Archive} label="내 보관함" onClick={() => setMode("closet")} />
          <ModeButton active={mode === "shop"} icon={Store} label="아이템 상점" onClick={() => setMode("shop")} />
        </div>

        {mode === "closet" ? <>
          <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto pb-1">
            {filters.map(({ id, label, icon: Icon }) => <button className={`flex h-8 shrink-0 items-center gap-1 rounded-full px-3 text-[9px] font-extrabold transition ${filter === id ? "bg-[#55b1ed] text-white" : "bg-[#eaf3fa] text-[#8395a6]"}`} key={id} onClick={() => setFilter(id)} type="button"><Icon size={11} />{label}</button>)}
          </div>

          <div className="mb-3 mt-3 flex items-end justify-between px-1">
            <div><h2 className="text-[13px] font-extrabold">보유 아이템</h2><p className="mt-1 text-[8.5px] text-[#96a4b1]">같은 부위나 겹치는 아이템은 하나만 착용할 수 있어요.</p></div>
            <span className="text-[9px] font-bold text-[#6baedf]">{visibleItems.length}개</span>
          </div>

          {visibleItems.length ? <div className="grid grid-cols-3 gap-2.5">
            {visibleItems.map((item) => {
              const isEquipped = equipped[item.slot] === item.id;
              return <article className={`relative grid min-h-[142px] content-start justify-items-center rounded-[18px] border bg-white px-2 pb-2.5 pt-3 text-center shadow-[0_4px_14px_rgba(50,87,117,0.06)] ${isEquipped ? "border-[#55b5f5] ring-2 ring-[#55b5f5]/15" : "border-[#e1e9f0]"}`} key={item.id}>
                {isEquipped ? <span className="absolute right-2 top-2 grid h-4 w-4 place-items-center rounded-full bg-[#55b5f5] text-white"><Check size={10} strokeWidth={3} /></span> : null}
                <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-[15px] bg-[#edf7fe]"><img alt="" className="h-11 w-11 object-contain" src={item.thumbnail} /></span>
                <strong className="mt-2 line-clamp-1 text-[10px] font-extrabold">{item.name}</strong>
                <button className={`mt-2 h-6 w-full rounded-[8px] text-[8px] font-extrabold ${isEquipped ? "bg-[#eaf7ff] text-[#3ca5e8]" : "bg-[#55b1ed] text-white"}`} onClick={() => toggleEquip(item)} type="button">{isEquipped ? "장착 해제" : "착용하기"}</button>
              </article>;
            })}
          </div> : <div className="grid min-h-[190px] place-items-center rounded-[20px] border border-dashed border-[#dbe6ee] bg-white/60 text-center"><div><ShoppingBag className="mx-auto text-[#a9cce3]" size={25} /><p className="mt-2 text-[10px] font-bold text-[#8fa0af]">이 카테고리에는 아이템이 없어요</p></div></div>}
        </> : <div className="relative mt-4 grid min-h-[260px] place-items-center overflow-hidden rounded-[24px] border border-[#dcebf5] bg-[linear-gradient(145deg,#ffffff_0%,#eef8ff_100%)] px-6 text-center shadow-[0_8px_24px_rgba(53,110,151,0.06)]">
          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#d8f0ff]/60" />
          <div className="absolute -bottom-10 -left-8 h-32 w-32 rounded-full bg-[#e7f6ff]/80" />
          <div className="relative">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-[22px] bg-[#e5f5ff] text-[#55afe9] shadow-[0_8px_18px_rgba(62,159,218,.14)]"><Store size={29} strokeWidth={2} /></span>
            <h2 className="mt-4 text-[14px] font-extrabold">아이템 상점 준비 중이에요</h2>
            <p className="mt-2 text-[9px] font-medium leading-relaxed text-[#8fa1b0]">더 다양한 꾸미기 아이템을<br />곧 만나볼 수 있어요.</p>
            <span className="mt-4 inline-flex items-center gap-1 rounded-full bg-[#eef8ff] px-3 py-1.5 text-[8px] font-extrabold text-[#5aaadf]"><Sparkles size={10} />COMING SOON</span>
          </div>
        </div>}
      </section>
    </main>
  );
}

function ModeButton({ active, icon: Icon, label, onClick }: { active: boolean; icon: ComponentType<{ size?: number; strokeWidth?: number }>; label: string; onClick: () => void }) {
  return <button className={`flex h-9 items-center justify-center gap-1.5 rounded-[13px] text-[10px] font-extrabold transition ${active ? "bg-white text-[#43a7e8] shadow-[0_2px_8px_rgba(46,92,124,0.1)]" : "text-[#94a3b2]"}`} onClick={onClick} type="button"><Icon size={14} strokeWidth={2.2} />{label}</button>;
}

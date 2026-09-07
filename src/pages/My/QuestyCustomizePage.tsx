import { useMemo, useState, type ComponentType } from "react";
import {
  ArrowLeft,
  Backpack,
  Briefcase,
  Check,
  CircleUserRound,
  Glasses,
  LayoutGrid,
  Lock,
  Shirt,
  ShoppingBag,
  Sparkles,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { customizeAssets } from "@/assets/customize";
import explorerHatLayer from "@/assets/customize/layered/explorer-hat.front.png";
import explorerVestLayer from "@/assets/customize/layered/explorer-vest.front.png";
import magnifyingGlassLayer from "@/assets/customize/layered/magnifying-glass.front.png";
import purpleSunglassesLayer from "@/assets/customize/layered/purple-sunglasses.front.png";
import questyBase from "@/assets/customize/layered/questy-base.png";
import redScarfLayer from "@/assets/customize/layered/red-scarf.front.png";
import travelSatchelBackLayer from "@/assets/customize/layered/travel-satchel.back.png";
import travelSatchelFrontLayer from "@/assets/customize/layered/travel-satchel.front.png";
import yellowRaincoatBackLayer from "@/assets/customize/layered/yellow-raincoat.back.png";
import yellowRaincoatFrontLayer from "@/assets/customize/layered/yellow-raincoat.front.png";

type ViewMode = "closet" | "shop";
type Slot = "head" | "face" | "neck" | "outfit" | "bag" | "hand";
type FilterKey = "all" | Slot;

type ItemLayer = {
  asset: string;
  zIndex: number;
};

type CustomizeItem = {
  id: string;
  name: string;
  slot: Slot;
  thumbnail: string;
  layers: ItemLayer[];
  calibration?: { scale: number; x?: number; y?: number };
  incompatibleIds?: string[];
  rarity: "일반" | "희귀" | "전설";
  price: number;
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
  { id: "explorer-hat", name: "탐험가 모자", slot: "head", thumbnail: customizeAssets.explorerHat, layers: [{ asset: explorerHatLayer, zIndex: 60 }], calibration: { scale: 0.68, y: -17 }, rarity: "일반", price: 120 },
  { id: "purple-sunglasses", name: "보라 선글라스", slot: "face", thumbnail: customizeAssets.purpleSunglasses, layers: [{ asset: purpleSunglassesLayer, zIndex: 50 }], calibration: { scale: 0.62, y: -8 }, incompatibleIds: ["magnifying-glass"], rarity: "희귀", price: 180 },
  { id: "red-scarf", name: "빨간 스카프", slot: "neck", thumbnail: customizeAssets.redScarf, layers: [{ asset: redScarfLayer, zIndex: 40 }], calibration: { scale: 0.7, y: 23 }, incompatibleIds: ["yellow-raincoat"], rarity: "일반", price: 120 },
  { id: "yellow-raincoat", name: "노란 우비", slot: "outfit", thumbnail: customizeAssets.yellowRaincoat, layers: [{ asset: yellowRaincoatBackLayer, zIndex: 10 }, { asset: yellowRaincoatFrontLayer, zIndex: 30 }], calibration: { scale: 0.85, y: 20 }, incompatibleIds: ["red-scarf"], rarity: "희귀", price: 220 },
  { id: "explorer-vest", name: "탐험 조끼", slot: "outfit", thumbnail: customizeAssets.explorerVest, layers: [{ asset: explorerVestLayer, zIndex: 30 }], calibration: { scale: 0.82, y: 23 }, rarity: "일반", price: 180 },
  { id: "travel-satchel", name: "여행 가방", slot: "bag", thumbnail: customizeAssets.blueMailSatchel, layers: [{ asset: travelSatchelBackLayer, zIndex: 12 }, { asset: travelSatchelFrontLayer, zIndex: 45 }], calibration: { scale: 0.68, x: 28, y: 27 }, rarity: "일반", price: 160 },
  { id: "magnifying-glass", name: "탐험 돋보기", slot: "hand", thumbnail: customizeAssets.magnifyingGlass, layers: [{ asset: magnifyingGlassLayer, zIndex: 70 }], calibration: { scale: 0.68, x: -18, y: 10 }, incompatibleIds: ["purple-sunglasses"], rarity: "일반", price: 120 },
];

const initiallyOwned = new Set(items.map((item) => item.id));

export default function QuestyCustomizePage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<ViewMode>("closet");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [owned, setOwned] = useState(initiallyOwned);
  const [equipped, setEquipped] = useState<Partial<Record<Slot, string>>>({});
  const [points, setPoints] = useState(1240);

  const visibleItems = useMemo(() => items.filter((item) => {
    const belongsToView = mode === "closet" ? owned.has(item.id) : !owned.has(item.id);
    return belongsToView && (filter === "all" || item.slot === filter);
  }), [filter, mode, owned]);

  const equippedItems = Object.values(equipped).map((id) => items.find((item) => item.id === id)).filter((item): item is CustomizeItem => Boolean(item));
  const equippedLayers = equippedItems.flatMap((item) => item.layers.map((layer, index) => ({ ...layer, calibration: item.calibration, key: `${item.id}-${index}` }))).sort((a, b) => a.zIndex - b.zIndex);

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

  const buyItem = (item: CustomizeItem) => {
    const price = item.price ?? 0;
    if (points < price) return;
    setPoints((current) => current - price);
    setOwned((current) => new Set([...current, item.id]));
  };

  return (
    <main className="min-h-dvh bg-[#f3f8fe] text-[#19233b]">
      <header className="sticky top-0 z-[100] flex h-[72px] items-end border-b border-[#e6edf4] bg-white px-[18px] pb-[12px]">
        <button className="grid h-9 w-9 place-items-center rounded-full bg-[#eaf6ff] text-[#4ba9e8]" aria-label="마이페이지로 돌아가기" onClick={() => navigate(-1)} type="button"><ArrowLeft size={18} /></button>
        <h1 className="ml-3 flex-1 self-center pt-5 text-[16px] font-extrabold">마스코트 꾸미기</h1>
        <span className="flex h-8 items-center gap-1 rounded-full bg-[#eaf6ff] px-3 text-[10px] font-extrabold text-[#47a8e9]"><Zap size={12} fill="currentColor" strokeWidth={0} />{points.toLocaleString()}P</span>
      </header>

      <section className="relative flex min-h-[330px] flex-col items-center overflow-hidden bg-[linear-gradient(180deg,#d0efff,#edf9ff)] px-5 pb-5 pt-4">
        <div className="absolute left-7 top-8 h-2 w-2 rounded-full bg-[#f8d85b] shadow-[0_0_0_5px_rgba(255,222,87,.16)]" />
        <div className="absolute right-9 top-14 h-1.5 w-1.5 rounded-full bg-[#7bc9f5] shadow-[0_0_0_5px_rgba(123,201,245,.15)]" />
        <div className="relative grid h-[220px] w-[220px] place-items-center rounded-[34px] border border-white/80 bg-white/55 shadow-[0_14px_34px_rgba(53,133,184,0.12)]">
          <div className="animate-questy-dressup relative h-[204px] w-[204px] motion-reduce:animate-none">
            {equippedLayers.filter((layer) => layer.zIndex < 20).map((layer) => (
              <img alt="" className="pointer-events-none absolute inset-0 h-full w-full object-contain" key={layer.key} src={layer.asset} style={{ transform: `translate(${layer.calibration?.x ?? 0}px, ${layer.calibration?.y ?? 0}px) scale(${layer.calibration?.scale ?? 1})`, zIndex: layer.zIndex }} />
            ))}
            <img
              alt="꾸미기 중인 퀘스티"
              className="pointer-events-none absolute inset-0 h-full w-full object-contain drop-shadow-[0_12px_14px_rgba(38,90,125,.16)]"
              src={questyBase}
              style={{ zIndex: 20 }}
            />
            {equippedLayers.filter((layer) => layer.zIndex >= 20).map((layer) => (
              <img alt="" className="pointer-events-none absolute inset-0 h-full w-full object-contain" key={layer.key} src={layer.asset} style={{ transform: `translate(${layer.calibration?.x ?? 0}px, ${layer.calibration?.y ?? 0}px) scale(${layer.calibration?.scale ?? 1})`, zIndex: layer.zIndex }} />
            ))}
          </div>
        </div>

        <div className="mt-3 flex min-h-7 flex-wrap items-center justify-center gap-1.5">
          {equippedItems.length ? equippedItems.map((item) => <button className="flex items-center gap-1 rounded-full border border-[#cfe9f9] bg-white px-2.5 py-1 text-[8.5px] font-bold text-[#4a9fd8]" key={item.id} onClick={() => toggleEquip(item)} type="button"><img alt="" className="h-4 w-4 object-contain" src={item.thumbnail} />{item.name} ×</button>) : <span className="text-[10px] font-medium text-[#8ca0b1]">아래 아이템을 눌러 퀘스티를 꾸며보세요</span>}
        </div>
      </section>

      <section className="relative -mt-1 rounded-t-[28px] bg-[#f7faff] px-[16px] pb-10 pt-[15px] shadow-[0_-8px_24px_rgba(64,108,143,0.06)]">
        <div className="grid grid-cols-2 rounded-[17px] bg-[#e7f2fb] p-1">
          <ModeButton active={mode === "closet"} icon="🧥" label="내 보관함" onClick={() => setMode("closet")} />
          <ModeButton active={mode === "shop"} icon="🛍️" label="아이템 상점" onClick={() => setMode("shop")} />
        </div>

        <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto pb-1">
          {filters.map(({ id, label, icon: Icon }) => <button className={`flex h-8 shrink-0 items-center gap-1 rounded-full px-3 text-[9px] font-extrabold transition ${filter === id ? "bg-[#55b1ed] text-white" : "bg-[#eaf3fa] text-[#8395a6]"}`} key={id} onClick={() => setFilter(id)} type="button"><Icon size={11} />{label}</button>)}
        </div>

        <div className="mb-3 mt-3 flex items-end justify-between px-1">
          <div><h2 className="text-[13px] font-extrabold">{mode === "closet" ? "보유 아이템" : "새 아이템"}</h2><p className="mt-1 text-[8.5px] text-[#96a4b1]">{mode === "closet" ? "같은 부위나 겹치는 아이템은 하나만 착용할 수 있어요." : "미션 포인트로 아이템을 구매할 수 있어요."}</p></div>
          <span className="text-[9px] font-bold text-[#6baedf]">{visibleItems.length}개</span>
        </div>

        {visibleItems.length ? <div className="grid grid-cols-3 gap-2.5">
          {visibleItems.map((item) => {
            const isEquipped = equipped[item.slot] === item.id;
            const canBuy = points >= item.price;
            return <article className={`relative grid min-h-[142px] content-start justify-items-center rounded-[18px] border bg-white px-2 pb-2.5 pt-3 text-center shadow-[0_4px_14px_rgba(50,87,117,0.06)] ${isEquipped ? "border-[#55b5f5] ring-2 ring-[#55b5f5]/15" : "border-[#e1e9f0]"}`} key={item.id}>
              {isEquipped ? <span className="absolute right-2 top-2 grid h-4 w-4 place-items-center rounded-full bg-[#55b5f5] text-white"><Check size={10} strokeWidth={3} /></span> : null}
              <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-[15px] bg-[#edf7fe]"><img alt="" className="h-11 w-11 object-contain" src={item.thumbnail} /></span>
              <strong className="mt-2 line-clamp-1 text-[10px] font-extrabold">{item.name}</strong>
              <span className={`mt-1 rounded-full px-1.5 py-0.5 text-[7px] font-bold ${item.rarity === "전설" ? "bg-[#fff2c8] text-[#dc931d]" : item.rarity === "희귀" ? "bg-[#eee7ff] text-[#8560d3]" : "bg-[#f0f4f7] text-[#8a98a5]"}`}>{item.rarity}</span>
              {mode === "closet" ? <button className={`mt-2 h-6 w-full rounded-[8px] text-[8px] font-extrabold ${isEquipped ? "bg-[#eaf7ff] text-[#3ca5e8]" : "bg-[#55b1ed] text-white"}`} onClick={() => toggleEquip(item)} type="button">{isEquipped ? "장착 해제" : "착용하기"}</button> : <button className="mt-2 flex h-6 w-full items-center justify-center gap-0.5 rounded-[8px] bg-[#eaf7ff] text-[8px] font-extrabold text-[#3ca5e8] disabled:bg-[#f1f3f5] disabled:text-[#adb6bf]" disabled={!canBuy} onClick={() => buyItem(item)} type="button"><Zap size={8} fill="currentColor" strokeWidth={0} />{item.price}P</button>}
            </article>;
          })}
        </div> : <div className="grid min-h-[190px] place-items-center rounded-[20px] border border-dashed border-[#dbe6ee] bg-white/60 text-center"><div><ShoppingBag className="mx-auto text-[#a9cce3]" size={25} /><p className="mt-2 text-[10px] font-bold text-[#8fa0af]">이 카테고리에는 아이템이 없어요</p></div></div>}

        <p className="mt-4 flex items-center justify-center gap-1.5 rounded-[14px] bg-white px-3 py-3 text-[8.5px] font-semibold text-[#8a99a7]"><Lock size={12} />특별 아이템은 미션과 배지로 해금할 수 있어요.</p>
      </section>
    </main>
  );
}

function ModeButton({ active, icon, label, onClick }: { active: boolean; icon: string; label: string; onClick: () => void }) {
  return <button className={`h-9 rounded-[13px] text-[10px] font-extrabold transition ${active ? "bg-white text-[#43a7e8] shadow-[0_2px_8px_rgba(46,92,124,0.1)]" : "text-[#94a3b2]"}`} onClick={onClick} type="button">{icon} {label}</button>;
}

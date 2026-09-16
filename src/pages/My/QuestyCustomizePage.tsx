import { useEffect, useMemo, useState, type ComponentType } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle, Archive, ArrowLeft, Check, CircleUserRound, Glasses, ImageIcon,
  LayoutGrid, LoaderCircle, Lock, Shirt, ShoppingBag, Sparkles, Store, Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  equipItem, getItemApiErrorMessage, getMyItems, getMyQuesty, getShopItems,
  purchaseItem, unequipItem, type EquippedItem, type ItemCategory,
  type ItemRarity, type OwnedItem, type ShopItem,
} from "@/apis/item";
import { getMyAchievements } from "@/apis/achievement";
import { customizeAssets } from "@/assets/customize";
import { getQuestyCombinationAsset } from "@/assets/customize/combinations";
import { LOCAL_EQUIPPED_QUESTY_KEY } from "@/utils/questyAsset";
import cafeRoom from "@/assets/customize/scenes/cafe-room.png";
import cozyBedroom from "@/assets/customize/scenes/cozy-bedroom.png";
import schoolRoom from "@/assets/customize/scenes/school-room.png";
import seasideCamp from "@/assets/customize/scenes/seaside-camp.png";
import starObservatory from "@/assets/customize/scenes/star-observatory.png";

type ViewMode = "closet" | "shop";
type FilterKey = "all" | ItemCategory;
type SceneId = "garden" | "cafe" | "school" | "bedroom" | "seaside" | "observatory";
type LocalSlot = "head" | "face" | "neck" | "outfit" | "bag" | "hand";

type SceneItem = {
  id: SceneId;
  name: string;
  image?: string;
  aliases: readonly string[];
};

type DisplayItem = {
  id: number;
  code?: string;
  name: string;
  category: ItemCategory;
  rarity: ItemRarity;
  imageUrl: string;
  price?: number;
  isEquipped: boolean;
  isOwned: boolean;
  localId?: string;
};
type EquippedPreviewItem = EquippedItem & { code?: string };

const itemQueryKeys = {
  questy: ["items", "questy"] as const,
  owned: ["items", "owned"] as const,
  shop: ["items", "shop"] as const,
  achievements: ["users", "me", "achievements"] as const,
};

const filters: Array<{ id: FilterKey; label: string; icon: ComponentType<{ size?: number; className?: string }> }> = [
  { id: "all", label: "전체", icon: LayoutGrid },
  { id: "HAT", label: "모자", icon: CircleUserRound },
  { id: "ACCESSORY", label: "액세서리", icon: Glasses },
  { id: "OUTFIT", label: "의상", icon: Shirt },
  { id: "ITEM", label: "소품", icon: ShoppingBag },
  { id: "BACKGROUND", label: "배경", icon: ImageIcon },
];

const sceneItems: SceneItem[] = [
  { id: "garden", name: "햇살 정원", aliases: ["sunnygarden", "햇살정원"] },
  { id: "cafe", name: "포근한 카페", image: cafeRoom, aliases: ["cozycafe", "warmcafe", "포근한카페"] },
  { id: "school", name: "햇살 교실", image: schoolRoom, aliases: ["sunnyclassroom", "sunnyclass", "햇살교실"] },
  { id: "bedroom", name: "포근한 방", image: cozyBedroom, aliases: ["cozyroom", "cozybedroom", "포근한방"] },
  { id: "seaside", name: "바닷가 캠핑", image: seasideCamp, aliases: ["seasidecamp", "beachcamp", "바닷가캠핑"] },
  { id: "observatory", name: "별빛 관측소", image: starObservatory, aliases: ["starobservatory", "starlightobservatory", "별빛관측소"] },
];

const rarityLabel: Record<string, string> = {
  NORMAL: "일반",
  RARE: "희귀",
  EPIC: "영웅",
  LEGENDARY: "전설",
};

const localItemAssets = [
  { id: "explorer-hat", syntheticId: -1, name: "탐험가 모자", category: "HAT", slot: "head", asset: customizeAssets.explorerHat, aliases: ["explorerhat", "탐험가모자"] },
  { id: "purple-sunglasses", syntheticId: -2, name: "보라 선글라스", category: "ACCESSORY", slot: "face", asset: customizeAssets.purpleSunglasses, aliases: ["purplesunglasses", "보라선글라스"], incompatibleIds: ["magnifying-glass"] },
  { id: "red-scarf", syntheticId: -3, name: "빨간 스카프", category: "ACCESSORY", slot: "neck", asset: customizeAssets.redScarf, aliases: ["redscarf", "빨간스카프"], incompatibleIds: ["yellow-raincoat"] },
  { id: "yellow-raincoat", syntheticId: -4, name: "노란 우비", category: "OUTFIT", slot: "outfit", asset: customizeAssets.yellowRaincoat, aliases: ["yellowraincoat", "노란우비"], incompatibleIds: ["red-scarf"] },
  { id: "explorer-vest", syntheticId: -5, name: "탐험 조끼", category: "OUTFIT", slot: "outfit", asset: customizeAssets.explorerVest, aliases: ["explorervest", "탐험조끼"] },
  { id: "travel-satchel", syntheticId: -6, name: "여행 가방", category: "ITEM", slot: "bag", asset: customizeAssets.travelSatchel, aliases: ["travelsatchel", "여행가방"] },
  { id: "magnifying-glass", syntheticId: -7, name: "탐험 돋보기", category: "ITEM", slot: "hand", asset: customizeAssets.magnifyingGlass, aliases: ["magnifyingglass", "탐험돋보기"], incompatibleIds: ["purple-sunglasses"] },
] as const;
const equippedAssetFallback = getQuestyCombinationAsset([]);

const normalizeItemKey = (value: string) => value.toLowerCase().replace(/[^a-z0-9가-힣]/g, "");

function getLocalScene(item: { name: string; code?: string }) {
  const key = normalizeItemKey(`${item.code ?? ""}${item.name}`);
  return sceneItems.find(({ aliases }) => aliases.some((alias) => key.includes(alias)));
}

function getLocalItem(item: Pick<DisplayItem, "name" | "code">) {
  const key = normalizeItemKey(`${item.code ?? ""}${item.name}`);
  return localItemAssets.find(({ aliases }) => aliases.some((alias) => key.includes(alias)));
}

const getLocalItemAsset = (item: Pick<DisplayItem, "name" | "code">) => getLocalItem(item)?.asset;

function toOwnedDisplayItem(item: OwnedItem): DisplayItem {
  return {
    id: item.itemId,
    name: item.name,
    category: item.category,
    rarity: item.rarity,
    imageUrl: item.imageUrl,
    isEquipped: item.isEquipped,
    isOwned: true,
  };
}

function toShopDisplayItem(item: ShopItem, ownedIds: Set<number>, equippedIds: Set<number>): DisplayItem {
  return {
    id: item.id,
    code: item.code,
    name: item.name,
    category: item.category,
    rarity: item.rarity,
    imageUrl: item.imageUrl,
    price: item.price,
    isEquipped: equippedIds.has(item.id),
    isOwned: ownedIds.has(item.id),
  };
}

export default function QuestyCustomizePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<ViewMode>("closet");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [points, setPoints] = useState<number | null>(null);
  const [localEquipped, setLocalEquipped] = useState<Partial<Record<LocalSlot, string>>>(() => {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_EQUIPPED_QUESTY_KEY) ?? "{}");
    } catch {
      return {};
    }
  });
  const [pendingItemId, setPendingItemId] = useState<number | null>(null);
  const [status, setStatus] = useState<{ message: string; error?: boolean } | null>(null);

  const questyQuery = useQuery({ queryKey: itemQueryKeys.questy, queryFn: getMyQuesty, retry: false });
  const ownedQuery = useQuery({ queryKey: itemQueryKeys.owned, queryFn: getMyItems, retry: false });
  const shopQuery = useQuery({ queryKey: itemQueryKeys.shop, queryFn: () => getShopItems(), retry: false });
  const achievementsQuery = useQuery({ queryKey: itemQueryKeys.achievements, queryFn: getMyAchievements, retry: false });

  useEffect(() => {
    if (achievementsQuery.data) setPoints(achievementsQuery.data.totalPoint);
  }, [achievementsQuery.data]);

  useEffect(() => {
    if (!status) return;
    const timer = window.setTimeout(() => setStatus(null), 2600);
    return () => window.clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    localStorage.setItem(LOCAL_EQUIPPED_QUESTY_KEY, JSON.stringify(localEquipped));
  }, [localEquipped]);

  const ownedIds = useMemo(() => new Set((ownedQuery.data ?? []).map((item) => item.itemId)), [ownedQuery.data]);
  const equippedIds = useMemo(() => new Set((questyQuery.data?.equippedItems ?? []).map((item) => item.itemId)), [questyQuery.data]);
  const items = useMemo(() => {
    const remoteOwnedItems = (ownedQuery.data ?? []).map(toOwnedDisplayItem);
    const remoteLocalIds = new Set(remoteOwnedItems.map((item) => getLocalItem(item)?.id).filter(Boolean));
    const localOnlyItems: DisplayItem[] = localItemAssets
      .filter((item) => !remoteLocalIds.has(item.id))
      .map((item) => ({
        id: item.syntheticId,
        localId: item.id,
        name: item.name,
        category: item.category,
        rarity: "NORMAL",
        imageUrl: item.asset,
        isEquipped: localEquipped[item.slot] === item.id,
        isOwned: true,
      }));
    const source = mode === "closet"
      ? [...remoteOwnedItems, ...localOnlyItems]
      : (shopQuery.data ?? []).map((item) => toShopDisplayItem(item, ownedIds, equippedIds));
    const wearableItems = source.filter((item) => item.category !== "BACKGROUND" && !getLocalScene(item));
    if (filter === "BACKGROUND") return [];
    return filter === "all" ? wearableItems : wearableItems.filter((item) => item.category === filter);
  }, [equippedIds, filter, localEquipped, mode, ownedIds, ownedQuery.data, shopQuery.data]);

  const backgroundItems = useMemo(() => {
    if (filter !== "all" && filter !== "BACKGROUND") return [];
    const source = mode === "closet"
      ? (ownedQuery.data ?? []).map(toOwnedDisplayItem)
      : (shopQuery.data ?? []).map((item) => toShopDisplayItem(item, ownedIds, equippedIds));
    return source.filter((item) => item.category === "BACKGROUND" || Boolean(getLocalScene(item)));
  }, [equippedIds, filter, mode, ownedIds, ownedQuery.data, shopQuery.data]);
  const equippedBackground = (questyQuery.data?.equippedItems ?? []).find((item) =>
    item.category === "BACKGROUND" || Boolean(getLocalScene(item)),
  );
  const matchedActiveScene = equippedBackground ? getLocalScene(equippedBackground) : undefined;
  const activeSceneImage = matchedActiveScene?.image ?? (equippedBackground ? equippedBackground.imageUrl : undefined);
  const equippedPreviewItems = useMemo(() => (questyQuery.data?.equippedItems ?? []).map((item) => ({
    ...item,
    code: shopQuery.data?.find((shopItem) => shopItem.id === item.itemId)?.code,
  })).concat(Object.values(localEquipped).filter((localId): localId is string => Boolean(localId)).map((localId) => {
    const localItem = localItemAssets.find((item) => item.id === localId)!;
    return {
      itemId: localItem.syntheticId,
      name: localItem.name,
      code: localItem.id,
      category: localItem.category,
      rarity: "NORMAL",
      imageUrl: localItem.asset,
    };
  })), [localEquipped, questyQuery.data, shopQuery.data]);

  const isLoading = mode === "closet" ? ownedQuery.isLoading : shopQuery.isLoading;
  const activeError = mode === "closet" ? ownedQuery.error : shopQuery.error;

  const refreshItems = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: itemQueryKeys.questy }),
      queryClient.invalidateQueries({ queryKey: itemQueryKeys.owned }),
      queryClient.invalidateQueries({ queryKey: itemQueryKeys.shop }),
    ]);
  };

  const handleEquip = async (item: DisplayItem) => {
    if (pendingItemId !== null) return;
    if (item.id < 0 && item.localId) {
      const localItem = localItemAssets.find((candidate) => candidate.id === item.localId);
      if (!localItem) return;
      setLocalEquipped((current) => {
        if (current[localItem.slot] === localItem.id) return { ...current, [localItem.slot]: undefined };
        const next = { ...current };
        for (const [slot, equippedId] of Object.entries(next)) {
          if (equippedId && "incompatibleIds" in localItem && localItem.incompatibleIds.includes(equippedId as never)) next[slot as LocalSlot] = undefined;
        }
        next[localItem.slot] = localItem.id;
        return next;
      });
      setStatus({ message: item.isEquipped ? `${item.name} 장착을 해제했어요.` : `${item.name}을(를) 장착했어요.` });
      return;
    }
    setPendingItemId(item.id);
    try {
      if (item.isEquipped) {
        await unequipItem(item.id);
        setStatus({ message: `${item.name} 장착을 해제했어요.` });
      } else {
        await equipItem(item.id);
        setStatus({ message: `${item.name}을(를) 장착했어요.` });
      }
      await refreshItems();
    } catch (error) {
      setStatus({ message: getItemApiErrorMessage(error), error: true });
      await refreshItems();
    } finally {
      setPendingItemId(null);
    }
  };

  const handlePurchase = async (item: DisplayItem) => {
    if (pendingItemId !== null || item.isOwned) return;
    setPendingItemId(item.id);
    try {
      const result = await purchaseItem(item.id);
      setPoints(result.balance);
      setStatus({ message: `${item.name} 구매를 완료했어요.` });
      await refreshItems();
    } catch (error) {
      setStatus({ message: getItemApiErrorMessage(error), error: true });
      await refreshItems();
    } finally {
      setPendingItemId(null);
    }
  };

  const retry = () => {
    if (mode === "closet") void ownedQuery.refetch();
    else void shopQuery.refetch();
  };

  return (
    <main className="min-h-dvh bg-[#f3f8fe] text-[#19233b]">
      <header className="sticky top-0 z-[100] flex h-[72px] items-end border-b border-[#e6edf4] bg-white px-[18px] pb-[12px]">
        <button className="grid h-9 w-9 place-items-center rounded-full bg-[#eaf6ff] text-[#4ba9e8]" aria-label="마이페이지로 돌아가기" onClick={() => navigate(-1)} type="button"><ArrowLeft size={18} /></button>
        <h1 className="ml-3 flex-1 self-center pt-5 text-[16px] font-extrabold">마스코트 꾸미기</h1>
        <span className="flex h-8 items-center gap-1 rounded-full bg-[#eaf6ff] px-3 text-[10px] font-extrabold text-[#47a8e9]"><Zap size={12} fill="currentColor" strokeWidth={0} />{points === null ? "포인트" : `${points.toLocaleString()}P`}</span>
      </header>

      <section className="relative h-[310px] overflow-hidden bg-[linear-gradient(180deg,#bfe9ff_0%,#eaf8ff_62%,#dff3d6_63%,#ccebbf_100%)]">
        {activeSceneImage ? <img alt="" aria-hidden="true" className="animate-questy-scene absolute inset-0 h-full w-full object-cover object-center motion-reduce:animate-none" src={activeSceneImage} /> : <>
          <div className="absolute left-7 top-7 h-14 w-14 rounded-full bg-[#ffe57a] opacity-90 shadow-[0_0_28px_rgba(255,224,95,.7)]" />
          <div className="animate-questy-cloud absolute left-[-14px] top-[72px] flex items-end opacity-80" aria-hidden="true"><span className="h-5 w-10 rounded-full bg-white/85" /><span className="-ml-7 h-8 w-9 rounded-full bg-white/90" /><span className="-ml-6 h-5 w-12 rounded-full bg-white/85" /></div>
          <div className="animate-questy-cloud-delayed absolute right-[12px] top-[42px] flex items-end scale-75 opacity-70" aria-hidden="true"><span className="h-5 w-10 rounded-full bg-white/85" /><span className="-ml-7 h-8 w-9 rounded-full bg-white/90" /><span className="-ml-6 h-5 w-12 rounded-full bg-white/85" /></div>
          <div className="absolute bottom-[40px] left-[-42px] h-[82px] w-[230px] rounded-[50%] bg-[#a9dc9b]/80" />
          <div className="absolute bottom-[32px] right-[-55px] h-[96px] w-[260px] rounded-[50%] bg-[#8fd18b]/75" />
          <div className="absolute inset-x-0 bottom-0 h-[60px] bg-[linear-gradient(180deg,#bde5a8,#a8d88f)]" />
        </>}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,.08)_0%,rgba(255,255,255,0)_58%,rgba(28,62,65,.08)_100%)]" />
        <Sparkles className="animate-questy-sparkle absolute right-[28px] top-[72px] z-20 text-white/95" size={16} strokeWidth={2.4} aria-hidden="true" />
        <Sparkles className="animate-questy-sparkle-delayed absolute left-[34px] top-[132px] z-20 text-[#fff3a8]" size={12} strokeWidth={2.4} aria-hidden="true" />
        <span className="animate-questy-shadow absolute bottom-[19px] left-1/2 z-10 h-[13px] w-[126px] -translate-x-1/2 rounded-full bg-[#284f54]/25 blur-[3px]" aria-hidden="true" />
        <QuestyPreview items={equippedPreviewItems} loading={questyQuery.isLoading} />
      </section>

      <section className="relative -mt-1 rounded-t-[28px] bg-[#f7faff] px-[16px] pb-10 pt-[15px] shadow-[0_-8px_24px_rgba(64,108,143,0.06)]">
        <div className="grid grid-cols-2 rounded-[17px] bg-[#e7f2fb] p-1">
          <ModeButton active={mode === "closet"} icon={Archive} label="내 보관함" onClick={() => setMode("closet")} />
          <ModeButton active={mode === "shop"} icon={Store} label="아이템 상점" onClick={() => setMode("shop")} />
        </div>

        <div className="mt-3 flex w-full gap-1 pb-1">
          {filters.map(({ id, label, icon: Icon }) => <button className={`flex h-8 min-w-0 flex-1 items-center justify-center gap-0.5 whitespace-nowrap rounded-full px-0.5 text-[7.5px] font-extrabold leading-none tracking-[-0.2px] transition ${filter === id ? "bg-[#55b1ed] text-white" : "bg-[#eaf3fa] text-[#8395a6]"}`} key={id} onClick={() => setFilter(id)} type="button"><Icon className="shrink-0" size={9} />{label}</button>)}
        </div>

        <div className="mb-3 mt-3 flex items-end justify-between px-1">
          <div><h2 className="text-[13px] font-extrabold">{mode === "closet" ? "보유 아이템" : "판매 아이템"}</h2><p className="mt-1 text-[8.5px] text-[#96a4b1]">{mode === "closet" ? "구매한 아이템과 배경을 여기에서 적용할 수 있어요." : "포인트로 구매하면 내 보관함에 추가돼요."}</p></div>
          {!isLoading && !activeError ? <span className="text-[9px] font-bold text-[#6baedf]">{items.length + backgroundItems.length}개</span> : null}
        </div>

        {isLoading ? <LoadingState /> : activeError ? <ErrorState message={getItemApiErrorMessage(activeError)} onRetry={retry} /> : items.length || backgroundItems.length ? (
          <div className="space-y-5">
            {items.length ? <section><div className="grid grid-cols-3 gap-2.5">{items.map((item) => <ItemCard item={item} key={item.id} mode={mode} pending={pendingItemId === item.id} onEquip={handleEquip} onPurchase={handlePurchase} />)}</div></section> : null}
            {backgroundItems.length ? <section className={items.length ? "border-t border-[#e4edf4] pt-5" : ""}>
              {items.length ? <h3 className="mb-2 px-1 text-[10px] font-extrabold text-[#6e8192]">배경 아이템</h3> : null}
              <div className="grid grid-cols-2 gap-3">{backgroundItems.map((item) => <BackgroundItemCard item={item} key={item.id} mode={mode} pending={pendingItemId === item.id} onEquip={handleEquip} onPurchase={handlePurchase} />)}</div>
            </section> : null}
          </div>
        ) : <EmptyState mode={mode} />}
      </section>

      {status ? <div className={`fixed bottom-[28px] left-1/2 z-[150] flex max-w-[calc(100%-32px)] -translate-x-1/2 items-center gap-2 rounded-full px-4 py-2.5 text-center text-[11px] font-bold text-white shadow-xl ${status.error ? "bg-[#d95861]" : "bg-[#25334a]"}`} role={status.error ? "alert" : "status"}>{status.error ? <AlertCircle className="shrink-0" size={14} /> : <Check className="shrink-0 text-[#6ed4ad]" size={14} />}{status.message}</div> : null}
    </main>
  );
}

function QuestyPreview({ items, loading }: { items: EquippedPreviewItem[]; loading: boolean }) {
  const localItemIds = items
    .map((item) => getLocalItem(item)?.id)
    .filter((itemId): itemId is (typeof localItemAssets)[number]["id"] => Boolean(itemId));
  const equippedAsset = getQuestyCombinationAsset(localItemIds);
  const remoteOnlyItems = items.filter((item) => item.category !== "BACKGROUND" && !getLocalItem(item) && !getLocalScene(item));

  return <div className="absolute bottom-[8px] left-1/2 z-10 h-[248px] w-[248px] -translate-x-1/2">
    <div className="animate-questy-dressup relative h-full w-full motion-reduce:animate-none">
      <img alt="꾸미기 중인 퀘스티" className="pointer-events-none absolute inset-0 h-full w-full object-contain drop-shadow-[0_13px_16px_rgba(27,57,72,.24)]" src={equippedAsset} />
      {!loading ? remoteOnlyItems.map((item) => <LayerImage item={item} key={item.itemId} />) : <span className="absolute inset-0 grid place-items-center"><LoaderCircle className="animate-spin text-white/90" size={24} /></span>}
    </div>
  </div>;
}

function LayerImage({ item }: { item: EquippedPreviewItem }) {
  const localAsset = getLocalItemAsset(item);
  return <img alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full object-contain" src={item.imageUrl || localAsset} onError={(event) => {
    if (localAsset && event.currentTarget.src !== localAsset) event.currentTarget.src = localAsset;
    else event.currentTarget.style.display = "none";
  }} />;
}

function ItemCard({ item, mode, pending, onEquip, onPurchase }: { item: DisplayItem; mode: ViewMode; pending: boolean; onEquip: (item: DisplayItem) => void; onPurchase: (item: DisplayItem) => void }) {
  const localAsset = getLocalItemAsset(item);
  return <article className={`relative grid min-h-[151px] content-start justify-items-center rounded-[18px] border bg-white px-2 pb-2.5 pt-3 text-center shadow-[0_4px_14px_rgba(50,87,117,0.06)] ${item.isEquipped ? "border-[#55b5f5] ring-2 ring-[#55b5f5]/15" : "border-[#e1e9f0]"}`}>
    {item.isEquipped ? <span className="absolute right-2 top-2 grid h-4 w-4 place-items-center rounded-full bg-[#55b5f5] text-white"><Check size={10} strokeWidth={3} /></span> : mode === "shop" && !item.isOwned ? <span className="absolute right-2 top-2 grid h-4 w-4 place-items-center rounded-full bg-[#293a53]/85 text-white"><Lock size={8} /></span> : null}
    <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-[15px] bg-[#edf7fe]"><img alt="" className="h-11 w-11 object-contain" src={localAsset || item.imageUrl || equippedAssetFallback} onError={(event) => {
      if (localAsset && event.currentTarget.src !== localAsset) event.currentTarget.src = localAsset;
      else if (event.currentTarget.src !== equippedAssetFallback) event.currentTarget.src = equippedAssetFallback;
      else event.currentTarget.style.display = "none";
    }} /></span>
    <strong className="mt-2 line-clamp-1 text-[10px] font-extrabold">{item.name}</strong>
    <span className="mt-0.5 text-[7px] font-bold text-[#9aa8b5]">{rarityLabel[item.rarity] ?? item.rarity}</span>
    {mode === "closet" ? <button className={`mt-2 h-6 w-full rounded-[8px] text-[8px] font-extrabold disabled:opacity-60 ${item.isEquipped ? "bg-[#eaf7ff] text-[#3ca5e8]" : "bg-[#55b1ed] text-white"}`} disabled={pending} onClick={() => onEquip(item)} type="button">{pending ? "처리 중..." : item.isEquipped ? "장착 해제" : "착용하기"}</button> : <button className={`mt-2 flex h-6 w-full items-center justify-center gap-1 rounded-[8px] text-[8px] font-extrabold disabled:opacity-60 ${item.isOwned ? "bg-[#eef3f7] text-[#8596a4]" : "bg-[#55b1ed] text-white"}`} disabled={pending || item.isOwned} onClick={() => onPurchase(item)} type="button">{pending ? "구매 중..." : item.isOwned ? "보유 중" : <><Zap size={8} fill="currentColor" strokeWidth={0} />{(item.price ?? 0).toLocaleString()}P</>}</button>}
  </article>;
}

function BackgroundItemCard({ item, mode, pending, onEquip, onPurchase }: { item: DisplayItem; mode: ViewMode; pending: boolean; onEquip: (item: DisplayItem) => void; onPurchase: (item: DisplayItem) => void }) {
  const matchedScene = getLocalScene(item);
  const scene = matchedScene ?? sceneItems[0];
  return <article className={`relative overflow-hidden rounded-[18px] border bg-white p-2 shadow-[0_5px_16px_rgba(50,87,117,0.07)] ${item.isEquipped ? "border-[#55b5f5] ring-2 ring-[#55b5f5]/15" : "border-[#e1e9f0]"}`}>
    {item.isEquipped ? <span className="absolute right-3 top-3 z-10 grid h-6 w-6 place-items-center rounded-full bg-[#55b5f5] text-white shadow-md"><Check size={13} strokeWidth={3} /></span> : mode === "shop" && !item.isOwned ? <span className="absolute right-3 top-3 z-10 grid h-6 w-6 place-items-center rounded-full bg-[#293a53]/90 text-white shadow-md"><Lock size={11} strokeWidth={2.8} /></span> : null}
    <ScenePreview fallbackImageUrl={matchedScene ? undefined : item.imageUrl} scene={scene} />
    <div className="px-1 pb-1 pt-2">
      <strong className="block min-w-0 truncate text-[10px] font-extrabold">{item.name}</strong>
      {mode === "closet" ? <button className={`mt-2 h-7 w-full rounded-[9px] text-[8px] font-extrabold ${item.isEquipped ? "bg-[#eef7fd] text-[#3ca5e8]" : "bg-[#55b1ed] text-white"}`} disabled={pending} onClick={() => onEquip(item)} type="button">{pending ? "처리 중..." : item.isEquipped ? "적용 해제" : "배경 적용"}</button> : <button className={`mt-2 flex h-7 w-full items-center justify-center gap-1 rounded-[9px] text-[8px] font-extrabold disabled:opacity-60 ${item.isOwned ? "bg-[#eef3f7] text-[#8596a4]" : "bg-[#55b1ed] text-white"}`} disabled={pending || item.isOwned} onClick={() => onPurchase(item)} type="button">{pending ? "구매 중..." : item.isOwned ? "보유 중" : <><Zap size={9} fill="currentColor" strokeWidth={0} />{(item.price ?? 0).toLocaleString()}P</>}</button>}
    </div>
  </article>;
}

function ScenePreview({ scene, fallbackImageUrl }: { scene: SceneItem; fallbackImageUrl?: string }) {
  const imageUrl = scene.image || fallbackImageUrl;
  return <div className="relative h-[92px] overflow-hidden rounded-[13px] bg-[linear-gradient(180deg,#c6ebff_0%,#edfaff_62%,#b9e4a9_63%,#a7d78f_100%)]">
    {imageUrl ? <img alt="" className="h-full w-full object-cover" src={imageUrl} /> : <><span className="absolute left-3 top-3 h-6 w-6 rounded-full bg-[#ffe574] shadow-[0_0_12px_rgba(255,220,76,.65)]" /><span className="absolute -bottom-4 -left-5 h-12 w-28 rounded-[50%] bg-[#9bd28f]" /><span className="absolute -bottom-5 right-[-18px] h-14 w-32 rounded-[50%] bg-[#80c77e]" /></>}
  </div>;
}

function LoadingState() {
  return <div className="grid min-h-[190px] place-items-center"><div className="text-center"><LoaderCircle className="mx-auto animate-spin text-[#55b1ed]" size={25} /><p className="mt-2 text-[10px] font-bold text-[#8295a6]">아이템을 불러오는 중이에요</p></div></div>;
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return <div className="grid min-h-[190px] place-items-center rounded-[20px] border border-dashed border-[#f0ced1] bg-white/70 px-5 text-center"><div><AlertCircle className="mx-auto text-[#dc6970]" size={25} /><p className="mt-2 break-keep text-[10px] font-extrabold text-[#6d7785]">{message}</p><button className="mt-3 h-8 rounded-[10px] bg-[#55b1ed] px-4 text-[9px] font-extrabold text-white" onClick={onRetry} type="button">다시 시도</button></div></div>;
}

function EmptyState({ mode }: { mode: ViewMode }) {
  return <div className="grid min-h-[190px] place-items-center rounded-[20px] border border-dashed border-[#dbe6ee] bg-white/60 px-5 text-center"><div><ShoppingBag className="mx-auto text-[#a9cce3]" size={25} /><p className="mt-2 text-[10px] font-extrabold text-[#7f93a5]">{mode === "shop" ? "판매 중인 아이템이 없어요" : "이 카테고리에 보유한 아이템이 없어요"}</p></div></div>;
}

function ModeButton({ active, icon: Icon, label, onClick }: { active: boolean; icon: ComponentType<{ size?: number; strokeWidth?: number }>; label: string; onClick: () => void }) {
  return <button className={`flex h-9 items-center justify-center gap-1.5 rounded-[13px] text-[10px] font-extrabold transition ${active ? "bg-white text-[#43a7e8] shadow-[0_2px_8px_rgba(46,92,124,0.1)]" : "text-[#94a3b2]"}`} onClick={onClick} type="button"><Icon size={14} strokeWidth={2.2} />{label}</button>;
}

import { getQuestyCombinationAsset } from "@/assets/customize/combinations";

export const LOCAL_EQUIPPED_QUESTY_KEY = "quespot-local-equipped-questy";

const ITEM_ALIASES = [
  { id: "explorer-hat", aliases: ["explorerhat", "탐험가모자"] },
  { id: "purple-sunglasses", aliases: ["purplesunglasses", "보라선글라스"] },
  { id: "red-scarf", aliases: ["redscarf", "빨간스카프"] },
  { id: "yellow-raincoat", aliases: ["yellowraincoat", "노란우비"] },
  { id: "explorer-vest", aliases: ["explorervest", "탐험조끼"] },
  { id: "travel-satchel", aliases: ["travelsatchel", "여행가방"] },
  { id: "magnifying-glass", aliases: ["magnifyingglass", "탐험돋보기"] },
] as const;

const normalizeItemKey = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9가-힣]/g, "");

export function getEquippedQuestyAsset(
  equippedItems: ReadonlyArray<{ name: string; code?: string }>,
) {
  const remoteIds = equippedItems
    .map((item) => {
      const key = normalizeItemKey(`${item.code ?? ""}${item.name}`);
      return ITEM_ALIASES.find(({ aliases }) =>
        aliases.some((alias) => key.includes(alias)),
      )?.id;
    })
    .filter((itemId): itemId is (typeof ITEM_ALIASES)[number]["id"] =>
      Boolean(itemId),
    );

  const itemIds = remoteIds.length > 0 ? remoteIds : readLocalEquippedItemIds();

  if (itemIds.length === 0) {
    return null;
  }

  try {
    return getQuestyCombinationAsset(itemIds);
  } catch {
    return null;
  }
}

function readLocalEquippedItemIds() {
  try {
    const stored = JSON.parse(
      localStorage.getItem(LOCAL_EQUIPPED_QUESTY_KEY) ?? "{}",
    ) as Record<string, unknown>;

    return Object.values(stored).filter(
      (itemId): itemId is string => typeof itemId === "string",
    );
  } catch {
    return [];
  }
}

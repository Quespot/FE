const combinationAssets = import.meta.glob("./combinations/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const itemOrder = [
  "explorer-hat",
  "purple-sunglasses",
  "red-scarf",
  "yellow-raincoat",
  "explorer-vest",
  "travel-satchel",
  "magnifying-glass",
] as const;

export function getQuestyCombinationAsset(itemIds: readonly string[]) {
  const equipped = new Set(itemIds);
  const orderedItemIds = itemOrder.filter((itemId) => equipped.has(itemId));
  const name = orderedItemIds.join("__") || "base";
  const asset = combinationAssets[`./combinations/${name}.png`];

  if (asset) return asset;

  // 서버 상태와 로컬 상태가 충돌해 존재하지 않는 조합이 만들어져도
  // 화면 전체를 중단하지 않고, 가장 많은 아이템을 유지하는 조합을 찾는다.
  const candidates = Array.from(
    { length: 2 ** orderedItemIds.length },
    (_, mask) => mask,
  ).sort(
    (left, right) =>
      countBits(right) - countBits(left) || right - left,
  );

  for (const mask of candidates) {
    const fallbackName =
      orderedItemIds
        .filter((_, index) => (mask & (1 << index)) !== 0)
        .join("__") || "base";
    const fallbackAsset =
      combinationAssets[`./combinations/${fallbackName}.png`];

    if (fallbackAsset) return fallbackAsset;
  }

  return combinationAssets["./combinations/base.png"];
}

function countBits(value: number) {
  let count = 0;

  while (value > 0) {
    count += value & 1;
    value >>= 1;
  }

  return count;
}

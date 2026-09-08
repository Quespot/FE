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
  const name = itemOrder.filter((itemId) => equipped.has(itemId)).join("__") || "base";
  const asset = combinationAssets[`./combinations/${name}.png`];

  if (!asset) {
    throw new Error(`Missing Questy combination asset: ${name}`);
  }

  return asset;
}

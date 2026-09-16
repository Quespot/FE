import { isAxiosError } from "axios";

import { apiClient } from "@/apis/client";

export type ItemCategory = "HAT" | "ACCESSORY" | "OUTFIT" | "ITEM" | "BACKGROUND";
export type ItemRarity = "NORMAL" | "RARE" | "EPIC" | "LEGENDARY" | string;

type ApiEnvelope<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
  errorDetail?: string;
};

export interface ShopItem {
  id: number;
  code: string;
  name: string;
  category: ItemCategory;
  rarity: ItemRarity;
  price: number;
  imageUrl: string;
  isFeatured: boolean;
  isDefault: boolean;
}

export interface OwnedItem {
  itemId: number;
  name: string;
  category: ItemCategory;
  rarity: ItemRarity;
  imageUrl: string;
  isEquipped: boolean;
  purchasedAt: string;
  equippedAt: string | null;
}

export interface EquippedItem {
  itemId: number;
  category: ItemCategory;
  name: string;
  imageUrl: string;
  rarity: ItemRarity;
}

export interface QuestySummary {
  equippedItems: EquippedItem[];
  ownedItemCount: number;
  highestRarity: ItemRarity;
}

export interface PurchaseResult {
  itemId: number;
  paidPoint: number;
  balance: number;
}

async function requestResult<T>(request: Promise<{ data: ApiEnvelope<T> }>) {
  const { data } = await request;
  if (!data.isSuccess) throw new Error(data.message || "요청을 처리하지 못했습니다.");
  return data.result;
}

export const getMyQuesty = () =>
  requestResult(apiClient.get<ApiEnvelope<QuestySummary>>("/api/users/me/questy"));

export const getMyItems = () =>
  requestResult(apiClient.get<ApiEnvelope<OwnedItem[]>>("/api/users/me/items"));

export const getShopItems = (category?: ItemCategory) =>
  requestResult(apiClient.get<ApiEnvelope<ShopItem[]>>("/api/shop/items", {
    params: category ? { category } : undefined,
  }));

export const purchaseItem = (itemId: number) =>
  requestResult(apiClient.post<ApiEnvelope<PurchaseResult>>(`/api/shop/items/${itemId}/purchase`));

export const equipItem = (itemId: number) =>
  requestResult(apiClient.post<ApiEnvelope<unknown>>(`/api/users/me/items/${itemId}/equip`));

export const unequipItem = (itemId: number) =>
  requestResult(apiClient.delete<ApiEnvelope<unknown>>(`/api/users/me/items/${itemId}/equip`));

export function getItemApiErrorMessage(error: unknown) {
  if (isAxiosError<ApiEnvelope<unknown>>(error)) {
    if (!error.response) return "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.";
    return error.response.data?.message || "요청을 처리하지 못했습니다.";
  }
  return error instanceof Error ? error.message : "요청을 처리하지 못했습니다.";
}

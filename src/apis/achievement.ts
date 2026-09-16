import { isAxiosError } from "axios";

import { apiClient } from "@/apis/client";

type ApiEnvelope<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
  errorDetail?: string;
};

export interface AchievementSummary {
  completedMissionCount: number;
  totalPoint: number;
  acquiredBadgeCount: number;
  totalBadgeCount: number;
  acquiredStampCount: number;
  totalStampCount: number;
}

export async function getMyAchievements(): Promise<AchievementSummary> {
  const { data } = await apiClient.get<ApiEnvelope<AchievementSummary>>(
    "/api/users/me/achievements",
  );

  if (!data.isSuccess) {
    throw new Error(data.message || "달성 현황을 불러오지 못했습니다.");
  }

  return data.result;
}

export function getAchievementErrorMessage(error: unknown) {
  if (isAxiosError<ApiEnvelope<unknown>>(error)) {
    if (!error.response) return "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.";
    return error.response.data?.message || "달성 현황을 불러오지 못했습니다.";
  }

  return error instanceof Error ? error.message : "달성 현황을 불러오지 못했습니다.";
}

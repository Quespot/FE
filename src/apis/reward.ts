import { apiClient } from "@/apis/client";
import type { CommonResponse } from "@/types/api";

// 스탬프
export interface Stamp {
  id: number;
  code: string;
  name: string;
  regionCode: string;
  iconUrl: string;
  isActive: boolean;
  acquired: boolean;
  acquiredAt: string;
}

// 스탬프 목록 조회 응답
export interface UserStamps {
  stamps: Stamp[];
}

// 보상 활동 유형
export type RewardActivityType =
  | "POINT_EARNED"
  | "POINT_SPENT"
  | "BADGE_ACQUIRED"
  | "STAMP_ACQUIRED";

// 보상 활동 내역 항목
export interface RewardActivity {
  id: number;
  activityType: RewardActivityType;
  title: string;
  amount: number | null;
  createdAt: string;
}

// 보상 활동 내역 조회 응답
export interface RewardActivities {
  activities: RewardActivity[];
  nextCursor: number | null;
  hasNext: boolean;
}

// 보상 활동 내역 조회 파라미터
export interface RewardActivitiesParams {
  cursor?: number;
  size?: number;
}

// 보유 포인트 조회 응답
export interface UserPoints {
  balance: number;
  totalEarned: number;
  totalSpent: number;
}

// 배지
export interface Badge {
  id: number;
  code: string;
  name: string;
  description: string;
  iconUrl: string;
  acquired: boolean;
  acquiredAt: string;
}

// 배지 목록 조회 응답
export interface UserBadges {
  badges: Badge[];
}

// 달성 현황 요약 응답
export interface UserAchievements {
  completedMissionCount: number;
  totalPoint: number;
  acquiredBadgeCount: number;
  totalBadgeCount: number;
  acquiredStampCount: number;
  totalStampCount: number;
}

// 스탬프 목록 조회
// GET /api/users/me/stamps
export const getUserStamps = async (): Promise<UserStamps> => {
  const response = await apiClient.get<CommonResponse<UserStamps>>(
    "/api/users/me/stamps",
  );

  return response.data.result;
};

// 보상 활동 내역 조회
// GET /api/users/me/reward-activities
export const getRewardActivities = async (
  params: RewardActivitiesParams = {},
): Promise<RewardActivities> => {
  const response = await apiClient.get<CommonResponse<RewardActivities>>(
    "/api/users/me/reward-activities",
    {
      params: {
        ...params,
        size: params.size ?? 20,
      },
    },
  );

  return response.data.result;
};

// 보유 포인트 조회
// GET /api/users/me/points
export const getUserPoints = async (): Promise<UserPoints> => {
  const response = await apiClient.get<CommonResponse<UserPoints>>(
    "/api/users/me/points",
  );

  return response.data.result;
};

// 배지 목록 조회
// GET /api/users/me/badges
export const getUserBadges = async (): Promise<UserBadges> => {
  const response = await apiClient.get<CommonResponse<UserBadges>>(
    "/api/users/me/badges",
  );

  return response.data.result;
};

// 달성 현황 요약
// GET /api/users/me/achievements
export const getUserAchievements = async (): Promise<UserAchievements> => {
  const response = await apiClient.get<CommonResponse<UserAchievements>>(
    "/api/users/me/achievements",
  );

  return response.data.result;
};

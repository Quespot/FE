import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getUserStamps,
  getRewardActivities,
  getUserPoints,
  getUserBadges,
  getUserAchievements,
} from "@/apis/reward";

// 스탬프 목록
export const useUserStamps = () =>
  useQuery({
    queryKey: ["rewards", "stamps"],
    queryFn: getUserStamps,
  });

// 보유 포인트
export const useUserPoints = () =>
  useQuery({
    queryKey: ["rewards", "points"],
    queryFn: getUserPoints,
  });

// 배지 목록
export const useUserBadges = () =>
  useQuery({
    queryKey: ["rewards", "badges"],
    queryFn: getUserBadges,
  });

// 달성 현황
export const useUserAchievements = () =>
  useQuery({
    queryKey: ["rewards", "achievements"],
    queryFn: getUserAchievements,
  });

// 보상 활동 내역:
export const useRewardActivities = (size = 20) =>
  useInfiniteQuery({
    queryKey: ["rewards", "activities", size],
    initialPageParam: undefined as number | undefined,
    queryFn: ({ pageParam }) =>
      getRewardActivities({
        cursor: pageParam,
        size,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
  });

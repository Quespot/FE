import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import {
  getNotifications,
  getUnreadNotificationCount,
  getNotificationSettings,
} from "@/apis/notification";

// 쿼리 키
export const notificationKeys = {
  all: ["notifications"] as const,
  lists: ["notifications", "list"] as const,
  list: (size: number) => ["notifications", "list", size] as const,
  unreadCount: ["notifications", "unread-count"] as const,
  settings: ["notifications", "settings"] as const,
};

// 알림 목록 조회: 커서 기반 무한 스크롤
export const useNotifications = (size = 20) =>
  useInfiniteQuery({
    queryKey: notificationKeys.list(size),
    queryFn: ({ pageParam }) =>
      getNotifications({
        cursor: pageParam,
        size,
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage, _pages, _lastParam, pageParams) => {
      const cursor = lastPage.nextCursor;
      return lastPage.hasNext && cursor != null && !pageParams.includes(cursor)
        ? cursor
        : undefined;
    },
    staleTime: 30 * 1000,
  });

// 미읽음 알림 개수 조회
export const useUnreadNotificationCount = () =>
  useQuery({
    queryKey: notificationKeys.unreadCount,
    queryFn: getUnreadNotificationCount,
    staleTime: 30 * 1000,
  });

// 알림 설정 조회
export const useNotificationSettings = () =>
  useQuery({
    queryKey: notificationKeys.settings,
    queryFn: getNotificationSettings,
    staleTime: 5 * 60 * 1000,
  });

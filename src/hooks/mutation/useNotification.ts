import {
  deleteFcmToken,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  registerFcmToken,
  updateNotificationSettings,
} from "@/apis/notification";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationKeys } from "../queries/useNotification";

// 알림 설정 변경
export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateNotificationSettings,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: notificationKeys.settings,
      });
    },
  });
};

// 알림 하나 읽음 처리
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: notificationKeys.lists,
        }),
        queryClient.invalidateQueries({
          queryKey: notificationKeys.unreadCount,
        }),
      ]);
    },
  });
};

// 알림 전체 읽음 처리
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: notificationKeys.lists,
        }),
        queryClient.invalidateQueries({
          queryKey: notificationKeys.unreadCount,
        }),
      ]);
    },
  });
};

// FCM 토큰 등록
export const useRegisterFcmToken = () =>
  useMutation({
    mutationFn: registerFcmToken,
  });

// FCM 토큰 해제
export const useDeleteFcmToken = () =>
  useMutation({
    mutationFn: deleteFcmToken,
  });

import { apiClient } from "@/apis/client";
import type { CommonResponse } from "@/types/api";

// 알림 유형
export type NotificationType = "MISSION_RECOMMENDATION";

// 딥링크 대상 유형
export type NotificationReferenceType = "MISSION";

// 기기 유형
export type DeviceType = "ANDROID" | "IOS" | "WEB";

// 알림 항목
export interface NotificationItem {
  id: number;
  type: NotificationType;
  title: string;
  body: string;
  referenceType: NotificationReferenceType | null;
  referenceId: number | null;
  read: boolean;
  createdAt: string;
}

// 알림 목록 조회 응답
export interface Notifications {
  notifications: NotificationItem[];
  nextCursor: number | null;
  hasNext: boolean;
}

// 알림 목록 조회 파라미터
export interface NotificationsParams {
  cursor?: number;
  size?: number;
}

// 미읽음 알림 개수 조회 응답
export interface UnreadNotificationCount {
  unreadCount: number;
}

// 알림 설정 조회·변경 응답
export interface NotificationSettings {
  pushEnabled: boolean;
}

// 알림 설정 변경 요청
export interface UpdateNotificationSettingsParams {
  pushEnabled: boolean;
}

// FCM 토큰 등록 요청
export type RegisterFcmTokenParams = {
  token: string;
  deviceType: DeviceType;
} & (
  | {
      latitude: number;
      longitude: number;
    }
  | {
      latitude?: never;
      longitude?: never;
    }
);

// FCM 토큰 등록 응답
export interface RegisteredFcmToken {
  id: number;
  deviceType: DeviceType;
}

// 인앱 알림 목록 조회
// GET /api/notifications
export const getNotifications = async (
  params: NotificationsParams = {},
): Promise<Notifications> => {
  const response = await apiClient.get<CommonResponse<Notifications>>(
    "/api/notifications",
    {
      params: {
        ...params,
        size: params.size ?? 20,
      },
    },
  );

  return response.data.result;
};

// 미읽음 알림 개수 조회
// GET /api/notifications/unread-count
export const getUnreadNotificationCount =
  async (): Promise<UnreadNotificationCount> => {
    const response = await apiClient.get<
      CommonResponse<UnreadNotificationCount>
    >("/api/notifications/unread-count");

    return response.data.result;
  };

// 알림 설정 조회
// GET /api/users/me/notification-settings
export const getNotificationSettings =
  async (): Promise<NotificationSettings> => {
    const response = await apiClient.get<CommonResponse<NotificationSettings>>(
      "/api/users/me/notification-settings",
    );

    return response.data.result;
  };

// 알림 설정 변경
// PATCH /api/users/me/notification-settings
export const updateNotificationSettings = async (
  params: UpdateNotificationSettingsParams,
): Promise<NotificationSettings> => {
  const response = await apiClient.patch<CommonResponse<NotificationSettings>>(
    "/api/users/me/notification-settings",
    params,
  );

  return response.data.result;
};

// 알림 읽음 처리
// PATCH /api/notifications/{notificationId}/read
export const markNotificationAsRead = async (
  notificationId: number,
): Promise<string> => {
  const response = await apiClient.patch<CommonResponse<string>>(
    `/api/notifications/${notificationId}/read`,
  );

  return response.data.result;
};

// 알림 전체 읽음 처리
// PATCH /api/notifications/read-all
export const markAllNotificationsAsRead = async (): Promise<string> => {
  const response = await apiClient.patch<CommonResponse<string>>(
    "/api/notifications/read-all",
  );

  return response.data.result;
};

// FCM 토큰 등록
// POST /api/notifications/fcm-tokens
export const registerFcmToken = async (
  params: RegisterFcmTokenParams,
): Promise<RegisteredFcmToken> => {
  const response = await apiClient.post<CommonResponse<RegisteredFcmToken>>(
    "/api/notifications/fcm-tokens",
    params,
  );

  return response.data.result;
};

// FCM 토큰 해제
// DELETE /api/notifications/fcm-tokens
export const deleteFcmToken = async (token: string): Promise<string> => {
  const response = await apiClient.delete<CommonResponse<string>>(
    "/api/notifications/fcm-tokens",
    {
      params: { token },
    },
  );

  return response.data.result;
};

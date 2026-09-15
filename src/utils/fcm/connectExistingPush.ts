import { getNotificationSettings, registerFcmToken } from "@/apis/notification";
import { requestFcmToken } from "./fcm";

export async function connectExistingPush() {
  try {
    const settings = await getNotificationSettings();

    // 서버에서 알림이 꺼져 있으면 그대로 유지
    if (!settings.pushEnabled) return;

    // 로그인 중에는 권한 창을 띄우지 않음
    if (
      typeof Notification === "undefined" ||
      Notification.permission !== "granted"
    ) {
      return;
    }

    const token = await requestFcmToken();

    await registerFcmToken({
      token,
      deviceType: "WEB",
    });
  } catch (error) {
    // 알림 연결 실패가 로그인 실패로 처리되지 않도록 분리
    console.error("푸시 알림 연결에 실패했습니다.", error);
  }
}

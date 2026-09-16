import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { firebaseApp, FIREBASE_VAPID_KEY } from "./firebase";

export async function requestFcmToken(): Promise<string> {
  if (
    typeof window === "undefined" ||
    !window.isSecureContext ||
    !("Notification" in window) ||
    !("serviceWorker" in navigator)
  ) {
    throw new Error("이 환경에서는 웹 푸시를 사용할 수 없어요.");
  }

  // 버튼을 눌렀을 때 알림 권한 요청
  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    throw new Error("브라우저에서 알림을 허용해 주세요.");
  }

  if (!(await isSupported())) {
    throw new Error("이 브라우저에서는 FCM을 지원하지 않아요.");
  }

  const registration = await navigator.serviceWorker.register(
    `${import.meta.env.BASE_URL}firebase-messaging-sw.js`,
  );

  const messaging = getMessaging(firebaseApp);

  const token = await getToken(messaging, {
    vapidKey: FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: registration,
  });

  if (!token) {
    throw new Error("알림 토큰을 발급받지 못했어요.");
  }
  localStorage.setItem("quespot-fcm-token", token);

  return token;
}

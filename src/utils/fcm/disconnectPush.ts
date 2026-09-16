import {
  deleteToken as deleteFirebaseToken,
  getMessaging,
  isSupported,
} from "firebase/messaging";
import { deleteFcmToken } from "@/apis/notification";
import { firebaseApp } from "@/utils/fcm/firebase";

export async function disconnectPush() {
  const token = localStorage.getItem("quespot-fcm-token");

  try {
    // 로그인 정보가 남아 있을 때 서버 등록 해제
    if (token) {
      await deleteFcmToken(token);
      localStorage.removeItem("quespot-fcm-token");
    }
  } finally {
    // 서버 요청이 실패해도 브라우저의 푸시 구독 해제 시도
    if (await isSupported()) {
      await deleteFirebaseToken(getMessaging(firebaseApp));
    }
  }
}

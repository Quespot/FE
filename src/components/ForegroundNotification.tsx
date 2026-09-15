import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getMessaging, isSupported, onMessage } from "firebase/messaging";
import { Bell, X } from "lucide-react";
import { getAccessToken } from "@/utils/auth";
import { firebaseApp } from "@/utils/fcm/firebase";

type ToastNotification = {
  title: string;
  body: string;
};

export default function ForegroundNotification() {
  const queryClient = useQueryClient();
  const [notification, setNotification] = useState<ToastNotification | null>(
    null,
  );

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    const startListening = async () => {
      try {
        if (!(await isSupported()) || !active) return;

        const messaging = getMessaging(firebaseApp);

        unsubscribe = onMessage(messaging, (payload) => {
          // 로그아웃 상태에서는 화면에 표시하지 않음
          if (!active || !getAccessToken()) return;

          void queryClient.invalidateQueries({
            queryKey: ["notifications", "list"],
          });

          void queryClient.invalidateQueries({
            queryKey: ["notifications", "unread-count"],
          });

          setNotification({
            title:
              payload.notification?.title ||
              payload.data?.title ||
              "새로운 알림이 도착했어요",
            body:
              payload.notification?.body ||
              payload.data?.body ||
              "알림함에서 내용을 확인해 주세요.",
          });

          // 새 알림이 오면 다시 5초부터 시작
          if (hideTimer) clearTimeout(hideTimer);

          hideTimer = setTimeout(() => {
            setNotification(null);
          }, 5000);
        });
      } catch (error) {
        console.error("실시간 알림 수신 연결에 실패했습니다.", error);
      }
    };

    void startListening();

    return () => {
      active = false;
      unsubscribe?.();

      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [queryClient]);

  if (!notification) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-[max(16px,env(safe-area-inset-top))] z-[100] flex justify-center px-4">
      <section
        aria-label="새 알림"
        className="
          pointer-events-auto flex w-full max-w-[398px] items-start gap-3
          rounded-2xl border border-[#D5EAFE] bg-white p-4
          shadow-[0_8px_30px_rgba(62,102,142,0.16)]
        "
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#EAF5FF] text-[#399FDF]">
          <Bell size={20} aria-hidden="true" />
        </span>

        <div className="min-w-0 flex-1" role="status" aria-atomic="true">
          <p className="break-words text-sm font-bold text-[#252743]">
            {notification.title}
          </p>

          <p className="mt-1 break-words text-xs leading-relaxed text-[#667085]">
            {notification.body}
          </p>
        </div>

        <button
          type="button"
          aria-label="알림 닫기"
          onClick={() => setNotification(null)}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[#8B939E] hover:bg-[#F4F8FF]"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </section>
    </div>
  );
}

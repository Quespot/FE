import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { isSupported } from "firebase/messaging";
import { Bell } from "lucide-react";
import { SubHeader } from "@/components/DeviceFrame";
import { NotificationCard } from "@/components/common/NotificationCard";
import {
  useNotifications,
  useNotificationSettings,
} from "@/hooks/queries/useNotification";
import {
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
} from "@/hooks/mutation/useNotification";
import {
  registerFcmToken,
  updateNotificationSettings,
} from "@/apis/notification";
import { requestFcmToken } from "@/utils/fcm/fcm";

function getPermission(): NotificationPermission {
  return typeof Notification === "undefined"
    ? "default"
    : Notification.permission;
}

export default function NotificationPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [permission, setPermission] = useState(getPermission);
  const [supported, setSupported] = useState<boolean | null>(null);

  // 브라우저의 푸시 지원 여부 확인
  useEffect(() => {
    let active = true;

    isSupported()
      .then((result) => {
        if (active) {
          setSupported(result && window.isSecureContext);
        }
      })
      .catch(() => {
        if (active) setSupported(false);
      });

    // 브라우저 설정을 변경한 후 돌아오면 권한 다시 확인
    const refreshPermission = () => {
      setPermission(getPermission());
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshPermission();
      }
    };

    window.addEventListener("focus", refreshPermission);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      active = false;
      window.removeEventListener("focus", refreshPermission);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // 계정의 알림 설정
  const {
    data: settings,
    isLoading: isSettingsLoading,
    isError: isSettingsError,
    isFetching: isSettingsFetching,
    refetch: refetchSettings,
  } = useNotificationSettings();

  // 알림 켜기
  const {
    mutate: enablePush,
    isPending: isEnableLoading,
    error: enableError,
  } = useMutation({
    mutationFn: async () => {
      if (!settings) {
        throw new Error("알림 설정을 먼저 확인해 주세요.");
      }

      const token = await requestFcmToken();

      await registerFcmToken({
        token,
        deviceType: "WEB",
      });

      if (!settings.pushEnabled) {
        await updateNotificationSettings({
          pushEnabled: true,
        });
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(["notifications", "settings"], {
        pushEnabled: true,
      });

      void queryClient.invalidateQueries({
        queryKey: ["notifications", "settings"],
      });
    },
    onSettled: () => {
      setPermission(getPermission());
    },
  });

  // 알림 목록
  const {
    data: notificationData,
    isPending: isNotificationPending,
    isError: isNotificationError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useNotifications();

  const notifications =
    notificationData?.pages.flatMap((page) => page.notifications) ?? [];

  // 하나 읽음 처리
  const {
    mutate: readNotification,
    isPending: isReadPending,
    isError: isReadError,
  } = useMarkNotificationAsRead();

  // 모두 읽음 처리
  const {
    mutate: readAllNotifications,
    isPending: isReadAllPending,
    isError: isReadAllError,
  } = useMarkAllNotificationsAsRead();

  const isReadUpdating = isReadPending || isReadAllPending;
  const handleRead = (id: number, read: boolean) => {
    if (read || isReadUpdating) return;
    readNotification(id);
  };

  const handleReadAll = () => {
    if (isReadUpdating) return;
    readAllNotifications();
  };

  // 알림 안내 표시 조건
  const showPushBanner =
    !isSettingsLoading &&
    settings !== undefined &&
    supported !== null &&
    !(supported && settings.pushEnabled && permission === "granted");

  const isBlocked = permission === "denied";
  const canEnablePush = supported === true && !isBlocked;

  const bannerTitle =
    supported === false
      ? "이 환경에서는 푸시 알림을 사용할 수 없어요"
      : isBlocked
        ? "브라우저에서 알림이 차단되어 있어요"
        : settings?.pushEnabled
          ? "이 브라우저에서도 알림을 받아보세요"
          : "새로운 미션 알림을 받아보세요";

  const bannerDescription =
    supported === false
      ? "알림함의 기존 알림은 계속 확인할 수 있어요."
      : isBlocked
        ? "브라우저의 사이트 설정에서 알림을 허용한 뒤 돌아와 주세요."
        : "푸시 알림을 허용하면 새 소식을 알려드려요.";

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F4F8FF]">
      <SubHeader
        title="알림함"
        onBack={() => navigate(-1)}
        action={
          <button
            className="
              inline-flex items-center gap-1 bg-transparent
              text-xs font-bold text-[var(--primary-soft)]
              disabled:cursor-not-allowed disabled:opacity-50
            "
            type="button"
            onClick={handleReadAll}
            disabled={isReadUpdating || isNotificationPending}
          >
            {isReadAllPending ? "처리 중..." : "모두 읽기"}
          </button>
        }
      />

      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* 알림 설정 조회 실패 */}
        {isSettingsError && !settings && (
          <div className="mb-2 rounded-2xl bg-white p-4">
            <p role="alert" className="text-sm text-[#667085]">
              알림 설정을 불러오지 못했어요.
            </p>

            <button
              type="button"
              onClick={() => void refetchSettings()}
              disabled={isSettingsFetching}
              className="mt-2 text-sm font-bold text-[#399FDF] disabled:opacity-50"
            >
              {isSettingsFetching ? "확인 중..." : "다시 시도"}
            </button>
          </div>
        )}

        {/* 푸시 알림 안내 */}
        {showPushBanner && (
          <section
            aria-label="푸시 알림 설정"
            className="mb-2 rounded-2xl border border-[#D5EAFE] bg-white p-4"
          >
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#EAF5FF] text-[#399FDF]">
                <Bell size={20} aria-hidden="true" />
              </span>

              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-bold text-[#252743]">
                  {bannerTitle}
                </h2>

                <p className="mt-1 text-xs leading-relaxed text-[#667085]">
                  {bannerDescription}
                </p>

                {canEnablePush && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!isEnableLoading) enablePush();
                    }}
                    disabled={isEnableLoading}
                    className="
                      mt-3 rounded-xl bg-[#5BB5F8] px-4 py-2
                      text-xs font-bold text-white
                      disabled:cursor-wait disabled:opacity-50
                    "
                  >
                    {isEnableLoading
                      ? "알림 연결 중..."
                      : settings?.pushEnabled
                        ? "이 브라우저에서 알림 허용"
                        : "알림 켜기"}
                  </button>
                )}

                {enableError && (
                  <p role="alert" className="mt-2 text-xs text-red-500">
                    {enableError instanceof Error
                      ? enableError.message
                      : "알림 연결에 실패했어요. 다시 시도해 주세요."}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {(isReadError || isReadAllError) && (
          <p role="alert" className="text-center text-sm text-red-500">
            읽음 처리에 실패했어요. 다시 시도해 주세요.
          </p>
        )}

        {isNotificationPending ? (
          <p className="py-10 text-center text-sm text-[#A2A9B2]">
            알림을 불러오는 중...
          </p>
        ) : isNotificationError && !notificationData ? (
          <div className="flex flex-col items-center gap-3 py-10">
            <p role="alert" className="text-sm text-[#A2A9B2]">
              알림을 불러오지 못했어요.
            </p>

            <button
              type="button"
              onClick={() => void refetch()}
              disabled={isFetching}
              className="text-sm font-bold text-[#5BB5F8]"
            >
              {isFetching ? "불러오는 중..." : "다시 시도"}
            </button>
          </div>
        ) : (
          <>
            {isNotificationError && !isFetchNextPageError && (
              <div className="text-center text-sm text-red-500">
                <p role="alert">최신 알림을 불러오지 못했어요.</p>

                <button
                  type="button"
                  onClick={() => void refetch()}
                  disabled={isFetching}
                  className="mt-1 font-bold"
                >
                  다시 시도
                </button>
              </div>
            )}

            {notifications.length === 0 && (
              <p className="py-10 text-center text-sm text-[#A2A9B2]">
                아직 알림이 없어요.
              </p>
            )}

            {/* 알림 목록 */}
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                id={notification.id}
                type={notification.type}
                title={notification.title}
                description={notification.body}
                createdAt={notification.createdAt}
                read={notification.read}
                onRead={handleRead}
              />
            ))}

            {/* 다음 페이지 조회 실패 */}
            {isFetchNextPageError && (
              <p role="alert" className="text-center text-sm text-red-500">
                다음 알림을 불러오지 못했어요. 더보기를 다시 눌러 주세요.
              </p>
            )}

            {/* 더보기 */}
            {hasNextPage && (
              <button
                type="button"
                onClick={() => void fetchNextPage()}
                disabled={isFetching || isReadUpdating}
                className="
                  mt-4 rounded-xl bg-white py-3
                  text-sm font-bold text-[#5BB5F8]
                  disabled:opacity-50
                "
              >
                {isFetchingNextPage ? "불러오는 중..." : "더보기"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

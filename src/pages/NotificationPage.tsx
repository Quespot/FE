import { SubHeader } from "@/components/DeviceFrame";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/hooks/queries/useNotification";
import {
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
} from "@/hooks/mutation/useNotification";
import { NotificationCard } from "@/components/common/NotificationCard";

export default function NotificationPage() {
  const navigate = useNavigate();

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
          /* 최초 조회 실패 */
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
            {notifications.map((notification) => {
              return (
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
              );
            })}

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

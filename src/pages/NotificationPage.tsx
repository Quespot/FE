import { SubHeader } from "@/components/DeviceFrame";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Target, Gift, MapPin, Bell, Medal } from "lucide-react";
import { ContentCard } from "@/components/common/ContentCard";

const initialNotifications = [
  {
    id: 1,
    icon: <Target size={21} className="text-sky-400" />,
    iconBg: "bg-sky-50",
    title: "새 미션이 열렸어요!",
    description: "'인사동 전통찻집 방문' 미션이 오픈됐어요.",
    time: "방금",
    unread: true,
  },
  {
    id: 2,
    icon: <Gift size={21} className="text-orange-400" />,
    iconBg: "bg-orange-50",
    title: "보상이 지급됐어요 🎉",
    description: "경복궁 미션 완료! +150P가 지급됐습니다.",
    time: "1시간 전",
    unread: true,
  },
  {
    id: 3,
    icon: <MapPin size={21} className="text-emerald-500" />,
    iconBg: "bg-emerald-50",
    title: "근처 미션을 발견했어요",
    description: "현재 위치 1.2km 내에 '경복궁' 미션이 있어요.",
    time: "2시간 전",
    unread: true,
  },
  {
    id: 4,
    icon: <Bell size={21} className="text-violet-400" />,
    iconBg: "bg-violet-50",
    title: "공지사항",
    description: "Questpot v1.2 업데이트 – 마스코트 꾸미기 기능 추가!",
    time: "어제",
    unread: false,
  },
  {
    id: 5,
    icon: <Medal size={21} className="text-orange-400" />,
    iconBg: "bg-orange-50",
    title: "배지를 획득했어요 🏅",
    description: "'탐험가' 배지를 획득했습니다. 축하해요!",
    time: "어제",
    unread: false,
  },
  {
    id: 6,
    icon: <Target size={21} className="text-sky-400" />,
    iconBg: "bg-sky-50",
    title: "미션 리마인더",
    description: "저장한 '남산타워 야경' 미션을 완료해보세요.",
    time: "2일 전",
    unread: false,
  },
];

export default function NotificationPage() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(initialNotifications);

  // 하나 읽음 처리
  const handleRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification,
      ),
    );
  };

  // 모두 읽음 처리
  const handleReadAll = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        unread: false,
      })),
    );
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F4F8FF]">
      <SubHeader
        title="알림함"
        onBack={() => navigate(-1)}
        action={
          <button
            className="inline-flex items-center gap-1 bg-transparent text-xs font-bold text-[var(--primary-soft)]"
            type="button"
            onClick={handleReadAll}
          >
            모두 읽기
          </button>
        }
      />

      <div className="flex flex-1 flex-col gap-2 p-4">
        {notifications.map((notification) => (
          <ContentCard
            key={notification.id}
            onClick={() => handleRead(notification.id)}
            className={`
              relative cursor-pointer transition
              ${notification.unread ? "bg-white" : "!bg-[#F8FAFC]"}
            `}
          >
            <div className="flex gap-3">
              {/* 아이콘 */}
              <div
                className={`
                  flex h-12 w-12 shrink-0
                  items-center justify-center rounded-2xl
                  ${notification.iconBg}
                  ${notification.unread ? "" : "opacity-60"}
                `}
              >
                {notification.icon}
              </div>

              {/* 내용 */}
              <div className="flex min-w-0 flex-1 flex-col pr-4">
                <h3
                  className={`
                    text-[12px]
                    ${
                      notification.unread
                        ? "font-black text-[var(--ink)]"
                        : "font-semibold text-[#6F7782]"
                    }
                  `}
                >
                  {notification.title}
                </h3>

                <p
                  className={`
                    type-caption2
                    ${notification.unread ? "text-[#777B81]" : "text-[#9AA2AC]"}
                  `}
                >
                  {notification.description}
                </p>

                <p className="type-body5 pt-1 text-[#A2A9B2]">
                  {notification.time}
                </p>
              </div>

              {/* 안 읽은 알림 표시 */}
              {notification.unread && (
                <span
                  className="
                    absolute right-4 top-5
                    h-2.5 w-2.5 rounded-full
                    bg-[#5BB5F8]
                  "
                />
              )}
            </div>
          </ContentCard>
        ))}
      </div>
    </div>
  );
}

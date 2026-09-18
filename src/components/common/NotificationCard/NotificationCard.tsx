import { RewardActivityType } from "@/apis/reward";
import { ContentCard } from "../ContentCard";
import { Target, Wallet, Award, Mail, MapPin, Medal } from "lucide-react";

const notificationStyles = {
  POINT_EARNED: {
    icon: <Target size={18} strokeWidth={2.4} />,
    iconBg: "text-emerald-500 bg-emerald-50",
  },
  POINT_SPENT: {
    icon: <Wallet size={18} strokeWidth={2.4} />,
    iconBg: "text-red-500 bg-red-50",
  },
  BADGE_ACQUIRED: {
    icon: <Award size={18} strokeWidth={2.4} />,
    iconBg: "text-orange-400 bg-orange-50",
  },
  STAMP_ACQUIRED: {
    icon: <Mail size={18} strokeWidth={2.4} />,
    iconBg: "text-orange-400 bg-orange-50",
  },
  MISSION_RECOMMENDATION: {
    icon: <MapPin size={18} strokeWidth={2.4} />,
    iconBg: "text-violet-400 bg-violet-50",
  },
};
interface NotificationCardProps {
  type: RewardActivityType | "MISSION_RECOMMENDATION";
  id: number;
  title: string;
  description?: string;
  amount?: number | null;
  createdAt: string;
  read?: boolean;
  onRead?: (id: number, read: boolean) => void;
}

export function NotificationCard({
  type,
  id,
  title,
  description,
  amount,
  createdAt,
  read = false,
  onRead,
}: NotificationCardProps) {
  const unread = !read;
  const { icon, iconBg } = notificationStyles[type];
  return (
    <ContentCard
      key={id}
      onClick={() => onRead?.(id, read)}
      className={`relative cursor-pointer transition ${unread ? "bg-white" : "!bg-[#F8FAFC]"}`}
    >
      <div className="flex gap-3">
        {/* 아이콘 */}
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBg} ${unread ? "" : "opacity-60"}`}
        >
          {icon}
        </div>

        <div className="flex min-w-0 flex-1 flex-col pr-4">
          <h3
            className={`text-[12px] ${
              unread
                ? "font-black text-[var(--ink)]"
                : "font-semibold text-[#6F7782]"
            }`}
          >
            {title}
          </h3>

          {description && (
            <p
              className={`
                        type-caption2
                        ${unread ? "text-[#777B81]" : "text-[#9AA2AC]"}
                      `}
            >
              {description}
            </p>
          )}

          <p className="type-body5 pt-1 text-[#A2A9B2]">
            {createdAt.slice(0, 10)}
          </p>
        </div>

        <div className="h-full flex items-center">
          {amount && (
            <strong
              className={`
            "shrink-0 text-[14px] font-black leading-[20px]"
            ${type == "POINT_SPENT" ? "text-red-500" : "text-emerald-500"}`}
            >
              {type == "POINT_SPENT" ? "-" : "+"}
              {amount}P
            </strong>
          )}
          {(type == "BADGE_ACQUIRED" || type == "STAMP_ACQUIRED") && (
            <Medal size={25} className="shrink-0 text-orange-400" />
          )}
        </div>
        {/* 안 읽은 알림 표시 */}
        {unread && type == "MISSION_RECOMMENDATION" && (
          <span className="absolute right-4 top-5 h-2.5 w-2.5 rounded-full bg-[#5BB5F8]" />
        )}
      </div>
    </ContentCard>
  );
}

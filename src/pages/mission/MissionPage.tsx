import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  ChevronRight,
  Check,
  Landmark,
  Leaf,
  Lock,
  MapPin,
  Search,
  Sunrise,
  Utensils,
  type LucideIcon,
} from "lucide-react";

import HomeHeader from "@/components/home/HomeHeader";
import QuespotPageLayout, {
  QuespotDivider,
  QuespotPageContent,
} from "@/layouts/QuespotPageLayout";
import { PATH } from "@/routes/paths";
import QuestySvg from "@/assets/icons/Questy.svg";

type MissionCategory = "all" | "history" | "nature" | "food" | "night";
type MissionStatus = "completed" | "available" | "locked";

export type MissionItem = {
  id: number;
  title: string;
  location: string;
  address: string;
  distance: string;
  category: Exclude<MissionCategory, "all">;
  categoryLabel: string;
  iconKey: "building" | "landmark" | "leaf" | "food" | "night" | "lock";
  status: MissionStatus;
  points?: number;
  duration?: string;
};

const CATEGORY_TABS: {
  id: MissionCategory;
  label: string;
  icon?: LucideIcon;
}[] = [
  { id: "all", label: "전체" },
  { id: "history", label: "역사", icon: Building2 },
  { id: "nature", label: "자연", icon: Leaf },
  { id: "food", label: "음식", icon: Utensils },
  { id: "night", label: "야경", icon: Sunrise },
];

const iconMap: Record<MissionItem["iconKey"], LucideIcon> = {
  building: Building2,
  landmark: Landmark,
  leaf: Leaf,
  food: Utensils,
  night: Sunrise,
  lock: Lock,
};

const MISSIONS: MissionItem[] = [
  {
    id: 1,
    title: "경복궁 정문 인증샷",
    location: "경복궁",
    address: "서울 종로구",
    distance: "1.2km",
    category: "history",
    categoryLabel: "역사",
    iconKey: "building",
    status: "completed",
    points: 150,
    duration: "약 30분",
  },
  {
    id: 2,
    title: "북촌 한옥 골목 탐험",
    location: "북촌 한옥마을",
    address: "서울 종로구",
    distance: "2.1km",
    category: "history",
    categoryLabel: "문화",
    iconKey: "landmark",
    status: "completed",
    points: 150,
    duration: "약 30분",
  },
  {
    id: 3,
    title: "인사동 전통찻집 방문",
    location: "인사동",
    address: "서울 종로구",
    distance: "2.5km",
    category: "food",
    categoryLabel: "음식",
    iconKey: "food",
    status: "available",
    points: 120,
    duration: "약 25분",
  },
  {
    id: 4,
    title: "남산타워 야경 포착",
    location: "남산서울타워",
    address: "서울 용산구",
    distance: "4.8km",
    category: "night",
    categoryLabel: "야경",
    iconKey: "night",
    status: "available",
    points: 300,
    duration: "약 40분",
  },
  {
    id: 5,
    title: "해운대 일출 인증",
    location: "해운대 해수욕장",
    address: "부산 해운대구",
    distance: "325km",
    category: "nature",
    categoryLabel: "자연",
    iconKey: "lock",
    status: "locked",
    points: 200,
    duration: "약 30분",
  },
];

const CATEGORY_STYLE: Record<
  Exclude<MissionCategory, "all">,
  {
    chip: string;
    iconPanel: string;
    iconText: string;
  }
> = {
  history: {
    chip: "bg-[#EEE1FF] text-[#8B5CF6]",
    iconPanel: "bg-[#EDE9FE]",
    iconText: "text-[#8B5CF6]",
  },
  nature: {
    chip: "bg-[#DFFBEE] text-[#65D3AE]",
    iconPanel: "bg-[#E7F5F0]",
    iconText: "text-[#B9C0CC]",
  },
  food: {
    chip: "bg-[#FFF0C9] text-[#E58A14]",
    iconPanel: "bg-[#FFF9DF]",
    iconText: "text-[#E58A14]",
  },
  night: {
    chip: "bg-[#DCE8FF] text-[#4A7DFF]",
    iconPanel: "bg-[#DCE8F5]",
    iconText: "text-[#4A7DFF]",
  },
};

export default function MissionPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] =
    useState<MissionCategory>("all");

  const filteredMissions = useMemo(() => {
    if (selectedCategory === "all") return MISSIONS;

    return MISSIONS.filter((mission) => mission.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <QuespotPageLayout>
      <HomeHeader
        mascotSrc={QuestySvg}
        notificationCount={3}
        onBellClick={() => {
          // TODO: 알림함 연결
        }}
      />

      <QuespotDivider />

      <section className="shrink-0 border-b border-[#EAF5FF] bg-white px-[16px] pb-[16px] pt-[24px]">
        <h1 className="m-0 text-[24px] font-black leading-[32px] text-[#1C1C3A]">
          미션 탐색
        </h1>

        <label className="mt-[20px] flex h-[48px] w-full items-center gap-[8px] rounded-[16px] bg-[#EAF5FF] px-[20px] text-[#A2A9B2]">
          <Search size={18} strokeWidth={2.2} />
          <input
            type="text"
            placeholder="미션 · 장소 검색"
            className="h-full min-w-0 flex-1 bg-transparent text-[14px] font-medium leading-[20px] text-[#1C1C3A] outline-none placeholder:text-[#A2A9B2]"
          />
        </label>

        <div className="no-scrollbar mt-[16px] flex max-w-full gap-[12px] overflow-x-auto overflow-y-hidden pb-[2px]">
          {CATEGORY_TABS.map((tab) => {
            const isActive = selectedCategory === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={[
                  "flex h-[40px] shrink-0 items-center justify-center gap-[6px] rounded-[20px] px-[18px] text-[15px] font-bold leading-[20px]",
                  isActive
                    ? "bg-[#5BB5F8] text-white"
                    : "bg-[#EAF5FF] text-[#A2A9B2]",
                ].join(" ")}
              >
                {Icon ? <Icon size={15} strokeWidth={2.2} /> : null}
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      <QuespotPageContent className="gap-[12px] px-[16px] py-[16px]">
        {filteredMissions.map((mission) => (
          <MissionListCard
            key={mission.id}
            mission={mission}
            onClick={() => {
              if (mission.status === "locked") return;

              navigate(PATH.MISSION_DETAIL, {
                state: {
                  mission,
                },
              });
            }}
          />
        ))}
      </QuespotPageContent>
    </QuespotPageLayout>
  );
}

type MissionListCardProps = {
  mission: MissionItem;
  onClick: () => void;
};

function MissionListCard({ mission, onClick }: MissionListCardProps) {
  const Icon = iconMap[mission.iconKey];
  const isCompleted = mission.status === "completed";
  const isLocked = mission.status === "locked";
  const style = CATEGORY_STYLE[mission.category];

  return (
    <article
      onClick={onClick}
      className={[
        "relative flex h-[112px] w-full shrink-0 overflow-hidden rounded-[16px] border border-[#EAF5FF] bg-white shadow-[0_2px_8px_rgba(8,37,95,0.08)]",
        isLocked
          ? "cursor-default opacity-60"
          : "cursor-pointer transition active:scale-[0.995]",
      ].join(" ")}
    >
      <div
        className={[
          "relative flex h-full w-[80px] shrink-0 items-center justify-center",
          style.iconPanel,
        ].join(" ")}
      >
        <Icon
          className={isLocked ? "text-[#B9C0CC]" : style.iconText}
          size={44}
          strokeWidth={2.2}
        />

        {isCompleted ? (
          <span className="absolute right-[-14px] top-[16px] grid h-[32px] w-[32px] place-items-center rounded-full border-[3px] border-white bg-[#00C950] text-white shadow-[0_2px_6px_rgba(0,0,0,0.14)]">
            <Check size={18} strokeWidth={3} />
          </span>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center px-[14px] py-[12px] pr-[44px]">
        <span
          className={[
            "inline-flex h-[28px] w-fit items-center gap-[4px] rounded-full px-[12px] text-[12px] font-bold leading-[16px]",
            style.chip,
          ].join(" ")}
        >
          <CategoryMiniIcon category={mission.category} />
          {mission.categoryLabel}
        </span>

        <div className="mt-[8px]">
          <p
            className={[
              "m-0 break-keep text-[14px] font-bold leading-[20px] tracking-[0px]",
              isLocked ? "text-[#C8CFD9]" : "text-[#1C1C3A]",
            ].join(" ")}
          >
            {mission.title}
          </p>

          <p
            className={[
              "mt-[4px] flex items-center gap-[5px] text-[10px] font-medium leading-[15px]",
              isLocked ? "text-[#C8CFD9]" : "text-[#A2A9B2]",
            ].join(" ")}
          >
            <MapPin size={11} strokeWidth={2.2} />
            <span>{mission.location}</span>
            <span>·</span>
            <span>{mission.distance}</span>
          </p>

          <div className="mt-[10px]">
            {isCompleted ? (
              <span className="inline-flex items-center gap-[4px] text-[11px] font-black leading-[16.5px] text-[#00C950]">
                <Check size={14} strokeWidth={3} />
                완료
              </span>
            ) : isLocked ? (
              <span className="inline-flex items-center gap-[4px] text-[11px] font-bold leading-[16.5px] text-[#B9C0CC]">
                <Lock size={13} strokeWidth={2.3} />
                잠김
              </span>
            ) : (
              <span className="text-[13px] font-black leading-[18px] text-[#5BB5F8]">
                +{mission.points}P
              </span>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label={`${mission.title} 상세보기`}
        className="absolute right-[14px] top-1/2 grid h-[24px] w-[24px] -translate-y-1/2 place-items-center text-[#C8E8FF]"
        onClick={(event) => {
          event.stopPropagation();

          if (mission.status === "locked") return;

          onClick();
        }}
      >
        <ChevronRight size={20} strokeWidth={2.6} />
      </button>
    </article>
  );
}

type CategoryMiniIconProps = {
  category: Exclude<MissionCategory, "all">;
};

function CategoryMiniIcon({ category }: CategoryMiniIconProps) {
  const iconMap: Record<Exclude<MissionCategory, "all">, LucideIcon> = {
    history: Building2,
    nature: Leaf,
    food: Utensils,
    night: Sunrise,
  };

  const Icon = iconMap[category];

  return <Icon size={12} strokeWidth={2.2} />;
}
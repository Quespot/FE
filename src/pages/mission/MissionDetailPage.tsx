import type { ReactNode } from "react";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Check,
  Clock3,
  Crosshair,
  Heart,
  Landmark,
  Leaf,
  Lock,
  MapPin,
  Sparkles,
  Sunrise,
  Utensils,
  Zap,
  type LucideIcon,
} from "lucide-react";

import HomeHeader from "@/components/home/HomeHeader";
import { PATH } from "@/routes/paths";
import QuestySvg from "@/assets/icons/Questy.svg";

type MissionCategory = "history" | "nature" | "food" | "night";
type MissionStatus = "completed" | "available" | "locked";

type MissionIconKey =
  | "building"
  | "landmark"
  | "leaf"
  | "food"
  | "night"
  | "lock";

type MissionFromList = {
  id: number;
  title: string;
  location: string;
  address: string;
  distance: string;
  category: MissionCategory;
  categoryLabel: string;
  iconKey: MissionIconKey;
  status: MissionStatus;
  points?: number;
  duration?: string;
};

type MissionDetailState = {
  mission?: MissionFromList;
};

type DetailMission = {
  id: number;
  title: string;
  place: string;
  address: string;
  distance: string;
  points: number;
  duration: string;
  category: MissionCategory;
  categoryLabel: string;
  status: MissionStatus;
  iconKey: MissionIconKey;
  description: string;
};

const iconMap: Record<MissionIconKey, LucideIcon> = {
  building: Building2,
  landmark: Landmark,
  leaf: Leaf,
  food: Utensils,
  night: Sunrise,
  lock: Lock,
};

const DEFAULT_MISSION: DetailMission = {
  id: 1,
  title: "경복궁 정문 인증샷",
  place: "경복궁",
  address: "서울 종로구",
  distance: "1.2km",
  points: 150,
  duration: "약 30분",
  category: "history",
  categoryLabel: "역사",
  status: "completed",
  iconKey: "building",
  description:
    "경복궁 정문 주변을 방문하고 GPS 인증과 사진 촬영을 통해 미션을 완료해보세요.",
};

const CATEGORY_STYLE: Record<
  MissionCategory,
  {
    hero: string;
    heroIcon: string;
    chipText: string;
    iconBg: string;
  }
> = {
  history: {
    hero: "bg-[#B794FF]",
    heroIcon: "text-[#8B5CF6]",
    chipText: "text-[#8B5CF6]",
    iconBg: "bg-[#EEE1FF]",
  },
  nature: {
    hero: "bg-[#7EE4BB]",
    heroIcon: "text-[#10B981]",
    chipText: "text-[#10B981]",
    iconBg: "bg-[#DFFBEE]",
  },
  food: {
    hero: "bg-[#FFD778]",
    heroIcon: "text-[#E58A14]",
    chipText: "text-[#E58A14]",
    iconBg: "bg-[#FFF0C9]",
  },
  night: {
    hero: "bg-[#92C7FF]",
    heroIcon: "text-[#3B82F6]",
    chipText: "text-[#3B82F6]",
    iconBg: "bg-[#DCE8FF]",
  },
};

const missionSteps = [
  "장소로 이동",
  "GPS 도착 인증",
  "사진 촬영 & 제출",
  "AI 자동 검증",
  "보상 수령",
];

export default function MissionDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as MissionDetailState | null;

  const mission = useMemo<DetailMission>(() => {
    if (!state?.mission) return DEFAULT_MISSION;

    return {
      id: state.mission.id,
      title: state.mission.title,
      place: state.mission.location,
      address: state.mission.address,
      distance: state.mission.distance,
      points: state.mission.points ?? 150,
      duration: state.mission.duration ?? "약 30분",
      category: state.mission.category,
      categoryLabel: state.mission.categoryLabel,
      status: state.mission.status,
      iconKey: state.mission.iconKey,
      description: `${state.mission.location}에서 진행하는 지역 탐험 미션입니다. 장소에 도착해 인증을 완료하고 보상 포인트를 받아보세요.`,
    };
  }, [state]);

  const Icon = iconMap[mission.iconKey] ?? Building2;
  const style = CATEGORY_STYLE[mission.category];

  const isCompleted = mission.status === "completed";

  return (
    <section className="flex min-h-full flex-1 flex-col overflow-y-auto bg-[#F4F8FF] pb-[24px]">
      <HomeHeader
        mascotSrc={QuestySvg}
        notificationCount={3}
        onBellClick={() => {
          // TODO: 알림함 연결
        }}
      />

      <section className="relative h-[220px] w-full overflow-hidden">
        <div
          className={[
            "absolute inset-0",
            style.hero,
            "bg-[linear-gradient(90deg,rgba(28,28,58,0.08)_1px,transparent_1px),linear-gradient(0deg,rgba(28,28,58,0.08)_1px,transparent_1px)] bg-[length:40px_40px]",
          ].join(" ")}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-[#F4F8FF]" />

        <Icon
          className={[
            "absolute left-1/2 top-[56px] h-[118px] w-[118px] -translate-x-1/2 opacity-20",
            style.heroIcon,
          ].join(" ")}
          strokeWidth={1.7}
        />

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-[24px] top-[24px] grid h-[44px] w-[44px] place-items-center rounded-full bg-white text-[#1C1C3A] shadow-[0_2px_8px_rgba(8,37,95,0.18)]"
          aria-label="뒤로가기"
        >
          <ArrowLeft size={22} strokeWidth={2.5} />
        </button>

        <button
          type="button"
          className="absolute right-[24px] top-[24px] grid h-[44px] w-[44px] place-items-center rounded-full bg-white text-[#A2A9B2] shadow-[0_2px_8px_rgba(8,37,95,0.18)]"
          aria-label="찜하기"
        >
          <Heart size={22} strokeWidth={2.3} />
        </button>

        <div className="absolute bottom-[34px] left-[24px] right-[24px]">
          <div className="flex items-center gap-[8px]">
            <span
              className={[
                "inline-flex h-[26px] items-center gap-[5px] rounded-full bg-white/85 px-[12px] text-[12px] font-black",
                style.chipText,
              ].join(" ")}
            >
              <Icon size={13} strokeWidth={2.4} />
              {mission.categoryLabel}
            </span>

            {isCompleted ? (
              <span className="inline-flex h-[26px] items-center gap-[5px] rounded-full bg-[#E8FBF3] px-[12px] text-[12px] font-black text-[#00C950]">
                <Check size={13} strokeWidth={3} />
                완료
              </span>
            ) : null}
          </div>

          <h1 className="m-0 mt-[10px] text-[22px] font-black leading-[30px] text-[#1C1C3A]">
            {mission.title}
          </h1>

          <p className="m-0 mt-[6px] flex items-center gap-[6px] text-[13px] font-medium text-[#A2A9B2]">
            <MapPin size={14} strokeWidth={2.2} />
            {mission.place}
            <span>·</span>
            {mission.address}
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-[16px] px-[16px] pt-[20px]">
        <div className="grid grid-cols-3 gap-[12px]">
          <InfoCard
            icon={<MapPin size={22} strokeWidth={2.4} />}
            iconClassName="bg-[#FFECEF] text-[#FF2D45]"
            value={mission.distance}
            label="거리"
          />

          <InfoCard
            icon={<Zap size={22} strokeWidth={2.4} />}
            iconClassName="bg-[#EAF5FF] text-[#5BB5F8]"
            value={`+${mission.points}P`}
            label="보상 포인트"
          />

          <InfoCard
            icon={<Clock3 size={22} strokeWidth={2.4} />}
            iconClassName="bg-[#FFF6D9] text-[#F59E0B]"
            value={mission.duration}
            label="예상 시간"
          />
        </div>

        <div className="h-[2px] rounded-full bg-[#EAF5FF]" />

        <section className="rounded-[16px] border border-[#EAF5FF] bg-white px-[16px] py-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <header className="flex items-center gap-[10px]">
            <span className="grid h-[28px] w-[28px] place-items-center rounded-full bg-[#EAF5FF] text-[#5BB5F8]">
              <Crosshair size={15} strokeWidth={2.4} />
            </span>
            <h2 className="m-0 text-[15px] font-black leading-[20px] text-[#1C1C3A]">
              수행 방법
            </h2>
          </header>

          <ol className="mt-[16px] flex flex-col gap-[12px] p-0">
            {missionSteps.map((step, index) => (
              <li
                key={step}
                className="grid grid-cols-[32px_minmax(0,1fr)_24px] items-center gap-[12px]"
              >
                <span className="grid h-[28px] w-[28px] place-items-center rounded-full bg-[#E8FBF3] text-[#00C950]">
                  <Check size={16} strokeWidth={3} />
                </span>

                <span className="text-[14px] font-bold leading-[20px] text-[#A2A9B2]">
                  {step}
                </span>

                <span className="grid h-[22px] w-[22px] place-items-center rounded-full bg-[#EAF5FF] text-[11px] font-black text-[#A2A9B2]">
                  {index + 1}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <div className="grid grid-cols-2 gap-[12px]">
          <SmallFeatureCard
            icon={<Utensils size={20} strokeWidth={2.4} />}
            iconClassName="bg-[#EAF5FF] text-[#5BB5F8]"
            title="주변 로컬"
            description="맛집 · 카페 추천"
          />

          <SmallFeatureCard
            icon={<Sparkles size={20} strokeWidth={2.4} />}
            iconClassName="bg-[#FFF6D9] text-[#F59E0B]"
            title="보너스 지역"
            description="추가 포인트 안내"
            highlighted
          />
        </div>

        <section className="flex items-center gap-[12px] rounded-[16px] border border-[#BBF7D0] bg-[#E8FBF3] px-[16px] py-[16px]">
          <span className="grid h-[48px] w-[48px] shrink-0 place-items-center rounded-[14px] bg-[#C6F7D9] text-[#00C950]">
            <Check size={26} strokeWidth={3} />
          </span>

          <div className="min-w-0 flex-1">
            <strong className="block text-[17px] font-black leading-[21px] text-[#008A3D]">
              미션 완료!
            </strong>
            <p className="m-0 mt-[4px] text-[14px] font-medium leading-[20px] text-[#00C950]">
              +{mission.points}P 보상이 지급됐어요
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(PATH.MISSION_RECORD)}
            className="flex h-[32px] min-w-[76px] shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-[#00D664] px-[12px] font-['Noto_Sans_KR'] text-[10px] font-black leading-none text-white"
          >
            기록 남기기
          </button>
        </section>

        <button
          type="button"
          onClick={() => navigate(PATH.MISSION_PHOTO)}
          className="mt-[4px] h-[52px] rounded-[16px] bg-[#5BB5F8] text-[15px] font-black text-white shadow-[0_8px_18px_rgba(91,181,248,0.28)]"
        >
          미션 다시 인증하기
        </button>
      </section>
    </section>
  );
}

type InfoCardProps = {
  icon: ReactNode;
  iconClassName: string;
  value: string;
  label: string;
};

function InfoCard({ icon, iconClassName, value, label }: InfoCardProps) {
  return (
    <article className="flex min-h-[96px] flex-col items-center justify-center rounded-[16px] border border-[#EAF5FF] bg-white px-[12px] py-[12px] text-center shadow-[0_1px_3px_rgba(0,0,0,0.12)]">
      <span
        className={[
          "grid h-[40px] w-[40px] place-items-center rounded-full",
          iconClassName,
        ].join(" ")}
      >
        {icon}
      </span>

      <strong className="mt-[10px] text-[15px] font-black leading-[18px] text-[#1C1C3A]">
        {value}
      </strong>

      <span className="mt-[4px] text-[11px] font-medium leading-[15px] text-[#A2A9B2]">
        {label}
      </span>
    </article>
  );
}

type SmallFeatureCardProps = {
  icon: ReactNode;
  iconClassName: string;
  title: string;
  description: string;
  highlighted?: boolean;
};

function SmallFeatureCard({
  icon,
  iconClassName,
  title,
  description,
  highlighted = false,
}: SmallFeatureCardProps) {
  return (
    <article
      className={[
        "relative flex h-[72px] items-center gap-[12px] rounded-[16px] border bg-white px-[12px] py-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.1)]",
        highlighted ? "border-[#FACC15]" : "border-[#EAF5FF]",
      ].join(" ")}
    >
      <span
        className={[
          "grid h-[40px] w-[40px] shrink-0 place-items-center rounded-full",
          iconClassName,
        ].join(" ")}
      >
        {icon}
      </span>

      <div className="min-w-0">
        <strong className="block font-['Noto_Sans_KR'] text-[13px] font-black leading-[18px] text-[#1C1C3A]">
          {title}
        </strong>

        <p className="m-0 mt-[2px] font-['Noto_Sans_KR'] text-[10px] font-medium leading-[14px] text-[#A2A9B2]">
          {description}
        </p>
      </div>
    </article>
  );
}
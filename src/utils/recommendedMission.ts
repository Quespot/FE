import type { RecommendedMissionCardItem } from "@/components/home/MissionCard";
import type {
  RecommendedMissionCategory,
  RecommendedMissionItem,
} from "@/types/mission";

const CATEGORY_META: Record<
  RecommendedMissionCategory,
  { label: string; visual: string; tone: string }
> = {
  HISTORY: { label: "역사", visual: "🏯", tone: "cream" },
  CULTURE: { label: "문화", visual: "🎨", tone: "lavender" },
  NATURE: { label: "자연", visual: "🌳", tone: "mint" },
  FOOD: { label: "음식", visual: "🍜", tone: "peach" },
  NIGHT_VIEW: { label: "야경", visual: "🌙", tone: "blue" },
  ETC: { label: "기타", visual: "✨", tone: "blue" },
};

export function toRecommendedMissionCard(
  mission: RecommendedMissionItem,
): RecommendedMissionCardItem {
  const meta = CATEGORY_META[mission.category] ?? CATEGORY_META.ETC;

  return {
    id: mission.missionId,
    title: mission.title,
    category: meta.label,
    distance: formatDistance(mission.distanceMeters),
    points: mission.rewardPoint,
    visual: meta.visual,
    tone: meta.tone,
    imageUrl: mission.imageUrl,
    liked: mission.liked,
  };
}

function formatDistance(distanceMeters: number | null) {
  if (distanceMeters === null) {
    return "거리 정보 없음";
  }

  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)}m`;
  }

  return `${(distanceMeters / 1000).toFixed(1)}km`;
}

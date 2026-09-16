import SectionHeader from "@/components/common/SectionHeader";
import MissionCard, {
  type RecommendedMissionCardItem,
} from "@/components/home/MissionCard";

type RecommendedMissionSectionProps = {
  missions: RecommendedMissionCardItem[];
  isLoading?: boolean;
  isError?: boolean;
  onShowAll: () => void;
  onRetry?: () => void;
  onMissionClick: (mission: RecommendedMissionCardItem) => void;
  onMissionLikeClick: (mission: RecommendedMissionCardItem) => void;
  pendingLikeMissionId?: string | number | null;
};

export default function RecommendedMissionSection({
  missions,
  isLoading = false,
  isError = false,
  onShowAll,
  onRetry,
  onMissionClick,
  onMissionLikeClick,
  pendingLikeMissionId,
}: RecommendedMissionSectionProps) {
  return (
    <section className="grid gap-[14px]">
      <SectionHeader
        title="추천 미션"
        actionLabel="전체보기"
        onActionClick={onShowAll}
      />

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3" aria-label="추천 미션 불러오는 중">
          {[0, 1].map((item) => (
            <div key={item} className="h-[210px] animate-pulse rounded-2xl bg-[#e5eef8]" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl bg-white px-4 py-6 text-center text-[13px] font-bold text-[#8d9bae]">
          추천 미션을 불러오지 못했어요.
          <button type="button" className="ml-2 text-[#5bb5f8]" onClick={onRetry}>다시 시도</button>
        </div>
      ) : missions.length === 0 ? (
        <div className="rounded-2xl bg-white px-4 py-7 text-center text-[13px] font-bold text-[#8d9bae]">
          지금 추천할 수 있는 미션이 없어요.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {missions.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              onClick={() => onMissionClick(mission)}
              onLikeClick={() => onMissionLikeClick(mission)}
              isLikePending={pendingLikeMissionId === mission.id}
            />
          ))}
        </div>
      )}
    </section>
  );
}

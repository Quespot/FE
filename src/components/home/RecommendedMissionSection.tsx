import SectionHeader from "@/components/common/SectionHeader";
import MissionCard from "@/components/home/MissionCard";

type Mission = {
  id: string | number;
  title: string;
  category: string;
  distance: string;
  points: number;
  visual: string;
  tone: string;
};

type RecommendedMissionSectionProps = {
  missions: Mission[];
  showAll: boolean;
  onToggleShowAll: () => void;
  onMissionClick: (mission: Mission) => void;
};

export default function RecommendedMissionSection({
  missions,
  showAll,
  onToggleShowAll,
  onMissionClick,
}: RecommendedMissionSectionProps) {
  return (
    <section className="grid gap-[14px]">
      <SectionHeader
        title="추천 미션"
        actionLabel={showAll ? "접기" : "전체보기"}
        onActionClick={onToggleShowAll}
      />

      <div className="grid grid-cols-2 gap-3">
        {missions.map((mission) => (
          <MissionCard
            key={mission.id}
            mission={mission}
            onClick={() => onMissionClick(mission)}
          />
        ))}
      </div>
    </section>
  );
}
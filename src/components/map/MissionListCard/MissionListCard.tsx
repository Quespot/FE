import type { DistrictMission } from "@/apis/missionSpot";
import Button from "@/components/common/Button";
import { PATH } from "@/routes/paths";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const missionStatusLabel = {
  AVAILABLE: "시작가능",
  IN_PROGRESS: "진행중",
  COMPLETED: "완료",
  LOCKED: "잠김",
} as const;

export default function MissionListCard({ mission }: { mission: DistrictMission }) {
  const navigate = useNavigate();

  return (
    <div className="rounded-[18px] border border-[#E5EDF7] p-4 flex justify-between">
      <div className="flex gap-2">
        <img src={mission.imageUrl} alt={`${mission.spotName} 사진`} className="size-10 rounded-md" />
        <div>
          <p className="type-body1 !font-black">{mission.title}</p>
          <p className="type-body3 text-[#A2A9B2]">
            {missionStatusLabel[mission.userMissionStatus]} | {mission.estimatedMinutes}분 | +{mission.rewardPoint}
          </p>
        </div>
      </div>
      <Button
        size="sm"
        variant="secondary"
        className="size-10 p-3!"
        aria-label={`${mission.title} 상세 보기`}
        onClick={() => navigate(PATH.MISSION_DETAIL.replace(":missionId", String(mission.missionId)))}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}

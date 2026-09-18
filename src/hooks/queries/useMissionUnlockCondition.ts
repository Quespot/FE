import { useQuery } from "@tanstack/react-query";

import { getMissionUnlockCondition } from "@/apis/missionAttempt";

export function useMissionUnlockCondition(missionId: number) {
  return useQuery({
    queryKey: ["missionUnlockCondition", missionId],
    queryFn: () => getMissionUnlockCondition(missionId),
    enabled: Number.isFinite(missionId) && missionId > 0,
    staleTime: 1000 * 30,
    retry: false,
  });
}
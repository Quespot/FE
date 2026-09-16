import { useQuery } from "@tanstack/react-query";

import { getMissionVerificationGuide } from "@/apis/missionAttempt";

export function useMissionVerificationGuide(attemptId?: number | null) {
  return useQuery({
    queryKey: ["missionVerificationGuide", attemptId],
    queryFn: () => getMissionVerificationGuide(attemptId as number),
    enabled: Boolean(attemptId),
    staleTime: 1000 * 60,
  });
}
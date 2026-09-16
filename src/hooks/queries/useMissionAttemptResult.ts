import { useQuery } from "@tanstack/react-query";

import { getMissionAttemptResult } from "@/apis/missionAttempt";

export function useMissionAttemptResult(attemptId?: number | null) {
  return useQuery({
    queryKey: ["missionAttemptResult", attemptId],
    queryFn: () => getMissionAttemptResult(attemptId as number),
    enabled: Boolean(attemptId),
    staleTime: 1000 * 30,
    retry: false,
  });
}
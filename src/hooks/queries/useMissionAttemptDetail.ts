import { useQuery } from "@tanstack/react-query";

import { getMissionAttemptDetail } from "@/apis/missionAttempt";

export function useMissionAttemptDetail(attemptId?: number | null) {
  const isValidAttemptId =
    typeof attemptId === "number" && Number.isFinite(attemptId) && attemptId > 0;

  return useQuery({
    queryKey: ["missionAttempt", attemptId],
    queryFn: () => getMissionAttemptDetail(attemptId as number),
    enabled: isValidAttemptId,
    staleTime: 0,
    refetchOnMount: "always",
    retry: false,
  });
}
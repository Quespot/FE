import { useQuery } from "@tanstack/react-query";

import { getMissionAttemptDetail } from "@/apis/missionAttempt";

export function useMissionAttemptDetail(attemptId?: number | null) {
  const isValidAttemptId =
    typeof attemptId === "number" && Number.isFinite(attemptId) && attemptId > 0;

  return useQuery({
    queryKey: ["missionAttempt", attemptId],
    queryFn: () => getMissionAttemptDetail(attemptId as number),
    enabled: isValidAttemptId,
    staleTime: 1000 * 10,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    retry: false,
  });
}
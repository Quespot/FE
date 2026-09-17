import { useQuery } from "@tanstack/react-query";

import { getMissionVerificationGuide } from "@/apis/missionAttempt";

export function useMissionVerificationGuide(attemptId?: number | null) {
  const isValidAttemptId =
    typeof attemptId === "number" && Number.isFinite(attemptId) && attemptId > 0;

  return useQuery({
    queryKey: ["missionVerificationGuide", attemptId],
    queryFn: () => getMissionVerificationGuide(attemptId as number),
    enabled: isValidAttemptId,
    staleTime: 1000 * 30,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    retry: false,
  });
}
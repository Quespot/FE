import { useMutation } from "@tanstack/react-query";

import { verifyMissionArrival } from "@/apis/missionAttempt";

export function useVerifyMissionArrival() {
  return useMutation({
    mutationFn: verifyMissionArrival,
  });
}
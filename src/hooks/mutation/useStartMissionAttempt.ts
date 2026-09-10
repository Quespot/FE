import { useMutation } from "@tanstack/react-query";

import { startMissionAttempt } from "@/apis/missionAttempt";

export function useStartMissionAttempt() {
  return useMutation({
    mutationFn: (missionId: number) => startMissionAttempt(missionId),
  });
}
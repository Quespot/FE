import { useMutation, useQueryClient } from "@tanstack/react-query";

import { verifyMissionArrival } from "@/apis/missionAttempt";

export function useVerifyMissionArrival() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: verifyMissionArrival,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["missionAttempts"] });
    },
  });
}

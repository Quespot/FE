import { useMutation, useQueryClient } from "@tanstack/react-query";

import { quitMissionAttempt } from "@/apis/missionAttempt";

export function useQuitMissionAttempt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (attemptId: number) => quitMissionAttempt(attemptId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["missionAttempts"] });
      void queryClient.invalidateQueries({ queryKey: ["missions"] });
    },
  });
}

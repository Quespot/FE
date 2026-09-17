import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createMissionReflection } from "@/apis/missionAttempt";
import type { MissionReflectionRequest } from "@/types/missionAttempt";

type CreateMissionReflectionParams = {
  attemptId: number;
  body: MissionReflectionRequest;
};

export function useCreateMissionReflection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ attemptId, body }: CreateMissionReflectionParams) =>
      createMissionReflection({
        attemptId,
        body,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["missionAttempt", variables.attemptId],
      });

      queryClient.invalidateQueries({
        queryKey: ["missionAttempts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["missionAttemptResult", variables.attemptId],
      });

      queryClient.invalidateQueries({
        queryKey: ["archives"],
      });
    },
  });
}
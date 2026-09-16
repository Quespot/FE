import { useMutation } from "@tanstack/react-query";

import { createMissionPhoto } from "@/apis/missionAttempt";

export function useCreateMissionPhoto() {
  return useMutation({
    mutationFn: createMissionPhoto,
  });
}
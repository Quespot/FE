import { useMutation, useQueryClient } from "@tanstack/react-query";

import { likeMission } from "@/apis/like";

export function useLikeMission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (missionId: number) => likeMission(missionId),
    onSuccess: (_, missionId) => {
      queryClient.invalidateQueries({
        queryKey: ["missions"],
      });

      queryClient.invalidateQueries({
        queryKey: ["missionDetail", missionId],
      });

      queryClient.invalidateQueries({
        queryKey: ["likedMissions"],
      });
    },
  });
}
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { unlikeMission } from "@/apis/like";

export function useUnlikeMission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (missionId: number) => unlikeMission(missionId),
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
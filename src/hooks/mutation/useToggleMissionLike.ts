import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";

import { likeMission, unlikeMission } from "@/apis/likes";
import type {
  MissionDetailResponse,
  RecommendedMissionListResponse,
} from "@/types/mission";

type ToggleMissionLikeVariables = {
  missionId: number;
  liked: boolean;
};

type RecommendedCache =
  | RecommendedMissionListResponse
  | InfiniteData<RecommendedMissionListResponse, unknown>;

export function useToggleMissionLike() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ missionId, liked }: ToggleMissionLikeVariables) =>
      liked ? unlikeMission(missionId) : likeMission(missionId),
    onMutate: async ({ missionId, liked }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["recommended-missions"] }),
        queryClient.cancelQueries({ queryKey: ["missionDetail", missionId] }),
      ]);

      const recommendedSnapshots = queryClient.getQueriesData({
        queryKey: ["recommended-missions"],
      });
      const detailSnapshots = queryClient.getQueriesData({
        queryKey: ["missionDetail", missionId],
      });

      queryClient.setQueriesData<RecommendedCache>(
        { queryKey: ["recommended-missions"] },
        (current) => updateRecommendedCache(current, missionId, !liked),
      );
      queryClient.setQueriesData<MissionDetailResponse>(
        { queryKey: ["missionDetail", missionId] },
        (current) =>
          current
            ? { ...current, result: { ...current.result, liked: !liked } }
            : current,
      );

      return { recommendedSnapshots, detailSnapshots };
    },
    onError: (_error, _variables, context) => {
      context?.recommendedSnapshots.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      context?.detailSnapshots.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["likes", "missions"] });
      queryClient.invalidateQueries({
        queryKey: ["missionDetail", variables.missionId],
      });
    },
  });

  return {
    toggleMissionLike: (variables: ToggleMissionLikeVariables) =>
      mutation.mutate(variables),
    pendingMissionId: mutation.isPending
      ? mutation.variables?.missionId ?? null
      : null,
    error: mutation.error,
  };
}

function updateRecommendedCache(
  current: RecommendedCache | undefined,
  missionId: number,
  liked: boolean,
) {
  if (!current) return current;

  if ("pages" in current) {
    return {
      ...current,
      pages: current.pages.map((page) =>
        updateRecommendedResponse(page, missionId, liked),
      ),
    };
  }

  return updateRecommendedResponse(current, missionId, liked);
}

function updateRecommendedResponse(
  response: RecommendedMissionListResponse,
  missionId: number,
  liked: boolean,
) {
  return {
    ...response,
    result: {
      ...response.result,
      missions: response.result.missions.map((mission) =>
        mission.missionId === missionId ? { ...mission, liked } : mission,
      ),
    },
  };
}

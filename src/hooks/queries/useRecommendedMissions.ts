import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { getRecommendedMissions } from "@/apis/mission";
import type { GetRecommendedMissionsParams } from "@/types/mission";

export function useRecommendedMissions(params: GetRecommendedMissionsParams) {
  return useQuery({
    queryKey: ["recommended-missions", params],
    queryFn: () => getRecommendedMissions(params),
    staleTime: 1000 * 60,
    retry: false,
  });
}

export function useInfiniteRecommendedMissions(
  params: Omit<GetRecommendedMissionsParams, "cursor">,
) {
  return useInfiniteQuery({
    queryKey: ["recommended-missions", "infinite", params],
    queryFn: ({ pageParam }) =>
      getRecommendedMissions({ ...params, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.result.hasNext
        ? (lastPage.result.nextCursor ?? undefined)
        : undefined,
    staleTime: 1000 * 60,
    retry: false,
  });
}

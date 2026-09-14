import { useInfiniteQuery } from "@tanstack/react-query";

import { getMissions } from "@/apis/mission";
import type { GetMissionsParams } from "@/types/mission";

export function useInfiniteMissions(params: GetMissionsParams) {
  const { cursor: _cursor, ...baseParams } = params;

  return useInfiniteQuery({
    queryKey: ["missions", baseParams],
    queryFn: ({ pageParam }) =>
      getMissions({
        ...baseParams,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage.result.hasNext) {
        return undefined;
      }

      return lastPage.result.nextCursor ?? undefined;
    },
    staleTime: 1000 * 60,
    retry: false,
  });
}
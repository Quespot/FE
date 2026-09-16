// 행정구역 미션 목록 조회

import {
  DistrictMissionsParams,
  getDistrictMissions,
} from "@/apis/missionSpot";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useDistrictMissionsQuery = (
  districtCode: string,
  params: DistrictMissionsParams = {},
) => {
  const requestParams = {
    ...params,
    size: params.size ?? 20,
  };

  return useInfiniteQuery({
    queryKey: ["missionSpots", "missions", "infinite", districtCode, requestParams],
    initialPageParam: params.cursor as string | undefined,
    queryFn: ({ pageParam }) =>
      getDistrictMissions(districtCode, { ...requestParams, cursor: pageParam }),
    getNextPageParam: (lastPage, _pages, _lastParam, pageParams) => {
      const cursor = lastPage.nextCursor;
      if (!lastPage.hasNext || !cursor || pageParams.includes(cursor)) {
        return undefined;
      }
      return cursor;
    },
    enabled: districtCode.trim().length > 0,
    staleTime: 1000 * 60 * 60, // 1시간
    gcTime: Infinity, // 무한
  });
};

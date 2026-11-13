// 행정구역 미션 스팟 조회

import { getMissionSpots } from "@/apis/missionSpot";
import { useQueries } from "@tanstack/react-query";

const REGION_CODES = ["11", "28", "41"];
export const useMissionSpotsQuery = () =>
  useQueries({
    queries: REGION_CODES.map((regionCode) => ({
      queryKey: ["missionSpots", "region", regionCode],
      queryFn: () => getMissionSpots(regionCode),
      staleTime: 1000 * 60 * 30, // 30분
      gcTime: 1000 * 60 * 60, // 60분
    })),
    combine: (results) => ({
      data: results.flatMap((result) => result.data ?? []),
      isLoading: results.some((result) => result.isLoading),
      isError: results.some((result) => result.isError),
    }),
  });

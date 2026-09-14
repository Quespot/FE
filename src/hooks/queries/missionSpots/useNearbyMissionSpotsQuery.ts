// 주변 미션 스팟 조회 (내 위치 기준)

import {
  getNearbyMissionSpots,
  NearbyMissionSpotsParams,
} from "@/apis/missionSpot";
import { useQuery } from "@tanstack/react-query";

export const useNearbyMissionSpotsQuery = (
  params: NearbyMissionSpotsParams | null,
) => {
  const requestParams = params ? { ...params, limit: params.limit ?? 6 } : null;

  return useQuery({
    queryKey: ["missionSpots", "nearby", requestParams],
    queryFn: () => {
      if (!requestParams) {
        throw new Error("주변 미션 스팟 조회에 현재 위치 정보가 필요합니다.");
      }

      return getNearbyMissionSpots(requestParams);
    },
    enabled: requestParams !== null,
    staleTime: 1000 * 60, // 1분
    gcTime: 1000 * 60 * 30, // 30분
  });
};

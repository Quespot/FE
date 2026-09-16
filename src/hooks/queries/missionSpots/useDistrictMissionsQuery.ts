// 행정구역 미션 목록 조회

import {
  DistrictMissionsParams,
  getDistrictMissions,
} from "@/apis/missionSpot";
import { useQuery } from "@tanstack/react-query";

export const useDistrictMissionsQuery = (
  districtCode: string,
  params: DistrictMissionsParams = {},
) => {
  const requestParams = {
    ...params,
    size: params.size ?? 20,
  };

  return useQuery({
    queryKey: ["missionSpots", "missions", districtCode, requestParams],
    queryFn: () => getDistrictMissions(districtCode, requestParams),
    enabled: districtCode.trim().length > 0,
    staleTime: 1000 * 60 * 60, // 1시간
    gcTime: Infinity, // 무한
  });
};

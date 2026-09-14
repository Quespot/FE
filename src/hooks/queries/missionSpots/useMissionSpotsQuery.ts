// 행정구역 미션 스팟 조회

import { getMissionSpots } from "@/apis/missionSpot";
import { useQuery } from "@tanstack/react-query";

// demo버전은 regionCode를 11(서울)로 고정합니다.
export const useMissionSpotsQuery = (regionCode = "11") =>
  useQuery({
    queryKey: ["missionSpots", "region", regionCode],
    queryFn: () => getMissionSpots(regionCode),
    staleTime: Infinity, // 무한
    gcTime: Infinity, // 무한
    // 지역코드를 11로 고정되어 있고 미션 데이터 변경 가능성이 낮아 캐시를 계속 유지합니다.
  });

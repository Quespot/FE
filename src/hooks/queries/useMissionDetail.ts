import { useQuery } from "@tanstack/react-query";

import { getMissionDetail } from "@/apis/mission";
import type { GetMissionDetailParams } from "@/types/mission";

export function useMissionDetail(params: GetMissionDetailParams) {
  return useQuery({
    queryKey: [
      "missionDetail",
      params.missionId,
      params.latitude,
      params.longitude,
    ],
    queryFn: () => getMissionDetail(params),
    enabled: Number.isFinite(params.missionId) && params.missionId > 0,
    staleTime: 1000 * 60,
    retry: false,
  });
}
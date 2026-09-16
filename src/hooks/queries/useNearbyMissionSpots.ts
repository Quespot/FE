import { useQuery } from "@tanstack/react-query";

import { getNearbyMissionSpots } from "@/apis/missionSpot";
import type { GetNearbyMissionSpotsParams } from "@/types/missionSpot";

export function useNearbyMissionSpots(
  params: GetNearbyMissionSpotsParams | undefined,
) {
  return useQuery({
    queryKey: ["nearby-mission-spots", params],
    queryFn: () => getNearbyMissionSpots(params!),
    enabled: Boolean(params),
    staleTime: 1000 * 60,
    retry: false,
  });
}

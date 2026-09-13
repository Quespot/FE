import { apiClient } from "@/apis/client";
import type {
  GetNearbyMissionSpotsParams,
  NearbyMissionSpotsResponse,
} from "@/types/missionSpot";

export async function getNearbyMissionSpots(
  params: GetNearbyMissionSpotsParams,
) {
  const { data } = await apiClient.get<NearbyMissionSpotsResponse>(
    "/api/mission-spots/nearby",
    { params },
  );

  return data;
}

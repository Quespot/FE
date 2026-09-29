import { apiClient } from "@/apis/client";
import type {
  GetMissionDetailParams,
  GetMissionsParams,
  GetRecommendedMissionsParams,
  MissionDetailResponse,
  MissionListResponse,
  RecommendedMissionListResponse,
} from "@/types/mission";

function createMissionQueryParams(params: GetMissionsParams) {
  const searchParams = new URLSearchParams();

  if (params.category) {
    searchParams.set("category", params.category);
  }

  if (params.keyword) {
    searchParams.set("keyword", params.keyword);
  }

  if (params.latitude !== undefined) {
    searchParams.set("latitude", String(params.latitude));
  }

  if (params.longitude !== undefined) {
    searchParams.set("longitude", String(params.longitude));
  }

  if (params.cursor) {
    searchParams.set("cursor", params.cursor);
  }

  searchParams.set("size", String(params.size ?? 20));

  return searchParams;
}

function createMissionDetailQueryParams(params: GetMissionDetailParams) {
  const searchParams = new URLSearchParams();

  if (params.latitude !== undefined) {
    searchParams.set("latitude", String(params.latitude));
  }

  if (params.longitude !== undefined) {
    searchParams.set("longitude", String(params.longitude));
  }

  return searchParams;
}

export async function getMissions(params: GetMissionsParams) {
  const searchParams = createMissionQueryParams(params);

  const { data } = await apiClient.get<MissionListResponse>(
    `/api/missions?${searchParams.toString()}`,
  );
  return data;
}

export async function getMissionDetail(params: GetMissionDetailParams) {
  const searchParams = createMissionDetailQueryParams(params);
  const queryString = searchParams.toString();

  const { data } = await apiClient.get<MissionDetailResponse>(
    `/api/missions/${params.missionId}${
      queryString ? `?${queryString}` : ""
    }`,
  );
  return data;
}

export async function getRecommendedMissions(
  params: GetRecommendedMissionsParams = {},
) {
  const searchParams = new URLSearchParams();
  const hasCoordinates =
    params.latitude !== undefined && params.longitude !== undefined;

  if (hasCoordinates) {
    searchParams.set("latitude", String(params.latitude));
    searchParams.set("longitude", String(params.longitude));
  }

  if (params.cursor) {
    searchParams.set("cursor", params.cursor);
  }

  searchParams.set("size", String(params.size ?? 20));

  const { data } = await apiClient.get<RecommendedMissionListResponse>(
    `/api/missions/recommendations?${searchParams.toString()}`,
  );
  return data;
}

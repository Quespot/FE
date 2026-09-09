import { ApiError } from "@/apis/auth";
import type {
  GetMissionDetailParams,
  GetMissionsParams,
  MissionDetailResponse,
  MissionListResponse,
} from "@/types/mission";
import { getAccessToken } from "@/utils/auth";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? "https://api.quespot.site"
).replace(/\/$/, "");

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

async function missionRequest<T>(url: string): Promise<T> {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new ApiError("로그인이 필요합니다.", 401);
  }

  let response: Response;

  try {
    response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });
  } catch {
    throw new ApiError(
      "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.",
      0,
    );
  }

  const payload = (await response.json().catch(() => null)) as T | null;

  if (!response.ok || !payload) {
    throw new ApiError(
      "미션 요청을 처리하지 못했습니다.",
      response.status,
    );
  }

  return payload;
}

export async function getMissions(params: GetMissionsParams) {
  const searchParams = createMissionQueryParams(params);

  return missionRequest<MissionListResponse>(
    `${API_BASE_URL}/api/missions?${searchParams.toString()}`,
  );
}

export async function getMissionDetail(params: GetMissionDetailParams) {
  const searchParams = createMissionDetailQueryParams(params);
  const queryString = searchParams.toString();

  return missionRequest<MissionDetailResponse>(
    `${API_BASE_URL}/api/missions/${params.missionId}${
      queryString ? `?${queryString}` : ""
    }`,
  );
}
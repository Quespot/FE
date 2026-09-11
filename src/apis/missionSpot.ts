import { isAxiosError } from "axios";
import { ApiError } from "@/apis/auth";
import { apiClient } from "@/apis/client";
import type { CommonResponse } from "@/types/api";

// 미션 스팟
export interface MissionSpot {
  districtCode: string;
  districtName: string;
  latitude: number;
  longitude: number;
  missionCount: number;
  completedMissionCount: number;
  completionStatus: string;
  distanceMeters: number;
}

// 행정구역 미션 스팟 조회 응답
export interface RegionMissionSpots {
  regionCode: string;
  regionName: string;
  totalSpotCount: number;
  completedSpotCount: number;
  totalMissionCount: number;
  completedMissionCount: number;
  missionSpots: MissionSpot[];
}

// 미션 목록 항목
export interface DistrictMission {
  missionId: number;
  title: string;
  category: string;
  spotName: string;
  address: string;
  imageUrl: string;
  distanceMeters: number;
  rewardPoint: number;
  estimatedMinutes: number;
  userMissionStatus: string;
  canStart: boolean;
}

// 행정구역 미션 목록 조회 응답
export interface DistrictMissions {
  missions: DistrictMission[];
  nextCursor: string | null;
  hasNext: boolean;
}

// 주변 미션 스팟 조회 응답
export interface NearbyMissionSpots {
  missionSpots: MissionSpot[];
}

// 행정구역 미션 목록 조회 파라미터
export interface DistrictMissionsParams {
  latitude?: number;
  longitude?: number;
  cursor?: string;
  size?: number;
}

// 주변 미션 스팟 조회 파라미터
export interface NearbyMissionSpotsParams {
  latitude: number;
  longitude: number;
  limit?: number;
}

// 공통 GET 요청 처리
async function missionSpotRequest<T>(
  path: string,
  params?: object,
): Promise<T> {
  try {
    const response = await apiClient.get<CommonResponse<T>>(path, {
      params,
    });

    const payload = response.data;

    if (!payload?.isSuccess) {
      throw new ApiError(
        payload?.message || "미션 스팟 요청을 처리하지 못했습니다.",
        response.status,
        payload?.code,
      );
    }

    return payload.result;
  } catch (error) {
    if (isAxiosError<CommonResponse<unknown>>(error)) {
      if (!error.response) {
        throw new ApiError(
          "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.",
          0,
        );
      }

      throw new ApiError(
        error.response.data?.message || "미션 스팟 요청을 처리하지 못했습니다.",
        error.response.status,
        error.response.data?.code,
      );
    }

    throw error;
  }
}

// 행정구역 미션 스팟 조회
// GET /api/mission-spots
// demo버전은 regionCode를 11(서울)로 고정합니다.
export const getMissionSpots = (regionCode = "11") =>
  missionSpotRequest<RegionMissionSpots>("/api/mission-spots", {
    regionCode,
  });

// 행정구역 미션 목록 조회
// GET /api/mission-spots/{districtCode}/missions
export const getDistrictMissions = (
  districtCode: string,
  params: DistrictMissionsParams = {},
) =>
  missionSpotRequest<DistrictMissions>(
    `/api/mission-spots/${encodeURIComponent(districtCode)}/missions`,
    {
      ...params,
      size: params.size ?? 20,
    },
  );

// 주변 미션 스팟 조회
// GET /api/mission-spots/nearby
export const getNearbyMissionSpots = (params: NearbyMissionSpotsParams) =>
  missionSpotRequest<NearbyMissionSpots>("/api/mission-spots/nearby", {
    ...params,
    limit: params.limit ?? 5,
  });

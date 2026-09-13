import { isAxiosError } from "axios";

import { apiClient } from "@/apis/client";
import type { MissionCategory } from "@/types/mission";

type ApiEnvelope<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
  errorDetail?: string | null;
};

export type LikedMission = {
  missionId: number;
  title: string;
  category: MissionCategory;
  spotName: string;
  imageUrl: string;
  rewardPoint: number;
  estimatedMinutes: number;
  likedAt: string;
};

export type LikedCourse = {
  courseId: number;
  name: string;
  coverImageUrl: string;
  regionCode: string;
  totalRewardPoint: number;
  bonusPoint: number;
  missionCount: number;
  estimatedMinutes: number;
  myStatus: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | string;
};

export type LikedMissionList = { items: LikedMission[]; totalCount: number };
export type LikedCourseList = { items: LikedCourse[]; totalCount: number };

async function getResult<T>(path: string) {
  const { data } = await apiClient.get<ApiEnvelope<T>>(path);
  if (!data.isSuccess) throw new Error(data.message || "좋아요 목록을 불러오지 못했습니다.");
  return data.result;
}

async function mutateLike(method: "post" | "delete", missionId: number) {
  const { data } = await apiClient.request<ApiEnvelope<string>>({
    method,
    url: `/api/missions/${missionId}/like`,
  });
  if (!data.isSuccess) {
    throw new Error(data.message || "좋아요를 변경하지 못했습니다.");
  }
  return data.result;
}

export const getLikedMissions = () => getResult<LikedMissionList>("/api/users/me/liked-missions");
export const getLikedCourses = () => getResult<LikedCourseList>("/api/users/me/liked-courses");
export const likeMission = (missionId: number) => mutateLike("post", missionId);
export const unlikeMission = (missionId: number) => mutateLike("delete", missionId);

export function getLikesErrorMessage(error: unknown) {
  if (isAxiosError<ApiEnvelope<unknown>>(error)) {
    if (!error.response) return "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.";
    return error.response.data?.message || "좋아요 목록을 불러오지 못했습니다.";
  }
  return error instanceof Error ? error.message : "좋아요 목록을 불러오지 못했습니다.";
}

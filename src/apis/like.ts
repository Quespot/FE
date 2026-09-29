import { ApiError } from "@/apis/auth";
import { apiClient } from "@/apis/client";

type ApiEnvelope<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
  errorDetail?: unknown;
};

async function likeRequest<T>(
  path: string,
  options: {
    method: "POST" | "DELETE";
  },
): Promise<T> {
  const response = await apiClient.request<ApiEnvelope<T>>({
    url: path,
    method: options.method,
  });
  const payload = response.data;

  if (!payload.isSuccess) {
    throw new ApiError(
      payload?.message || "좋아요 요청을 처리하지 못했습니다.",
      response.status,
      payload?.code,
    );
  }

  return payload.result;
}

export function likeMission(missionId: number) {
  return likeRequest<string>(`/api/missions/${missionId}/like`, {
    method: "POST",
  });
}

export function unlikeMission(missionId: number) {
  return likeRequest<string>(`/api/missions/${missionId}/like`, {
    method: "DELETE",
  });
}

export function likeMissionCourse(courseId: number) {
  return likeRequest<string>(`/api/mission-courses/${courseId}/like`, {
    method: "POST",
  });
}

export function unlikeMissionCourse(courseId: number) {
  return likeRequest<string>(`/api/mission-courses/${courseId}/like`, {
    method: "DELETE",
  });
}

import { ApiError } from "@/apis/auth";
import { getAccessToken } from "@/utils/auth";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? "https://api.quespot.site"
).replace(/\/$/, "");

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
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new ApiError("로그인이 필요합니다.", 401);
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method,
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

  const payload = (await response.json().catch(() => null)) as
    | ApiEnvelope<T>
    | null;

  if (!response.ok || !payload?.isSuccess) {
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
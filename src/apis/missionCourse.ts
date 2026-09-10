import { ApiError } from "@/apis/auth";
import { getAccessToken } from "@/utils/auth";
import type {
  CourseAttempt,
  MissionCourseDetail,
  MissionCourseItem,
} from "@/types/missionCourse";

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

async function missionCourseRequest<T>(path: string): Promise<T> {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new ApiError("로그인이 필요합니다.", 401);
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
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

  const payload = (await response.json().catch(() => null)) as
    | ApiEnvelope<T>
    | null;

  if (!response.ok || !payload?.isSuccess) {
    throw new ApiError(
      payload?.message || "미션 코스 요청을 처리하지 못했습니다.",
      response.status,
      payload?.code,
    );
  }

  return payload.result;
}

export function getMissionCourses() {
  return missionCourseRequest<MissionCourseItem[]>("/api/mission-courses");
}

export function getMissionCourseDetail(courseId: number) {
  return missionCourseRequest<MissionCourseDetail>(
    `/api/mission-courses/${courseId}`,
  );
}

export function getCourseAttempts() {
  return missionCourseRequest<{
    attempts: CourseAttempt[];
  }>("/api/course-attempts");
}
import { ApiError } from "@/apis/auth";
import { getAccessToken } from "@/utils/auth";
import type {
  CourseAttempt,
  CreateMissionCourseRequest,
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

type RequestMethod = "GET" | "POST";

async function missionCourseRequest<T>(
  path: string,
  options?: {
    method?: RequestMethod;
    body?: unknown;
  },
): Promise<T> {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new ApiError("로그인이 필요합니다.", 401);
  }

  const method = options?.method ?? "GET";
  const hasBody = options?.body !== undefined;

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      credentials: "include",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        ...(hasBody ? { "Content-Type": "application/json" } : {}),
      },
      ...(hasBody ? { body: JSON.stringify(options.body) } : {}),
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

export function createMissionCourse(body: CreateMissionCourseRequest) {
  return missionCourseRequest<MissionCourseDetail>("/api/mission-courses", {
    method: "POST",
    body,
  });
}

export function quitCourseAttempt(courseAttemptId: number) {
  return missionCourseRequest<string>(
    `/api/course-attempts/${courseAttemptId}/quit`,
    {
      method: "POST",
    },
  );
}
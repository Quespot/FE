import { ApiError } from "@/apis/auth";
import { apiClient } from "@/apis/client";
import type {
  CourseAttempt,
  CreateMissionCourseRequest,
  MissionCourseDetail,
  MissionCourseItem,
} from "@/types/missionCourse";

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
  const method = options?.method ?? "GET";
  const response = await apiClient.request<ApiEnvelope<T>>({
    url: path,
    method,
    data: options?.body,
  });
  const payload = response.data;

  if (!payload.isSuccess) {
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

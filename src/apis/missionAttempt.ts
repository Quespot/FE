import { ApiError } from "@/apis/auth";
import { apiClient } from "@/apis/client";
import type {
  MissionArrivalResult,
  MissionAttempt,
  MissionPhotoRequest,
  MissionPhotoResult,
  MissionReflectionRequest,
  MissionUnlockCondition,
  MissionVerificationGuide,
} from "@/types/missionAttempt";

type ApiEnvelope<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
  errorDetail?: unknown;
};

type RequestMethod = "GET" | "POST";

async function missionAttemptRequest<T>(
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
      payload?.message || "미션 인증 요청을 처리하지 못했습니다.",
      response.status,
      payload?.code,
    );
  }

  return payload.result;
}

export function getMissionUnlockCondition(missionId: number) {
  return missionAttemptRequest<MissionUnlockCondition>(
    `/api/missions/${missionId}/unlock-condition`,
  );
}

export function startMissionAttempt(missionId: number) {
  return missionAttemptRequest<MissionAttempt>(
    `/api/missions/${missionId}/start`,
    {
      method: "POST",
    },
  );
}

export function getMissionAttempts() {
  return missionAttemptRequest<{
    attempts: MissionAttempt[];
  }>("/api/mission-attempts");
}

export function getMissionAttemptDetail(attemptId: number) {
  return missionAttemptRequest<MissionAttempt>(
    `/api/mission-attempts/${attemptId}`,
  );
}

export function getMissionVerificationGuide(attemptId: number) {
  return missionAttemptRequest<MissionVerificationGuide>(
    `/api/mission-attempts/${attemptId}/verification-guide`,
  );
}

export function verifyMissionArrival(params: {
  attemptId: number;
  latitude: number;
  longitude: number;
}) {
  return missionAttemptRequest<MissionArrivalResult>(
    `/api/mission-attempts/${params.attemptId}/arrival`,
    {
      method: "POST",
      body: {
        latitude: params.latitude,
        longitude: params.longitude,
      },
    },
  );
}

export function createMissionPhoto(params: {
  attemptId: number;
  body: MissionPhotoRequest;
}) {
  return missionAttemptRequest<MissionPhotoResult>(
    `/api/mission-attempts/${params.attemptId}/photos`,
    {
      method: "POST",
      body: params.body,
    },
  );
}

export function getMissionAttemptResult(attemptId: number) {
  return missionAttemptRequest<{
    attemptId: number;
    missionTitle: string;
    earnedPoint: number;
    completedAt: string;
    photoUrl: string;
  }>(`/api/mission-attempts/${attemptId}/result`);
}

export function createMissionReflection(params: {
  attemptId: number;
  body: MissionReflectionRequest;
}) {
  return missionAttemptRequest<string>(
    `/api/mission-attempts/${params.attemptId}/reflection`,
    {
      method: "POST",
      body: params.body,
    },
  );
}

export function quitMissionAttempt(attemptId: number) {
  return missionAttemptRequest<string>(
    `/api/mission-attempts/${attemptId}/quit`,
    {
      method: "POST",
    },
  );
}

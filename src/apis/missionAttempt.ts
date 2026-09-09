import { ApiError } from "@/apis/auth";
import { getAccessToken } from "@/utils/auth";
import type {
  MissionArrivalResult,
  MissionAttempt,
  MissionPhotoRequest,
  MissionPhotoResult,
  MissionReflectionRequest,
} from "@/types/missionAttempt";

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

async function missionAttemptRequest<T>(
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
      payload?.message || "미션 인증 요청을 처리하지 못했습니다.",
      response.status,
      payload?.code,
    );
  }

  return payload.result;
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
  return missionAttemptRequest<{
    attemptId: number;
    targetLatitude: number;
    targetLongitude: number;
    radiusMeters: number;
  }>(`/api/mission-attempts/${attemptId}/verification-guide`);
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
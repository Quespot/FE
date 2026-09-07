import { ApiError } from "@/api/auth";
import type { TravelStyle } from "@/constants/profile";
import { getAccessToken } from "@/utils/auth";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "https://api.quespot.site").replace(/\/$/, "");

interface ApiEnvelope<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export interface UserProfile {
  userId: number;
  email: string;
  nickname: string;
  profileImageUrl?: string | null;
  gender?: string | null;
  birthDate?: string | null;
  residenceRegion?: string | null;
  travelCompanion?: string | null;
  travelStyles: TravelStyle[];
}

export interface ProfilePayload {
  profileImageUrl?: string | null;
  nickname: string;
  gender?: string | null;
  birthDate: string;
  residenceRegion: string;
  travelCompanion?: string | null;
  travelStyles: TravelStyle[];
}

export type BasicProfileUpdate = Pick<ProfilePayload, "nickname" | "travelStyles"> & {
  profileImageUrl?: string | null;
};

async function profileRequest<T>(method: "GET" | "POST" | "PATCH", body?: unknown): Promise<T> {
  const accessToken = getAccessToken();
  if (!accessToken) throw new ApiError("로그인이 필요합니다.", 401);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/users/me/profile`, {
      method,
      credentials: "include",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
  } catch {
    throw new ApiError("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.", 0);
  }

  const payload = await response.json().catch(() => null) as ApiEnvelope<T> | null;
  if (!response.ok || !payload?.isSuccess) {
    throw new ApiError(payload?.message || "프로필 요청을 처리하지 못했습니다.", response.status, payload?.code);
  }
  return payload.result;
}

export const getProfile = () => profileRequest<UserProfile>("GET");
export const createProfile = (profile: ProfilePayload) => profileRequest<UserProfile>("POST", profile);
export const updateBasicProfile = (profile: BasicProfileUpdate) => profileRequest<UserProfile>("PATCH", profile);
export const updateDetailedProfile = (profile: ProfilePayload) => profileRequest<UserProfile>("PATCH", profile);

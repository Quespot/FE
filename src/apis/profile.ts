import { ApiError } from "@/apis/auth";
import { apiClient } from "@/apis/client";
import type { TravelStyle } from "@/constants/profile";

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
  profileImageObjectKey?: string | null;
  nickname: string;
  gender?: string | null;
  birthDate: string;
  residenceRegion: string;
  travelCompanion?: string | null;
  travelStyles: TravelStyle[];
}

export type BasicProfileUpdate = Pick<ProfilePayload, "nickname" | "travelStyles"> & {
  profileImageObjectKey?: string | null;
};

async function profileRequest<T>(method: "GET" | "POST" | "PATCH", body?: unknown): Promise<T> {
  const response = await apiClient.request<ApiEnvelope<T>>({
    url: "/api/users/me/profile",
    method,
    data: body,
  });
  const payload = response.data;
  if (!payload.isSuccess) {
    throw new ApiError(payload?.message || "프로필 요청을 처리하지 못했습니다.", response.status, payload?.code);
  }
  return payload.result;
}

export const getProfile = () => profileRequest<UserProfile>("GET");
export const createProfile = (profile: ProfilePayload) => profileRequest<UserProfile>("POST", profile);
export const updateBasicProfile = (profile: BasicProfileUpdate) => profileRequest<UserProfile>("PATCH", profile);
export const updateDetailedProfile = (profile: ProfilePayload) => profileRequest<UserProfile>("PATCH", profile);

export type MissionCategory =
  | "HISTORY"
  | "CULTURE"
  | "NATURE"
  | "FOOD"
  | "SHOPPING"
  | "ACTIVITY";

export type UserMissionStatus =
  | "AVAILABLE"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "LOCKED";

export type MissionItem = {
  missionId: number;
  title: string;
  category: MissionCategory;
  spotName: string;
  address: string;
  imageUrl: string;
  distanceMeters: number | null;
  rewardPoint: number;
  estimatedMinutes: number;
  userMissionStatus: UserMissionStatus;
  canStart: boolean;
};

export type MissionListResult = {
  missions: MissionItem[];
  nextCursor: string | null;
  hasNext: boolean;
};

export type MissionListResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MissionListResult;
  errorDetail: string | null;
};

export type GetMissionsParams = {
  category?: MissionCategory;
  keyword?: string;
  latitude?: number;
  longitude?: number;
  cursor?: string;
  size?: number;
};

export type MissionDetail = {
  missionId: number;
  title: string;
  description: string;
  category: MissionCategory;
  spotName: string;
  address: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  distanceMeters: number | null;
  rewardPoint: number;
  estimatedMinutes: number;
  userMissionStatus: UserMissionStatus;
  canStart: boolean;
  liked: boolean;
  canCreateArchive: boolean;
};

export type MissionDetailResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MissionDetail;
  errorDetail: string | null;
};

export type GetMissionDetailParams = {
  missionId: number;
  latitude?: number;
  longitude?: number;
};
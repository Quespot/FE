export type MissionAttemptStatus =
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FAILED"
  | "QUIT"
  | string;

export type MissionAttempt = {
  attemptId: number;
  missionId: number;
  missionTitle: string;
  status: MissionAttemptStatus;
  startedAt: string;
  completedAt: string | null;
  earnedPoint: number;
};

export type MissionArrivalResult = {
  success: boolean;
  distanceMeters: number;
  radiusMeters: number;
  status: MissionAttemptStatus;
  earnedPoint: number;
};

export type MissionPhotoRequest = {
  imageUrl: string;
  caption: string;
  latitude: number;
  longitude: number;
  takenAt: string;
};

export type MissionPhotoResult = {
  photoId: number;
  imageUrl: string;
  caption: string;
  latitude: number;
  longitude: number;
  takenAt: string;
};

export type MissionReflectionRequest = {
  content: string;
};
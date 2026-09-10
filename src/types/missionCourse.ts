export type MissionCourseStatus = "IN_PROGRESS" | "COMPLETED" | null | string;

export type CourseMissionStatus =
  | "LOCKED"
  | "AVAILABLE"
  | "IN_PROGRESS"
  | "COMPLETED"
  | string;

export type MissionCourseItem = {
  courseId: number;
  name: string;
  coverImageUrl: string;
  regionCode: string;
  totalRewardPoint: number;
  bonusPoint: number;
  missionCount: number;
  estimatedMinutes: number;
  myStatus: MissionCourseStatus;
};

export type MissionCourseMission = {
  missionId: number;
  seq: number;
  title: string;
  imageUrl: string;
  rewardPoint: number;
  status: CourseMissionStatus;
};

export type MissionCourseDetail = {
  courseId: number;
  name: string;
  description: string;
  coverImageUrl: string;
  regionCode: string;
  totalRewardPoint: number;
  bonusPoint: number;
  estimatedMinutes: number;
  missions: MissionCourseMission[];
  myStatus: MissionCourseStatus;
};

export type CourseAttempt = {
  courseAttemptId: number;
  courseId: number;
  courseName: string;
  status: MissionCourseStatus;
  startedAt: string;
  completedAt: string | null;
  earnedBonusPoint: number;
};

export type CreateMissionCourseRequest = {
  anchorMissionId: number;
};

export type QuitCourseAttemptParams = {
  courseAttemptId: number;
};
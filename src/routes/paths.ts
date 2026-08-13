export const PATH = {
  LANDING: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  SIGNUP_CHECK: "/signup/check",

  // HomePage
  HOME: "/home",

  //MissionPage
  MISSIONS: "/missions",
  MISSION_DETAIL: "/missions/:missionId",
  MISSION_PHOTO: "/mission/photo",
  MISSION_RECORD: "/mission/record",

  //MapPage
  MAP: "/map",

  //RewardsPage
  REWARDS: "/rewards",

  // MyPage
  MY: "/my",
  QUESTY_CUSTOMIZE: "/my/customize",

  // Error
  NOT_FOUND: "*",
} as const;

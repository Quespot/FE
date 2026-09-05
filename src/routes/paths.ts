export const PATH = {
  LANDING: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  SIGNUP_CHECK: "/profile/check",
  PROFILE_SETUP: "/profile/setup",

  // HomePage
  HOME: "/home",

  //MissionPage
  MISSIONS: "/missions",
  MISSION_DETAIL: "/missions/:missionId",
  MISSION_PHOTO: "/mission/photo",
  MISSION_RECORD: "/mission/record",
  MISSION_LOCAL_RECOMMEND: "/mission/local-recommend",
  MISSION_BONUS_REGION: "/mission/bonus-region",
  MISSION_ROUTE: "/mission/route",

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

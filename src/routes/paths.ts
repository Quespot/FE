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
  MISSION_RECORD: "/mission/record",
  MISSION_LOCAL_RECOMMEND: "/mission/local-recommend",
  MISSION_BONUS_REGION: "/mission/bonus-region",
  MISSION_ROUTE: "/mission/route",

  MISSION_VERIFY: "/mission/verify",
  MISSION_VERIFY_LOADING: "/mission/verify/loading",
  MISSION_VERIFY_RESULT: "/mission/verify/result",

  //MapPage
  MAP: "/map",

  //RewardsPage
  REWARDS: "/rewards",

  // MyPage
  MY: "/my",
  LIKES: "/my/likes",
  SAVED_PLACES: "/my/saved-places",
  ARCHIVE: "/my/archive",
  QUESTY_CUSTOMIZE: "/my/customize",

  // Error
  NOT_FOUND: "*",
} as const;

export const PATH = {
  LANDING: "/",

  LOGIN: "/login",

  OAUTH_CALLBACK: "/oauth/callback",

  SIGNUP: "/signup",

  SIGNUP_CHECK: "/profile/check",

  PROFILE_SETUP: "/profile/setup",

  PROFILE_DETAILS: "/my/profile-details",

  // HomePage
  HOME: "/home",

  // MissionPage
  MISSIONS: "/missions",

  MISSION_DETAIL: "/missions/:missionId",

  MISSION_RECORD: "/mission/record",

  MISSION_LOCAL_RECOMMEND: "/mission/local-recommend",

  MISSION_BONUS_REGION: "/mission/bonus-region",

  MISSION_ROUTE: "/mission/route",

  MISSION_COURSE_CREATE: "/mission/course/create",

  MISSION_VERIFY: "/mission/verify",

  MISSION_VERIFY_LOADING: "/mission/verify/loading",

  MISSION_VERIFY_RESULT: "/mission/verify/result",

  // MapPage
  MAP: "/map",

  MAP_SEARCH: "/map/search",

  // RewardsPage
  REWARDS: "/rewards",

  REWARD_COUPONS: "/rewards/coupons",

  // MyPage
  MY: "/my",

  LIKES: "/my/likes",

  SAVED_PLACES: "/my/saved-places",

  ARCHIVE: "/my/archive",

  QUESTY_CUSTOMIZE: "/my/customize",

  // Notification
  NOTIFICATION: "/notification",

  // Error
  NOT_FOUND: "*",
} as const;
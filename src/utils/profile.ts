import { ApiError } from "@/api/auth";
import { getProfile } from "@/api/profile";
import { PROFILE_SETUP_KEY } from "@/constants/onboarding";
import { companionFromApi, genderFromApi, regionFromApi, travelStylesToCategoryIds } from "@/constants/profile";
import { PATH } from "@/routes/paths";

export const PROFILE_CACHE_KEY = "quespot-profile";

export async function resolvePostLoginPath(authenticatedPath: string = PATH.HOME) {
  try {
    const profile = await getProfile();
    localStorage.setItem(PROFILE_SETUP_KEY, "true");
    localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify({
      nickname: profile.nickname,
      profileImageUrl: profile.profileImageUrl,
      birthDate: profile.birthDate,
      gender: profile.gender ? genderFromApi[profile.gender] || "" : "",
      region: profile.residenceRegion ? regionFromApi[profile.residenceRegion] || "" : "",
      companion: profile.travelCompanion ? companionFromApi[profile.travelCompanion] || "" : "",
      interests: travelStylesToCategoryIds(profile.travelStyles || []),
    }));
    return authenticatedPath;
  } catch (error) {
    const profileMissing = error instanceof ApiError && (error.status === 404 || error.code?.includes("404"));
    if (!profileMissing) throw error;
    localStorage.removeItem(PROFILE_SETUP_KEY);
    localStorage.removeItem(PROFILE_CACHE_KEY);
    return PATH.SIGNUP_CHECK;
  }
}

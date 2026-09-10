const ACCESS_TOKEN_KEY = "quespot-access-token";
const USER_ID_KEY = "quespot-user-id";
const LOGIN_REDIRECT_KEY = "quespot-login-redirect";
const PENDING_SOCIAL_PROVIDER_KEY = "quespot-pending-social-provider";
const SOCIAL_CONNECTIONS_KEY = "quespot-social-connections";

export type SocialProviderId = "google" | "kakao" | "naver";
export type SocialConnections = Record<SocialProviderId, boolean>;

const emptySocialConnections = (): SocialConnections => ({ google: false, kakao: false, naver: false });

const isSocialProvider = (value: unknown): value is SocialProviderId =>
  value === "google" || value === "kakao" || value === "naver";

const providerFromToken = (accessToken: string | null): SocialProviderId | null => {
  if (!accessToken) return null;
  try {
    const encodedPayload = accessToken.split(".")[1];
    if (!encodedPayload) return null;
    const base64Payload = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = base64Payload.padEnd(Math.ceil(base64Payload.length / 4) * 4, "=");
    const payload = JSON.parse(atob(paddedPayload)) as Record<string, unknown>;
    const candidate = [payload.provider, payload.socialProvider, payload.registrationId, payload.loginType]
      .find((value) => isSocialProvider(typeof value === "string" ? value.toLowerCase() : value));
    return typeof candidate === "string" && isSocialProvider(candidate.toLowerCase())
      ? candidate.toLowerCase() as SocialProviderId
      : null;
  } catch {
    return null;
  }
};

const storeSocialConnection = (provider: SocialProviderId) => {
  const connections = getSocialConnections(false);
  connections[provider] = true;
  localStorage.setItem(SOCIAL_CONNECTIONS_KEY, JSON.stringify(connections));
};

export const saveAuth = (accessToken: string, userId: number) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(USER_ID_KEY, String(userId));
};

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

export const beginSocialLogin = (provider: SocialProviderId) =>
  sessionStorage.setItem(PENDING_SOCIAL_PROVIDER_KEY, provider);

export const completeSocialLogin = (accessToken: string) => {
  const pendingProvider = sessionStorage.getItem(PENDING_SOCIAL_PROVIDER_KEY)?.toLowerCase();
  const provider = isSocialProvider(pendingProvider) ? pendingProvider : providerFromToken(accessToken);
  sessionStorage.removeItem(PENDING_SOCIAL_PROVIDER_KEY);
  if (provider) storeSocialConnection(provider);
};

export const cancelSocialLogin = () => sessionStorage.removeItem(PENDING_SOCIAL_PROVIDER_KEY);

export const getSocialConnections = (includeCurrentToken = true): SocialConnections => {
  let connections = emptySocialConnections();
  try {
    connections = { ...connections, ...JSON.parse(localStorage.getItem(SOCIAL_CONNECTIONS_KEY) ?? "{}") };
  } catch {
    // 손상된 로컬 값은 초기 상태로 복구한다.
  }

  const currentProvider = includeCurrentToken ? providerFromToken(getAccessToken()) : null;
  if (currentProvider) {
    connections[currentProvider] = true;
    localStorage.setItem(SOCIAL_CONNECTIONS_KEY, JSON.stringify(connections));
  }
  return connections;
};

export const clearSocialConnections = () => {
  localStorage.removeItem(SOCIAL_CONNECTIONS_KEY);
  sessionStorage.removeItem(PENDING_SOCIAL_PROVIDER_KEY);
};

export const saveLoginRedirect = (path: string) => sessionStorage.setItem(LOGIN_REDIRECT_KEY, path);

export const takeLoginRedirect = () => {
  const path = sessionStorage.getItem(LOGIN_REDIRECT_KEY);
  sessionStorage.removeItem(LOGIN_REDIRECT_KEY);
  return path;
};

export const clearAuth = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
};

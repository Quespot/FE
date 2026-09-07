const ACCESS_TOKEN_KEY = "quespot-access-token";
const USER_ID_KEY = "quespot-user-id";
const LOGIN_REDIRECT_KEY = "quespot-login-redirect";

export const saveAuth = (accessToken: string, userId: number) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(USER_ID_KEY, String(userId));
};

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

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

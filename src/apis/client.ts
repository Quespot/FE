import axios, { AxiosHeaders } from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://api.quespot.site";

// 개발 환경에서만 임시 토큰 사용
const DEV_ACCESS_TOKEN = import.meta.env.DEV
  ? (import.meta.env.VITE_DEV_ACCESS_TOKEN as string | undefined)
  : undefined;

const ACCESS_TOKEN_KEYS = ["accessToken", "ACCESS_TOKEN", "token"] as const;

function getStoredAccessToken() {
  for (const key of ACCESS_TOKEN_KEYS) {
    const localToken = localStorage.getItem(key);
    if (localToken) return localToken;

    const sessionToken = sessionStorage.getItem(key);
    if (sessionToken) return sessionToken;
  }

  return null;
}

function normalizeBearerToken(token: string) {
  const trimmedToken = token.trim();

  if (trimmedToken.startsWith("Bearer ")) {
    return trimmedToken;
  }

  return `Bearer ${trimmedToken}`;
}

function setAuthorizationHeader(headers: unknown, token: string) {
  const authorization = normalizeBearerToken(token);

  if (headers instanceof AxiosHeaders) {
    headers.set("Authorization", authorization);
    return;
  }

  if (headers && typeof headers === "object") {
    Object.assign(headers, {
      Authorization: authorization,
    });
  }
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const storedAccessToken = getStoredAccessToken();

  // 정석 흐름:
  // 1순위: 실제 로그인 후 저장된 accessToken
  // 2순위: 개발 환경에서만 .env 임시 토큰
  const accessToken = storedAccessToken ?? DEV_ACCESS_TOKEN;

  if (accessToken) {
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }

    setAuthorizationHeader(config.headers, accessToken);
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn(
        "인증 오류가 발생했습니다. accessToken 만료 또는 권한 문제를 확인해주세요.",
      );
    }

    return Promise.reject(error);
  },
);
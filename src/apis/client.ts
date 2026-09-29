import { PATH } from "@/routes/paths";
import { clearAuth, getAccessToken, saveAccessToken } from "@/utils/auth";
import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://api.quespot.site";

// 개발 환경에서만 임시 토큰 사용
const DEV_ACCESS_TOKEN = import.meta.env.DEV
  ? (import.meta.env.VITE_DEV_ACCESS_TOKEN as string | undefined)
  : undefined;

type ApiEnvelope<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
  errorDetail?: unknown;
};

type ReissueResult = {
  accessToken: string;
  profileCompleted: boolean;
};

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const ACCESS_TOKEN_EXPIRED_CODE = "AUTH_401_003";
let reissuePromise: Promise<string> | null = null;

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

async function reissueAccessToken() {
  const response = await axios.post<ApiEnvelope<ReissueResult>>(
    `${BASE_URL}/api/auth/reissue`,
    undefined,
    {
      withCredentials: true,
      headers: {
        Accept: "application/json",
      },
    },
  );

  const accessToken = response.data.result?.accessToken;

  if (!response.data.isSuccess || !accessToken) {
    throw new Error(response.data.message || "토큰을 재발급하지 못했습니다.");
  }

  saveAccessToken(accessToken);
  return accessToken;
}

function getReissuedAccessToken() {
  if (!reissuePromise) {
    reissuePromise = reissueAccessToken().finally(() => {
      reissuePromise = null;
    });
  }

  return reissuePromise;
}

function redirectToLogin() {
  clearAuth();

  if (window.location.pathname !== PATH.LOGIN) {
    window.location.replace(PATH.LOGIN);
  }
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const storedAccessToken = getAccessToken();

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
  async (error) => {
    const status = error.response?.status;
    const code = error.response?.data?.code;
    const originalRequest = error.config as RetriableRequestConfig | undefined;

    if (status !== 401) {
      return Promise.reject(error);
    }

    if (
      code === ACCESS_TOKEN_EXPIRED_CODE &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const accessToken = await getReissuedAccessToken();
        setAuthorizationHeader(originalRequest.headers, accessToken);
        return apiClient(originalRequest);
      } catch (reissueError) {
        redirectToLogin();
        return Promise.reject(reissueError);
      }
    }

    redirectToLogin();
    return Promise.reject(error);
  },
);

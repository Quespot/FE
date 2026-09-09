const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "https://api.quespot.site").replace(/\/$/, "");

export type SocialProvider = "google" | "kakao";

interface ApiEnvelope<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export interface SignupResult {
  userId: number;
  email: string;
}

export interface LoginResult {
  userId: number;
  accessToken: string;
}

export interface VerificationRequestResult {
  email: string;
  expiresInMinutes: number;
}

export interface VerificationConfirmResult {
  email: string;
  verified: boolean;
}

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

async function post<T>(path: string, body: unknown): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.", 0);
  }

  const payload = await response.json().catch(() => null) as ApiEnvelope<T> | null;

  if (!response.ok || !payload?.isSuccess) {
    throw new ApiError(
      payload?.message || "요청을 처리하지 못했습니다. 잠시 후 다시 시도해주세요.",
      response.status,
      payload?.code,
    );
  }

  return payload.result;
}

export const requestEmailVerification = (email: string) =>
  post<VerificationRequestResult>("/api/auth/email/verification-request", { email });

export const confirmEmailVerification = (email: string, code: string) =>
  post<VerificationConfirmResult>("/api/auth/email/verification-confirm", {
    email,
    code: Number(code),
  });

export const signup = (email: string, password: string, passwordConfirm: string) =>
  post<SignupResult>("/api/auth/sign-up", { email, password, passwordConfirm });

export const login = (email: string, password: string) =>
  post<LoginResult>("/api/auth/login", { email, password });

export const getSocialLoginUrl = (provider: SocialProvider) =>
  `${API_BASE_URL}/api/auth/login/${provider}`;

export const exchangeSocialLoginCode = (code: string) =>
  post<LoginResult>("/api/auth/login/oauth2/exchange", { code });

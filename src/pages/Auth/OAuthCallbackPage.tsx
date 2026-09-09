import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { exchangeSocialLoginCode, type LoginResult } from "@/apis/auth";
import { PATH } from "@/routes/paths";
import { saveAuth, takeLoginRedirect } from "@/utils/auth";
import { resolvePostLoginPath } from "@/utils/profile";

const pendingExchanges = new Map<string, Promise<LoginResult>>();

const exchangeOnce = (code: string) => {
  const pending = pendingExchanges.get(code);
  if (pending) return pending;

  const request = exchangeSocialLoginCode(code);
  pendingExchanges.set(code, request);
  return request;
};

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const oauthError = searchParams.get("error") || searchParams.get("message");
    const code = searchParams.get("code");

    if (oauthError) {
      setError(oauthError);
      return;
    }
    if (!code) {
      setError("소셜 로그인 인증 코드가 없습니다.");
      return;
    }

    let active = true;
    exchangeOnce(code)
      .then(async (result) => {
        if (!active) return;
        saveAuth(result.accessToken, result.userId);
        const redirectPath = takeLoginRedirect();
        navigate(await resolvePostLoginPath(redirectPath || PATH.HOME), { replace: true });
      })
      .catch((exchangeError) => {
        if (!active) return;
        pendingExchanges.delete(code);
        setError(exchangeError instanceof Error ? exchangeError.message : "소셜 로그인에 실패했습니다.");
      });

    return () => {
      active = false;
    };
  }, [navigate, searchParams]);

  return (
    <main className="grid min-h-dvh place-items-center bg-[#f4f7fd] px-6 text-center text-[#20223d]">
      <section className="w-full max-w-[320px] rounded-[24px] bg-white px-6 py-10 shadow-[0_8px_30px_rgba(62,102,142,0.08)]">
        {error ? (
          <>
            <h1 className="type-label1">로그인하지 못했어요</h1>
            <p className="type-caption2 mb-6 mt-3 break-keep text-[#e46f6f]" role="alert">{error}</p>
            <button className="type-body6 h-11 w-full rounded-xl bg-[#5bb5f8] text-white" onClick={() => navigate(PATH.LOGIN, { replace: true })} type="button">로그인으로 돌아가기</button>
          </>
        ) : (
          <>
            <LoaderCircle className="mx-auto animate-spin text-[#5bb5f8]" aria-hidden="true" size={34} />
            <h1 className="type-label1 mt-5">로그인 중이에요</h1>
            <p className="type-caption2 mt-2 text-[#8b939e]">잠시만 기다려주세요.</p>
          </>
        )}
      </section>
    </main>
  );
}

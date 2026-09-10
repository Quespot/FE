import { useEffect, useMemo, useState, type ComponentType } from "react";
import {
  AlertTriangle, Archive, Bell, Check, ChevronRight, Heart, Link2, Pencil,
  Plane, Settings2, ShieldCheck, Sparkles, Trash2, Trophy, X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { categoryIcons, categoryToneClasses } from "@/components/home/CategoryGrid";
import { getProfile, updateBasicProfile } from "@/apis/profile";
import { categoryIdsToTravelStyles, normalizeTravelCategoryIds, profileTravelCategories, travelStylesToCategoryIds } from "@/constants/profile";
import { connectLoginMethod, getLoginMethods, logout, unlinkLoginMethod, withdraw, type LoginMethod, type SocialLoginMethodProvider, type SocialProvider } from "@/apis/auth";
import { PATH } from "@/routes/paths";
import { beginSocialLogin, clearAuth, clearSocialConnections, saveLoginRedirect } from "@/utils/auth";
import questyProfile from "@/assets/questy.svg";

const PROFILE_KEY = "quespot-profile";
const DEFAULT_INTEREST_IDS = ["history", "culture", "nature", "food"];
type StoredProfile = { nickname?: string; profileImageUrl?: string | null; interests?: string[] };

const activityLinks = [
  { label: "좋아요", icon: Heart, tone: "bg-[#ffe1e8] text-[#f04461]", fill: true },
  { label: "아카이브", icon: Archive, tone: "bg-[#fff0c7] text-[#e99b20]", fill: false },
] as const;
const loginMethodOptions: Array<{ provider: SocialLoginMethodProvider; socialProvider: SocialProvider; name: string; mark: ComponentType; markClass: string }> = [
  { provider: "GOOGLE", socialProvider: "google", name: "Google", mark: GoogleMark, markClass: "bg-white ring-1 ring-[#e5e9ee]" },
  { provider: "NAVER", socialProvider: "naver", name: "Naver", mark: NaverMark, markClass: "bg-[#03c75a]" },
  { provider: "KAKAO", socialProvider: "kakao", name: "Kakao", mark: KakaoMark, markClass: "bg-[#fee500]" },
];
const panelClass = "rounded-[22px] border border-[#dbe8f5] bg-white p-[18px] shadow-[0_8px_24px_rgba(45,111,160,0.08)]";
const travelToneClasses: Record<string, string> = {
  violet: "border-[#ddccff] bg-[#f3ecff] text-[#7546d9]",
  green: "border-[#c9efdc] bg-[#eafaf2] text-[#27a36b]",
  amber: "border-[#f8dfaa] bg-[#fff5d9] text-[#d68b18]",
  brown: "border-[#e8d2bf] bg-[#f8eee5] text-[#9b6339]",
  blue: "border-[#c9e1ff] bg-[#eaf4ff] text-[#267ae5]",
  pink: "border-[#ffcde3] bg-[#fff0f7] text-[#e83f8d]",
  cyan: "border-[#bfecef] bg-[#e6fbfc] text-[#1199a2]",
  rose: "border-[#ffcaca] bg-[#fff0f0] text-[#e34d4d]",
  purple: "border-[#decaff] bg-[#f3edff] text-[#8148dc]",
};

function readProfile(): StoredProfile {
  try {
    const stored = JSON.parse(localStorage.getItem(PROFILE_KEY) ?? "{}") as StoredProfile;
    return { ...stored, interests: stored.interests ? normalizeTravelCategoryIds(stored.interests) : undefined };
  }
  catch { return {}; }
}

export default function MyPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<StoredProfile>(readProfile);
  const [loginMethods, setLoginMethods] = useState<LoginMethod[]>([]);
  const [isLoadingLoginMethods, setIsLoadingLoginMethods] = useState(true);
  const [pendingConnection, setPendingConnection] = useState<SocialProvider | null>(null);
  const [unlinkTarget, setUnlinkTarget] = useState<LoginMethod | null>(null);
  const [isUnlinking, setIsUnlinking] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingTravel, setEditingTravel] = useState(false);
  const [draftNickname, setDraftNickname] = useState(profile.nickname || "Quespot 탐험가");
  const [draftInterests, setDraftInterests] = useState<string[]>(profile.interests?.length ? profile.interests : DEFAULT_INTEREST_IDS);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const selectedCategories = useMemo(() => {
    const selectedIds = profile.interests?.length ? profile.interests : DEFAULT_INTEREST_IDS;
    return selectedIds.map((id) => profileTravelCategories.find((category) => category.id === id))
      .filter((category): category is (typeof profileTravelCategories)[number] => Boolean(category));
  }, [profile.interests]);

  useEffect(() => {
    let active = true;
    getProfile().then((remoteProfile) => {
      if (!active) return;
      const next = {
        nickname: remoteProfile.nickname,
        profileImageUrl: remoteProfile.profileImageUrl,
        interests: travelStylesToCategoryIds(remoteProfile.travelStyles || []),
      };
      setProfile(next);
      setDraftNickname(remoteProfile.nickname);
      localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...readProfile(), ...next }));
    }).catch((profileError) => {
      if (active) setStatusMessage(profileError instanceof Error ? profileError.message : "프로필을 불러오지 못했습니다.");
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    setIsLoadingLoginMethods(true);
    getLoginMethods()
      .then((result) => {
        if (active) setLoginMethods(result.loginMethods);
      })
      .catch((loginMethodsError) => {
        if (active) setStatusMessage(loginMethodsError instanceof Error ? loginMethodsError.message : "로그인 수단을 불러오지 못했습니다.");
      })
      .finally(() => {
        if (active) setIsLoadingLoginMethods(false);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!statusMessage) return;
    const timer = window.setTimeout(() => setStatusMessage(""), 2400);
    return () => window.clearTimeout(timer);
  }, [statusMessage]);

  const saveProfile = async () => {
    const nickname = draftNickname.trim();
    if (nickname.length < 2 || isSaving) return;
    setIsSaving(true);
    const next = { ...profile, nickname };
    try {
      await updateBasicProfile({ nickname, profileImageUrl: profile.profileImageUrl, travelStyles: categoryIdsToTravelStyles(profile.interests?.length ? profile.interests : DEFAULT_INTEREST_IDS) });
      setProfile(next);
      localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...readProfile(), ...next }));
      setEditing(false);
      setStatusMessage("프로필을 수정했어요.");
    } catch (profileError) {
      setStatusMessage(profileError instanceof Error ? profileError.message : "프로필을 수정하지 못했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const openTravelEditor = () => {
    const availableInterests = profile.interests ?? [];
    setDraftInterests(availableInterests.length ? availableInterests : DEFAULT_INTEREST_IDS);
    setEditingTravel(true);
  };

  const toggleTravelStyle = (id: string) => {
    setDraftInterests((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const saveTravelStyles = async () => {
    if (!draftInterests.length || isSaving) return;
    setIsSaving(true);
    const next = { ...profile, interests: draftInterests };
    try {
      await updateBasicProfile({ nickname: profile.nickname || "Quespot 탐험가", profileImageUrl: profile.profileImageUrl, travelStyles: categoryIdsToTravelStyles(draftInterests) });
      setProfile(next);
      localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...readProfile(), ...next }));
      setEditingTravel(false);
      setStatusMessage("여행 스타일을 수정했어요.");
    } catch (profileError) {
      setStatusMessage(profileError instanceof Error ? profileError.message : "여행 스타일을 수정하지 못했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
    } catch {
      // 서버 세션 정리에 실패해도 현재 기기의 로그인 정보는 제거한다.
    } finally {
      clearAuth();
      navigate(PATH.LOGIN, { replace: true });
    }
  };

  const handleWithdraw = async () => {
    if (isWithdrawing) return;
    setIsWithdrawing(true);
    try {
      await withdraw();
      clearAuth();
      localStorage.removeItem(PROFILE_KEY);
      clearSocialConnections();
      navigate(PATH.LOGIN, { replace: true });
    } catch (withdrawError) {
      setShowWithdrawConfirm(false);
      setStatusMessage(withdrawError instanceof Error ? withdrawError.message : "회원탈퇴를 처리하지 못했습니다.");
    } finally {
      setIsWithdrawing(false);
    }
  };

  const refreshLoginMethods = async () => {
    const result = await getLoginMethods();
    setLoginMethods(result.loginMethods);
  };

  const handleConnectLoginMethod = async (provider: SocialLoginMethodProvider, socialProvider: SocialProvider) => {
    if (pendingConnection) return;
    setPendingConnection(socialProvider);
    try {
      saveLoginRedirect(PATH.MY);
      beginSocialLogin(socialProvider);
      const authorizationUrl = await connectLoginMethod(provider);
      if (authorizationUrl) {
        window.location.assign(authorizationUrl);
        return;
      }
      await refreshLoginMethods();
      setStatusMessage("계정이 연결됐어요.");
    } catch (connectionError) {
      setStatusMessage(connectionError instanceof Error ? connectionError.message : "계정을 연결하지 못했습니다.");
    } finally {
      setPendingConnection(null);
    }
  };

  const handleUnlinkLoginMethod = async () => {
    if (!unlinkTarget || unlinkTarget.provider === "EMAIL" || isUnlinking) return;
    setIsUnlinking(true);
    try {
      await unlinkLoginMethod(unlinkTarget.provider as SocialLoginMethodProvider);
      await refreshLoginMethods();
      setUnlinkTarget(null);
      setStatusMessage("계정 연결을 해제했어요.");
    } catch (unlinkError) {
      setStatusMessage(unlinkError instanceof Error ? unlinkError.message : "계정 연결을 해제하지 못했습니다.");
    } finally {
      setIsUnlinking(false);
    }
  };

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#eef7ff] text-[#19233b]">
      <header className="sticky top-0 z-20 flex min-h-[66px] shrink-0 items-center justify-between border-b border-[#dcecf8] bg-white/95 px-[22px] backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <img className="h-8 w-8 object-contain" src={questyProfile} alt="" />
          <strong className="text-[21px] font-black tracking-[-0.6px] text-[#54b4f6]">Quespot</strong>
        </div>
        <div className="flex items-center gap-1">
          <button className="grid h-10 w-10 place-items-center rounded-full bg-[#f1f8fd] text-[#66798b] transition active:scale-95" onClick={() => navigate(PATH.PROFILE_DETAILS)} type="button" aria-label="상세 프로필 설정"><Settings2 size={19} strokeWidth={2.2} /></button>
          <button className="relative grid h-10 w-10 place-items-center bg-transparent text-[#8290a2] transition active:scale-95" type="button" aria-label="알림 3개"><Bell size={19} strokeWidth={2.2} /><span className="absolute right-[1px] top-[1px] grid h-[16px] min-w-[16px] place-items-center rounded-full border-2 border-white bg-[#f26464] px-0.5 text-[8px] font-black leading-none text-white">3</span></button>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[linear-gradient(155deg,#c9ebff_0%,#dff3ff_72%,#eef7ff_100%)] px-[22px] pb-[30px] pt-[25px] text-center">
        <div className="relative mx-auto w-fit">
          <span className="grid h-[100px] w-[100px] place-items-center rounded-full border-4 border-white bg-white/80 shadow-[0_10px_28px_rgba(48,132,189,0.16)]">
            <img className="h-[78px] w-[78px] rounded-full object-contain" src={profile.profileImageUrl || questyProfile} onError={(event) => { event.currentTarget.src = questyProfile; }} alt="Quespot 프로필" />
          </span>
          <button className="absolute -bottom-1 -right-1 grid h-[34px] w-[34px] place-items-center rounded-full border-[3px] border-white bg-[#50ace9] text-white shadow-[0_5px_12px_rgba(54,144,205,0.28)] transition active:scale-90" onClick={() => setEditing(true)} type="button" aria-label="프로필 수정">
            <Pencil size={14} strokeWidth={2.6} />
          </button>
        </div>
        <div className="relative mt-[15px]">
          <h1 className="m-0 text-[21px] font-extrabold tracking-[-0.5px]">{profile.nickname || "Quespot 탐험가"}</h1>
        </div>
        <div className="relative mx-auto mt-[20px] grid max-w-[310px] grid-cols-3 divide-x divide-[#c7e4f5]">
          {[["2", "완료 미션"], ["1,240", "포인트"], ["2", "배지"]].map(([value, label]) => (
            <article className="grid gap-1.5" key={label}><strong className="text-[19px] font-black leading-none text-[#44a7e9]">{value}</strong><span className="text-[10px] font-semibold text-[#94a4b5]">{label}</span></article>
          ))}
        </div>
      </section>

      <div className="grid gap-[14px] px-[18px] pb-[30px] pt-[18px]">
        <button className="flex min-h-[112px] items-center gap-3 rounded-[22px] border border-[#bfe2fa] bg-[linear-gradient(135deg,#ffffff_0%,#f7fcff_100%)] p-[15px] text-left shadow-[0_10px_25px_rgba(43,132,192,0.12)] transition active:scale-[0.99]" onClick={() => navigate(PATH.QUESTY_CUSTOMIZE)} type="button">
          <span className="grid h-[72px] w-[72px] place-items-center rounded-[20px] bg-[linear-gradient(145deg,#eff9ff,#e3f4ff)]"><img className="h-[64px] w-[64px] object-contain" src={questyProfile} alt="퀘스티" /></span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-1.5 text-[15px] font-extrabold"><Sparkles size={15} className="text-[#f0a53b]" />마스코트 꾸미기</span>
            <span className="mt-1.5 block text-[10.5px] leading-[1.45] text-[#94a0ae]">포인트로 아이템을 구매하고<br />나만의 퀘스티를 만들어요</span>
            <span className="mt-2 flex gap-1.5"><b className="rounded-full bg-[#e8f6ff] px-2 py-1 text-[9px] text-[#339fe7]">3개 보유</b><b className="rounded-full bg-[#fff3d9] px-2 py-1 text-[9px] text-[#df921e]">전설 1개</b></span>
          </span>
          <ChevronRight className="text-[#abd9f5]" size={19} strokeWidth={2.4} />
        </button>

        <section className="grid grid-cols-2 gap-[10px]" aria-label="내 활동 바로가기">
          {activityLinks.map(({ icon: Icon, label, tone, fill }) => (
            <button className="grid min-h-[96px] content-center justify-items-center rounded-[20px] border border-[#dce8f3] bg-white px-1 py-3 shadow-[0_7px_20px_rgba(55,94,130,0.07)] transition active:scale-[0.97]" onClick={() => navigate(label === "좋아요" ? PATH.LIKES : PATH.ARCHIVE)} type="button" key={label}>
              <span className={`grid h-[44px] w-[44px] place-items-center rounded-[15px] shadow-sm ${tone}`}><Icon fill={fill ? "currentColor" : "none"} size={23} strokeWidth={2.15} /></span>
              <strong className="mt-2 text-[11px] font-extrabold text-[#445064]">{label}</strong>
            </button>
          ))}
        </section>

        <section className={panelClass} aria-labelledby="travel-style-title">
          <div className="mb-[14px] flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 text-[14px] font-extrabold" id="travel-style-title"><Plane size={16} className="text-[#4eaceb]" />내 여행 스타일</h2>
            <button className="flex h-8 items-center gap-1 rounded-full bg-[#edf7fe] px-2.5 text-[9.5px] font-bold text-[#399fdf]" onClick={openTravelEditor} type="button" aria-label="여행 스타일 수정"><Pencil size={12} />수정</button>
          </div>
          <div className="grid grid-cols-2 gap-[9px]">
            {selectedCategories.map((category) => {
              const Icon = categoryIcons[category.id];
              return <div className={`flex min-w-0 items-center gap-2.5 rounded-[16px] border p-2.5 ${travelToneClasses[category.tone]}`} key={category.id}><span className={`grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[13px] bg-white/75 shadow-sm ${categoryToneClasses[category.tone]}`}><Icon aria-hidden="true" size={20} strokeWidth={2.4} /></span><span className="text-[10px] font-extrabold leading-tight">{category.label}</span></div>;
            })}
          </div>
        </section>

        <section className={`${panelClass} grid gap-[11px]`} aria-labelledby="achievement-title">
          <h2 className="mb-1 flex items-center gap-1.5 text-[14px] font-extrabold" id="achievement-title"><Trophy size={16} className="text-[#f0aa36]" />달성 현황</h2>
          <ProgressRow label="미션 완료" value={2} max={20} color="bg-[#55b2ef]" /><ProgressRow label="배지 획득" value={2} max={8} color="bg-[#9f7bea]" /><ProgressRow label="스탬프" value={2} max={8} color="bg-[#55c9a4]" />
        </section>

        <section className={panelClass} aria-labelledby="social-title">
          <div className="mb-1 flex items-start gap-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[13px] bg-[#eaf7ff] text-[#42a7e9]"><Link2 size={18} strokeWidth={2.3} /></span>
            <div><h2 className="text-[14px] font-extrabold" id="social-title">소셜 로그인</h2><p className="mt-1 text-[9.5px] leading-[1.45] text-[#95a2b0]">연결된 소셜 계정을 확인하거나 새로운 계정을 연결할 수 있어요.</p></div>
          </div>
          <div className="mt-[13px] divide-y divide-[#edf1f5]">
            {loginMethodOptions.map(({ provider, socialProvider, name, mark: Mark, markClass }) => {
              const method = loginMethods.find((item) => item.provider === provider);
              const linked = method?.linked ?? false;
              const isConnecting = pendingConnection === socialProvider;
              return (
                <div className="flex min-h-[58px] items-center gap-2.5 py-2" key={provider}>
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-[12px] ${markClass}`}><Mark /></span>
                  <span className="min-w-0 flex-1">
                    <strong className="block text-[12px] font-extrabold text-[#374356]">{name}</strong>
                    <small className="mt-0.5 block truncate text-[8px] font-medium text-[#9aa5b1]">{isLoadingLoginMethods ? "확인 중..." : method?.maskedEmail || (linked ? "연결됨" : "연결되지 않음")}</small>
                  </span>
                  {isLoadingLoginMethods ? <span className="h-6 w-12 animate-pulse rounded-[7px] bg-[#edf2f5]" /> : linked ? (
                    method?.canUnlink && socialProvider
                      ? <button className="h-7 shrink-0 rounded-[8px] bg-[#fff0f0] px-2.5 font-extrabold text-[#df666b] transition active:scale-95" onClick={() => setUnlinkTarget(method)} style={{ fontSize: "9px", lineHeight: 1 }} type="button">연결 해제</button>
                      : <span className="flex h-7 shrink-0 items-center gap-0.5 rounded-[8px] bg-[#eef9f4] px-2 font-bold text-[#36a97e]" style={{ fontSize: "9px", lineHeight: 1 }}><Check size={9} strokeWidth={2.6} />연결됨</span>
                  ) : socialProvider ? (
                    <button className="h-7 shrink-0 rounded-[8px] bg-[#eaf6ff] px-3 font-extrabold text-[#359fdf] transition active:scale-95 disabled:opacity-50" disabled={Boolean(pendingConnection)} onClick={() => handleConnectLoginMethod(provider as SocialLoginMethodProvider, socialProvider)} style={{ fontSize: "9px", lineHeight: 1 }} type="button">{isConnecting ? "연결 중..." : "연결"}</button>
                  ) : <span className="rounded-[7px] bg-[#f3f6f8] px-2 py-1 text-[7.5px] font-bold text-[#9aa5b1]">미등록</span>}
                </div>
              );
            })}
          </div>
          <p className="mt-2 flex items-start gap-1.5 rounded-[12px] bg-[#f7f9fb] px-3 py-2.5 text-[8.5px] leading-[1.5] text-[#8e9aa7]"><ShieldCheck className="mt-px shrink-0 text-[#6dbb9f]" size={13} />로그인할 수단이 하나 이상 남아 있을 때만 연결을 해제할 수 있어요.</p>
        </section>
        <button className="h-[48px] rounded-[16px] border-2 border-[#f08b8f] bg-white text-[12px] font-extrabold text-[#e4545a] shadow-[0_5px_14px_rgba(224,84,90,0.08)] transition active:scale-[0.99] disabled:cursor-wait disabled:opacity-60" disabled={isLoggingOut} onClick={handleLogout} type="button">{isLoggingOut ? "로그아웃 중..." : "로그아웃"}</button>
        <button className="-mt-1 flex h-10 items-center justify-center gap-1.5 rounded-[14px] text-[10px] font-bold text-[#9aa5b1] transition hover:bg-[#fff0f0] hover:text-[#df666b] active:scale-[0.99]" onClick={() => setShowWithdrawConfirm(true)} type="button"><Trash2 size={13} />회원탈퇴</button>
      </div>

      {statusMessage ? <div className="fixed bottom-[92px] left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-[#25334a] px-4 py-2.5 text-[11px] font-bold text-white shadow-xl" role="status"><Check size={14} className="text-[#6ed4ad]" />{statusMessage}</div> : null}
      {unlinkTarget ? (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-[#132036]/45 px-6 backdrop-blur-[2px]" role="presentation" onMouseDown={() => !isUnlinking && setUnlinkTarget(null)}>
          <section className="w-full max-w-[330px] rounded-[26px] bg-white px-6 pb-6 pt-7 text-center shadow-[0_20px_60px_rgba(20,42,67,0.2)]" role="dialog" aria-modal="true" aria-labelledby="unlink-title" onMouseDown={(event) => event.stopPropagation()}>
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#fff0f0] text-[#e7686d]"><AlertTriangle size={23} strokeWidth={2.2} /></span>
            <h2 className="mt-4 text-[17px] font-extrabold text-[#263248]" id="unlink-title">계정 연결을 해제할까요?</h2>
            <p className="mt-2 break-keep text-[10.5px] leading-[1.65] text-[#8491a1]">해제하면 해당 계정으로 로그인할 수 없어요.<br />다른 로그인 수단은 그대로 유지됩니다.</p>
            <div className="mt-6 grid grid-cols-2 gap-2.5">
              <button className="h-11 rounded-[14px] bg-[#f1f5f8] text-[11px] font-extrabold text-[#647284] disabled:opacity-50" disabled={isUnlinking} onClick={() => setUnlinkTarget(null)} type="button">취소</button>
              <button className="h-11 rounded-[14px] bg-[#e8686d] text-[11px] font-extrabold text-white shadow-[0_7px_16px_rgba(232,104,109,0.22)] disabled:opacity-50" disabled={isUnlinking} onClick={handleUnlinkLoginMethod} type="button">{isUnlinking ? "해제 중..." : "연결 해제"}</button>
            </div>
          </section>
        </div>
      ) : null}
      {showWithdrawConfirm ? (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-[#132036]/45 px-6 backdrop-blur-[2px]" role="presentation" onMouseDown={() => !isWithdrawing && setShowWithdrawConfirm(false)}>
          <section className="w-full max-w-[330px] rounded-[26px] bg-white px-6 pb-6 pt-7 text-center shadow-[0_20px_60px_rgba(20,42,67,0.2)]" role="dialog" aria-modal="true" aria-labelledby="withdraw-title" onMouseDown={(event) => event.stopPropagation()}>
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#fff0f0] text-[#e7686d]"><AlertTriangle size={23} strokeWidth={2.2} /></span>
            <h2 className="mt-4 text-[17px] font-extrabold text-[#263248]" id="withdraw-title">정말 탈퇴하시겠어요?</h2>
            <p className="mt-2 break-keep text-[10.5px] leading-[1.65] text-[#8491a1]">탈퇴하면 계정과 프로필 정보가 삭제되며<br />되돌릴 수 없어요.</p>
            <div className="mt-6 grid grid-cols-2 gap-2.5">
              <button className="h-11 rounded-[14px] bg-[#f1f5f8] text-[11px] font-extrabold text-[#647284] disabled:opacity-50" disabled={isWithdrawing} onClick={() => setShowWithdrawConfirm(false)} type="button">취소</button>
              <button className="h-11 rounded-[14px] bg-[#e8686d] text-[11px] font-extrabold text-white shadow-[0_7px_16px_rgba(232,104,109,0.22)] disabled:opacity-50" disabled={isWithdrawing} onClick={handleWithdraw} type="button">{isWithdrawing ? "탈퇴 처리 중..." : "탈퇴하기"}</button>
            </div>
          </section>
        </div>
      ) : null}
      {editing ? <div className="fixed inset-0 z-[60] flex items-end justify-center bg-[#132036]/35 p-0 backdrop-blur-[2px]" role="presentation" onMouseDown={() => setEditing(false)}><section className="w-full max-w-[430px] rounded-t-[28px] bg-white px-[22px] pb-[max(28px,env(safe-area-inset-bottom))] pt-5 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="edit-profile-title" onMouseDown={(event) => event.stopPropagation()}><div className="mb-5 flex items-center justify-between"><div><p className="mb-1 text-[9px] font-bold uppercase tracking-[1.1px] text-[#50abe8]">My profile</p><h2 className="text-[17px] font-extrabold" id="edit-profile-title">닉네임 수정</h2></div><button className="grid h-9 w-9 place-items-center rounded-full bg-[#f3f6f9] text-[#748193]" onClick={() => setEditing(false)} type="button" aria-label="닫기"><X size={18} /></button></div><label className="grid gap-2 text-[11px] font-bold text-[#536071]">닉네임<input className="h-12 rounded-[15px] border border-[#e0e9f1] bg-[#f7faff] px-4 text-[13px] outline-none focus:border-[#62b7ed] focus:ring-4 focus:ring-[#5bb5f8]/10" autoFocus maxLength={10} minLength={2} onChange={(event) => setDraftNickname(event.target.value)} value={draftNickname} /></label><button className="mt-4 h-12 w-full rounded-[15px] bg-[#53afea] text-[13px] font-extrabold text-white disabled:opacity-40" disabled={draftNickname.trim().length < 2 || isSaving} onClick={saveProfile} type="button">{isSaving ? "저장 중..." : "저장하기"}</button></section></div> : null}
      {editingTravel ? (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-[#132036]/35 backdrop-blur-[2px]" role="presentation" onMouseDown={() => setEditingTravel(false)}>
          <section className="w-full max-w-[430px] rounded-t-[28px] bg-white px-[20px] pb-[max(26px,env(safe-area-inset-bottom))] pt-5 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="edit-travel-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="mb-4 flex items-start justify-between">
              <div><h2 className="text-[17px] font-extrabold" id="edit-travel-title">내 여행 스타일 수정</h2><p className="mt-1 text-[10px] text-[#8d9aa8]">관심 있는 여행 테마를 선택해주세요.</p></div>
              <button className="grid h-9 w-9 place-items-center rounded-full bg-[#f3f6f9] text-[#748193]" onClick={() => setEditingTravel(false)} type="button" aria-label="닫기"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {profileTravelCategories.map((category) => {
                const Icon = categoryIcons[category.id];
                const selected = draftInterests.includes(category.id);
                return (
                  <button aria-pressed={selected} className={`relative flex h-[64px] items-center gap-2.5 rounded-[16px] border px-2.5 text-left transition active:scale-[0.98] ${selected ? travelToneClasses[category.tone] : "border-[#e5edf4] bg-[#fbfdff] text-[#687587]"}`} key={category.id} onClick={() => toggleTravelStyle(category.id)} type="button">
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-[12px] ${categoryToneClasses[category.tone]}`}><Icon aria-hidden="true" size={18} strokeWidth={2.3} /></span>
                    <strong className="pr-3 text-[9.5px] font-extrabold leading-tight">{category.label}</strong>
                    {selected ? <span className="absolute right-2 top-2 grid h-4 w-4 place-items-center rounded-full bg-white/80"><Check size={10} strokeWidth={3} /></span> : null}
                  </button>
                );
              })}
            </div>
            <button className="mt-4 h-12 w-full rounded-[15px] bg-[#53afea] text-[13px] font-extrabold text-white shadow-[0_7px_18px_rgba(65,165,231,0.22)] disabled:bg-[#cad9e4] disabled:shadow-none" disabled={!draftInterests.length || isSaving} onClick={saveTravelStyles} type="button">{isSaving ? "저장 중..." : `선택 완료 · ${draftInterests.length}개`}</button>
          </section>
        </div>
      ) : null}
    </section>
  );
}

function ProgressRow({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return <div><div className="mb-1.5 flex items-center justify-between text-[10px] font-semibold text-[#7d8b9c]"><span>{label}</span><strong className="text-[10px] font-black text-[#344057]">{value} / {max}</strong></div><div className="h-2 overflow-hidden rounded-full bg-[#ecf2f7]" role="progressbar" aria-label={label} aria-valuemax={max} aria-valuemin={0} aria-valuenow={value}><div className={`h-full rounded-full ${color}`} style={{ width: `${(value / max) * 100}%` }} /></div></div>;
}

function GoogleMark() { return <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.6h3.3c1.9-1.8 2.9-4.4 2.9-7.5Z"/><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.3l-3.3-2.6c-.9.6-2.1 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3v2.7A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.4 14a6 6 0 0 1 0-3.9V7.4H3a10 10 0 0 0 0 9.3L6.4 14Z"/><path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.8A9.7 9.7 0 0 0 3 7.4l3.4 2.7C7.2 7.8 9.4 6 12 6Z"/></svg>; }
function KakaoMark() { return <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24"><path fill="#191919" d="M12 4C6.9 4 2.8 7.2 2.8 11.2c0 2.6 1.7 4.8 4.3 6.1l-.9 3.2c-.1.3.3.5.5.3l3.8-2.5 1.5.1c5.1 0 9.2-3.2 9.2-7.2S17.1 4 12 4Z"/></svg>; }
function NaverMark() { return <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24"><path fill="#fff" d="M15.4 12.5 8.3 2H2v20h6.6v-10L15.7 22H22V2h-6.6v10.5Z"/></svg>; }

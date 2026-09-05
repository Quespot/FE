import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowLeft, Camera, Check, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { categoryIcons, categoryToneClasses } from "@/components/home/CategoryGrid";
import { PROFILE_SETUP_KEY } from "@/constants/onboarding";
import { homeCategories } from "@/data/quespot";
import { PATH } from "@/routes/paths";
import questyProfile from "../../assets/questy.svg";

const genderOptions = ["여성", "남성", "선택 안 함"] as const;
const sectionClass = "rounded-[24px] bg-white px-[20px] py-[22px] shadow-[0_8px_30px_rgba(62,102,142,0.07)] ring-1 ring-[#eaf0f6]";
const fieldClass = "type-body2 h-[50px] w-full appearance-none rounded-[15px] border border-[#e4edf5] bg-[#f7faff] px-[15px] text-[#222b45] outline-none transition placeholder:text-[#aab7c5] focus:border-[#63b8f2] focus:bg-white focus:ring-4 focus:ring-[#5bb5f8]/10";

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
  const [profileImage, setProfileImage] = useState(questyProfile);
  const [nickname, setNickname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [region, setRegion] = useState("");
  const [companion, setCompanion] = useState("");
  const [interests, setInterests] = useState<string[]>([]);

  const canSubmit = nickname.trim().length >= 2 && Boolean(birthDate) && Boolean(region) && interests.length > 0;

  const handleProfileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" && setProfileImage(reader.result);
    reader.readAsDataURL(file);
  };

  const toggleInterest = (id: string) => setInterests((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    localStorage.setItem(PROFILE_SETUP_KEY, "true");
    localStorage.setItem("quespot-profile", JSON.stringify({ nickname: nickname.trim(), birthDate, gender, region, companion, interests }));
    navigate(PATH.HOME);
  };

  return (
    <main className="min-h-dvh bg-[#f7faff] text-[#17203b]">
      <header className="sticky top-0 z-20 flex h-[76px] items-end border-b border-[#edf2f7] bg-white/95 px-[22px] pb-[14px] backdrop-blur-xl">
        <button className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full bg-[#eef8ff] text-[#4aacef] transition active:scale-95" aria-label="약관동의로 돌아가기" onClick={() => navigate(PATH.SIGNUP_CHECK)} type="button"><ArrowLeft aria-hidden="true" size={20} strokeWidth={2.3} /></button>
        <div className="ml-[13px] flex h-[38px] w-full items-center justify-between"><h1 className="type-label1">프로필 만들기</h1><span className="type-body4 rounded-full bg-[#eaf6ff] px-[10px] py-[5px] text-[#48a8eb]">2/2</span></div>
      </header>

      <form className="flex flex-col gap-[18px] px-[22px] pb-[max(38px,env(safe-area-inset-bottom))] pt-[26px]" onSubmit={handleSubmit}>
        <section className="flex items-center justify-between px-1 pb-1">
          <div className="min-w-0 pr-3"><p className="type-caption3 mb-2 text-[#52ace9]">마지막 단계예요</p><h2 className="type-brand">나만의 여행 프로필을<br />완성해 주세요</h2><p className="type-caption2 mt-2 text-[#8d99a8]">입력한 정보로 취향에 맞는 미션을 추천해드려요.</p></div>
          <div className="ml-2 flex shrink-0 flex-col items-center">
            <button className="relative grid h-[72px] w-[72px] place-items-center rounded-full bg-[linear-gradient(145deg,#e4f5ff,#f5fbff)] p-[5px] ring-2 ring-white shadow-[0_8px_24px_rgba(64,162,224,0.18)]" aria-label="프로필 사진 선택" onClick={() => imageInputRef.current?.click()} type="button">
              <img className="h-full w-full rounded-full object-contain" src={profileImage} alt="선택된 프로필" />
              <span className="absolute -right-0.5 bottom-0 grid h-[25px] w-[25px] place-items-center rounded-full border-[3px] border-[#f7faff] bg-[#52afeF] text-white"><Camera aria-hidden="true" size={12} strokeWidth={2.6} /></span>
            </button>
            <input className="hidden" ref={imageInputRef} accept="image/*" onChange={handleProfileChange} type="file" />
            <small className="type-body5 mt-2 text-[#929eab]">사진 변경</small>
          </div>
        </section>

        <section className={sectionClass} aria-labelledby="basic-profile-title">
          <div className="mb-[19px] flex items-center justify-between"><div><h3 className="type-body6" id="basic-profile-title">기본 정보</h3><p className="type-body5 mt-[5px] text-[#97a2ae]">필수 정보만 간단히 알려주세요.</p></div><span className="type-body4 rounded-full bg-[#f1f6fa] px-2 py-1 text-[#8996a3]">* 필수</span></div>

          <label className="grid gap-2"><span className="type-caption3 text-[#556171]">닉네임 <b className="text-[#51aceb]">*</b></span><input className={fieldClass} autoComplete="nickname" maxLength={10} minLength={2} onChange={(event) => setNickname(event.target.value)} placeholder="2~10자로 입력해주세요" required value={nickname} /></label>

          <div className="mt-4 grid grid-cols-2 gap-[11px] max-[360px]:grid-cols-1">
            <label className="grid gap-2"><span className="type-caption3 text-[#556171]">생년월일 <b className="text-[#51aceb]">*</b></span><input className={fieldClass} max={today} min="1900-01-01" onChange={(event) => setBirthDate(event.target.value)} required type="date" value={birthDate} /></label>
            <label className="relative grid gap-2"><span className="type-caption3 text-[#556171]">거주 지역 <b className="text-[#51aceb]">*</b></span><select className={`${fieldClass} pr-9`} onChange={(event) => setRegion(event.target.value)} required value={region}><option value="">지역 선택</option><option>서울</option><option>경기</option><option>인천</option><option>강원</option><option>충청</option><option>전라</option><option>경상</option><option>제주</option></select><ChevronDown className="pointer-events-none absolute bottom-[17px] right-3.5 text-[#8b99a8]" aria-hidden="true" size={16} /></label>
          </div>

          <fieldset className="mt-4 min-w-0 border-0 p-0"><legend className="text-[12px] font-bold text-[#556171]">성별 <span className="font-medium text-[#9ba4af]">(선택)</span></legend><div className="mt-2 grid grid-cols-3 gap-1 rounded-[15px] bg-[#f2f6fa] p-1">
            {genderOptions.map((option) => <label className="cursor-pointer" key={option}><input className="peer sr-only" checked={gender === option} name="gender" onChange={() => setGender(option)} type="radio" /><span className="grid h-[40px] place-items-center rounded-[11px] text-[12px] font-medium text-[#7a8693] transition peer-checked:bg-white peer-checked:font-bold peer-checked:text-[#329ee8] peer-checked:shadow-[0_2px_8px_rgba(65,94,122,0.1)]">{option}</span></label>)}
          </div></fieldset>

          <label className="relative mt-4 grid gap-2"><span className="text-[12px] font-bold text-[#556171]">주로 누구와 여행하나요? <em className="font-medium not-italic text-[#9ba4af]">(선택)</em></span><select className={`${fieldClass} pr-9`} onChange={(event) => setCompanion(event.target.value)} value={companion}><option value="">동행 유형을 선택해주세요</option><option>혼자</option><option>친구와</option><option>연인과</option><option>가족과</option><option>반려동물과</option></select><ChevronDown className="pointer-events-none absolute bottom-[17px] right-3.5 text-[#8b99a8]" aria-hidden="true" size={16} /></label>
        </section>

        <section className={sectionClass} aria-labelledby="interest-title">
          <div className="mb-[18px] flex items-start justify-between"><div><h3 className="text-[16px] font-extrabold tracking-[-0.4px]" id="interest-title">관심 있는 여행 테마</h3><p className="mt-[5px] text-[11px] text-[#97a2ae]">여러 개 선택할 수 있어요.</p></div><span className={`rounded-full px-[10px] py-[5px] text-[10px] font-extrabold ${interests.length ? "bg-[#e7f6ff] text-[#329fe9]" : "bg-[#f2f5f8] text-[#9aa5af]"}`}>{interests.length}개 선택</span></div>
          <div className="grid grid-cols-2 gap-[10px] max-[360px]:gap-[8px]">
            {homeCategories.map((category) => {
              const Icon = categoryIcons[category.id];
              const selected = interests.includes(category.id);
              return (
                <button aria-pressed={selected} className={`relative flex h-[64px] min-w-0 items-center gap-[10px] rounded-[17px] border px-[11px] py-[9px] text-left transition active:scale-[0.98] ${selected ? "border-[#69bdf4] bg-[#eff9ff] text-[#218fd8] shadow-[0_4px_12px_rgba(76,167,225,0.1)]" : "border-[#e5edf4] bg-[#fbfdff] text-[#566171]"}`} key={category.id} onClick={() => toggleInterest(category.id)} type="button">
                  <span className={`grid h-[40px] w-[40px] shrink-0 place-items-center rounded-[14px] ${categoryToneClasses[category.tone]}`}><Icon aria-hidden="true" size={21} strokeWidth={2.3} /></span>
                  <strong className="truncate text-[11.5px] font-bold">{category.label}</strong>
                  {selected ? <i className="absolute right-2 top-2 grid h-[18px] w-[18px] place-items-center rounded-full bg-[#50adeb] text-white shadow-sm"><Check aria-hidden="true" size={11} strokeWidth={3} /></i> : null}
                </button>
              );
            })}
          </div>
        </section>

        <p className="px-3 text-center text-[10.5px] leading-[1.6] text-[#97a2ae]">프로필 정보는 마이페이지에서 언제든 수정할 수 있어요.</p>
        <button className="type-body6 flex h-[52px] w-full items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#63bdf7,#48a8eb)] text-white shadow-[0_8px_20px_rgba(65,165,231,0.24)] transition active:scale-[0.99] disabled:cursor-default disabled:bg-[#c9d8e5] disabled:opacity-100 disabled:shadow-none" disabled={!canSubmit} type="submit">Quespot 시작하기</button>
      </form>
    </main>
  );
}

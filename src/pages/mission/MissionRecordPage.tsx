import { useMemo, useState, type HTMLAttributes } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Lightbulb,
  NotebookPen,
  PenLine,
  Sparkles,
  Tag,
  TextQuote,
} from "lucide-react";

import { SubHeader } from "@/components/DeviceFrame";
import Button from "@/components/common/Button";
import { useCreateMissionReflection } from "@/hooks/mutation/useCreateMissionReflection";
import type { MissionDetail } from "@/types/mission";
import { PATH } from "@/routes/paths";

type MissionRecordState = {
  missionId?: number;
  attemptId?: number | null;
  mission?: MissionDetail;
  missionTitle?: string;
};

const reflectionPrompts = [
  "오늘 방문한 장소에서 가장 인상 깊었던 순간은?",
  "이 장소를 친구에게 추천한다면 어떤 점을 말하고 싶나요?",
  "이 미션을 하면서 새롭게 발견한 점은 무엇인가요?",
  "다음에 다시 방문한다면 무엇을 해보고 싶나요?",
];

const keywordSuggestions = [
  "고요함",
  "활기",
  "따뜻함",
  "전통",
  "새로움",
  "여유",
];

const MAX_CONTENT_LENGTH = 300;
const MAX_KEYWORD_LENGTH = 20;

export default function MissionRecordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const state = location.state as MissionRecordState | null;

  const queryAttemptId = Number(searchParams.get("attemptId"));

  const attemptId =
    state?.attemptId ??
    (Number.isFinite(queryAttemptId) && queryAttemptId > 0
      ? queryAttemptId
      : null);

  const missionTitle =
    state?.missionTitle ?? state?.mission?.title ?? "완료한 미션";

  const spotName = state?.mission?.spotName ?? missionTitle;

  const [content, setContent] = useState("");
  const [keyword, setKeyword] = useState("");
  const [promptIndex, setPromptIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const {
    mutate: createReflection,
    isPending: isSavingReflection,
    error: saveError,
  } = useCreateMissionReflection();

  const selectedPrompt = reflectionPrompts[promptIndex];

  const trimmedContent = content.trim();
  const trimmedKeyword = keyword.trim();

  const saveErrorMessage = useMemo(() => {
    if (!saveError) return "";

    if (saveError instanceof Error) {
      return saveError.message;
    }

    return "감상 기록을 저장하지 못했어요.";
  }, [saveError]);

  const isSaveDisabled =
    !attemptId || !trimmedContent || isSavingReflection || isSaved;

  const handleChangePrompt = () => {
    setPromptIndex((prev) => (prev + 1) % reflectionPrompts.length);
  };

  const handleSelectKeyword = (value: string) => {
    setKeyword(value);
  };

  const handleSaveReflection = () => {
    if (!attemptId || !trimmedContent || isSavingReflection) return;

    createReflection(
      {
        attemptId,
        body: {
          content: createReflectionContent({
            prompt: selectedPrompt,
            content: trimmedContent,
            keyword: trimmedKeyword,
          }),
        },
      },
      {
        onSuccess: () => {
          setIsSaved(true);
        },
        onError: (error) => {
          console.error(error);
        },
      },
    );
  };

  if (!attemptId) {
    return (
      <div className="min-h-full bg-[#F4F8FF]">
        <SubHeader title="감상 기록" onBack={() => navigate(-1)} />

        <section className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-[24px] text-center">
          <div className="grid h-[78px] w-[78px] place-items-center rounded-[24px] bg-[#EAF5FF] text-[#5BB5F8]">
            <NotebookPen size={34} strokeWidth={2.4} />
          </div>

          <h1 className="m-0 mt-[20px] text-[20px] font-black leading-[28px] text-[#1C1C3A]">
            감상 기록을 작성할 미션이 없어요
          </h1>

          <p className="m-0 mt-[8px] break-keep text-[13px] font-medium leading-[21px] text-[#6F7B8D]">
            이 페이지는 미션 인증을 완료한 뒤 작성할 수 있어요.
            <br />
            먼저 미션을 완료하고 감상을 남겨보세요.
          </p>

          <Button className="mt-[24px]" onClick={() => navigate(PATH.MISSIONS)}>
            미션 보러가기
          </Button>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#F4F8FF]">
      <SubHeader title="감상 기록" onBack={() => navigate(-1)} />

      <section className="flex flex-col gap-[14px] px-[16px] pb-[28px] pt-[16px] [overflow-y:auto]">
        <section className="relative overflow-hidden rounded-[24px] border border-[#C8E8FF] bg-[linear-gradient(135deg,#EAF5FF_0%,#DDF1FF_52%,#FFFFFF_100%)] px-[18px] py-[18px] shadow-[0_6px_18px_rgba(8,37,95,0.08)]">
          <div className="absolute right-[-18px] top-[-18px] h-[82px] w-[82px] rounded-full bg-white/45" />
          <div className="absolute bottom-[-34px] right-[34px] h-[92px] w-[92px] rounded-full bg-[#BEE3FF]/40" />

          <div className="relative flex items-start gap-[13px]">
            <span className="grid h-[48px] w-[48px] shrink-0 place-items-center rounded-[17px] bg-white text-[#5BB5F8] shadow-[0_4px_12px_rgba(8,37,95,0.08)]">
              <CalendarCheck size={24} strokeWidth={2.5} />
            </span>

            <div className="min-w-0 flex-1">
              <p className="m-0 text-[12px] font-black leading-[17px] text-[#5BB5F8]">
                미션 완료 기록
              </p>

              <h1 className="m-0 mt-[4px] break-keep text-[18px] font-black leading-[25px] text-[#1C1C3A]">
                {missionTitle}
              </h1>

              <p className="m-0 mt-[5px] truncate text-[11px] font-bold leading-[16px] text-[#6F7B8D]">
                {spotName}
              </p>

              <p className="m-0 mt-[3px] text-[11px] font-bold leading-[16px] text-[#A2A9B2]">
                attempt #{attemptId}
              </p>
            </div>
          </div>
        </section>

        {isSaved ? (
          <SavedSection
            missionTitle={missionTitle}
            onMoveMissions={() => navigate(PATH.MISSIONS)}
            onMoveArchive={() => navigate(PATH.ARCHIVE)}
          />
        ) : (
          <>
            <Section>
              <header className="flex items-center justify-between gap-[12px]">
                <div className="flex items-center gap-[7px]">
                  <span className="grid h-[26px] w-[26px] place-items-center rounded-full bg-[#F4F8FF] text-[#8B5CF6]">
                    <TextQuote size={14} strokeWidth={2.5} />
                  </span>

                  <h2 className="m-0 text-[13px] font-black leading-[18px] text-[#1C1C3A]">
                    작성 프롬프트
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={handleChangePrompt}
                  className="inline-flex items-center gap-[3px] rounded-full bg-[#F4F8FF] px-[10px] py-[6px] text-[11px] font-black leading-none text-[#5BB5F8] transition active:scale-[0.98]"
                >
                  다른 질문
                  <ChevronRight size={12} strokeWidth={2.7} />
                </button>
              </header>

              <blockquote className="m-0 mt-[13px] rounded-[16px] bg-[#EAF5FF] px-[14px] py-[13px] break-keep text-[13px] font-black leading-[20px] text-[#1C1C3A]">
                “{selectedPrompt}”
              </blockquote>

              <textarea
                value={content}
                onChange={(event) =>
                  setContent(event.target.value.slice(0, MAX_CONTENT_LENGTH))
                }
                className="mt-[12px] h-[136px] w-full resize-none rounded-[18px] border border-[#EAF5FF] bg-[#FBFDFF] px-[14px] py-[13px] text-[14px] font-medium leading-[22px] text-[#1C1C3A] outline-none placeholder:text-[#C6D1E0] focus:border-[#5BB5F8]"
                placeholder="이 장소에서 느낀 점을 자유롭게 적어보세요..."
                maxLength={MAX_CONTENT_LENGTH}
              />

              <div className="mt-[7px] flex items-center justify-between">
                <p className="m-0 text-[11px] font-medium leading-[16px] text-[#A2A9B2]">
                  최소 한 문장 이상 작성해주세요
                </p>

                <p className="m-0 text-[11px] font-bold leading-[16px] text-[#A2A9B2]">
                  {content.length}/{MAX_CONTENT_LENGTH}
                </p>
              </div>
            </Section>

            <Section>
              <div className="flex items-center gap-[7px]">
                <span className="grid h-[26px] w-[26px] place-items-center rounded-full bg-[#FFF7ED] text-[#F59E0B]">
                  <Tag size={14} strokeWidth={2.5} />
                </span>

                <h2 className="m-0 text-[13px] font-black leading-[18px] text-[#1C1C3A]">
                  이 장소를 한 단어로
                </h2>
              </div>

              <input
                value={keyword}
                onChange={(event) =>
                  setKeyword(event.target.value.slice(0, MAX_KEYWORD_LENGTH))
                }
                className="mt-[13px] h-[46px] w-full rounded-[16px] border border-[#EAF5FF] bg-[#FBFDFF] px-[14px] text-[14px] font-bold text-[#1C1C3A] outline-none placeholder:text-[#C6D1E0] focus:border-[#5BB5F8]"
                placeholder="예: 고요함, 따뜻함, 전통..."
                maxLength={MAX_KEYWORD_LENGTH}
              />

              <div className="mt-[12px] flex flex-wrap gap-[8px]">
                {keywordSuggestions.map((suggestion) => {
                  const isSelected = keyword === suggestion;

                  return (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => handleSelectKeyword(suggestion)}
                      className={[
                        "h-[31px] rounded-full px-[12px] text-[12px] font-black leading-none transition active:scale-[0.98]",
                        isSelected
                          ? "bg-[#5BB5F8] text-white shadow-[0_4px_10px_rgba(91,181,248,0.25)]"
                          : "bg-[#F4F8FF] text-[#6F7B8D]",
                      ].join(" ")}
                    >
                      {suggestion}
                    </button>
                  );
                })}
              </div>
            </Section>

            <section className="rounded-[18px] border border-[#DDEFFF] bg-[#F8FCFF] px-[15px] py-[13px]">
              <div className="flex items-start gap-[9px]">
                <span className="mt-[1px] grid h-[24px] w-[24px] shrink-0 place-items-center rounded-full bg-[#EAF5FF] text-[#5BB5F8]">
                  <Lightbulb size={13} strokeWidth={2.5} />
                </span>

                <p className="m-0 break-keep text-[12px] font-medium leading-[19px] text-[#6F7B8D]">
                  감상 기록은 미션의 추억을 남기는 용도예요. 짧게라도 직접
                  느낀 점을 적으면 나중에 여행 기록으로 다시 볼 수 있어요.
                </p>
              </div>
            </section>

            {saveErrorMessage ? (
              <section className="rounded-[16px] border border-[#FED7AA] bg-[#FFF7ED] px-[15px] py-[13px]">
                <div className="flex items-start gap-[8px]">
                  <AlertCircle
                    size={16}
                    strokeWidth={2.5}
                    className="mt-[1px] shrink-0 text-[#F59E0B]"
                  />

                  <p className="m-0 break-keep text-[12px] font-bold leading-[19px] text-[#EA580C]">
                    {saveErrorMessage}
                  </p>
                </div>
              </section>
            ) : null}

            <Button
              onClick={handleSaveReflection}
              disabled={isSaveDisabled}
              isLoading={isSavingReflection}
              className="mt-[2px] !h-[56px] !rounded-[18px] !text-[15px] !font-black"
            >
              {isSavingReflection ? "감상 저장 중..." : "감상 저장하기"}
            </Button>
          </>
        )}
      </section>
    </div>
  );
}

type SavedSectionProps = {
  missionTitle: string;
  onMoveMissions: () => void;
  onMoveArchive: () => void;
};

function SavedSection({
  missionTitle,
  onMoveMissions,
  onMoveArchive,
}: SavedSectionProps) {
  return (
    <section className="rounded-[24px] border border-[#BBF7D0] bg-white px-[20px] py-[28px] text-center shadow-[0_6px_18px_rgba(8,37,95,0.08)]">
      <div className="mx-auto grid h-[74px] w-[74px] place-items-center rounded-[24px] bg-[#E8FBF3] text-[#00C950]">
        <CheckCircle2 size={38} strokeWidth={2.6} />
      </div>

      <h2 className="m-0 mt-[18px] text-[20px] font-black leading-[28px] text-[#1C1C3A]">
        감상 기록이 저장됐어요!
      </h2>

      <p className="m-0 mt-[8px] break-keep text-[13px] font-medium leading-[21px] text-[#6F7B8D]">
        ‘{missionTitle}’에서 느낀 점을 기록했어요.
        <br />
        다음 미션도 이어서 도전해보세요.
      </p>

      <div className="mt-[22px] flex flex-col gap-[9px]">
        <Button onClick={onMoveMissions}>
          다음 미션 보러가기
          <ArrowRight size={16} strokeWidth={2.5} />
        </Button>

        <Button variant="secondary" onClick={onMoveArchive}>
          아카이브로 이동
        </Button>
      </div>
    </section>
  );
}

type SectionProps = HTMLAttributes<HTMLDivElement>;

function Section({ className = "", children, ...props }: SectionProps) {
  return (
    <section
      className={[
        "flex flex-col rounded-[22px] border border-[#EAF5FF] bg-white p-[16px] shadow-[0_4px_14px_rgba(8,37,95,0.06)]",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </section>
  );
}

function createReflectionContent({
  prompt,
  content,
  keyword,
}: {
  prompt: string;
  content: string;
  keyword: string;
}) {
  if (!keyword) {
    return `[프롬프트]\n${prompt}\n\n[감상]\n${content}`;
  }

  return `[프롬프트]\n${prompt}\n\n[감상]\n${content}\n\n[이 장소를 한 단어로]\n${keyword}`;
}
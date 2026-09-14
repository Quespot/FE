import { ArrowLeft, Loader2 } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import MissionCard from "@/components/home/MissionCard";
import { useToggleMissionLike } from "@/hooks/mutation/useToggleMissionLike";
import { useInfiniteRecommendedMissions } from "@/hooks/queries/useRecommendedMissions";
import { useCurrentCoordinates } from "@/hooks/useCurrentCoordinates";
import QuespotPageLayout, {
  QuespotPageContent,
} from "@/layouts/QuespotPageLayout";
import { PATH } from "@/routes/paths";
import { toRecommendedMissionCard } from "@/utils/recommendedMission";

export default function RecommendedMissionsPage() {
  const navigate = useNavigate();
  const { toggleMissionLike, pendingMissionId } = useToggleMissionLike();
  const { coordinates } = useCurrentCoordinates();
  const query = useInfiniteRecommendedMissions({
    ...coordinates,
    size: 20,
  });
  const missions = useMemo(
    () =>
      query.data?.pages.flatMap((page) =>
        page.result.missions.map(toRecommendedMissionCard),
      ) ?? [],
    [query.data],
  );

  return (
    <QuespotPageLayout className="bg-[#F2F7FF]">
      <header className="flex h-[72px] shrink-0 items-center gap-3 border-b border-[#e5edf5] bg-white px-[18px]">
        <button
          type="button"
          aria-label="홈으로 돌아가기"
          onClick={() => navigate(PATH.HOME)}
          className="grid h-10 w-10 place-items-center rounded-full bg-[#eef8ff] text-[#4aacef] transition active:scale-95"
        >
          <ArrowLeft size={20} strokeWidth={2.3} />
        </button>

        <div>
          <h1 className="m-0 text-[18px] font-black text-[#1c1c3a]">
            추천 미션
          </h1>
          <p className="m-0 mt-0.5 text-[11px] font-semibold text-[#9aa8b8]">
            지금 바로 시작할 수 있는 미션이에요
          </p>
        </div>
      </header>

      <QuespotPageContent className="bg-[#F2F7FF] px-[18px] py-[20px]">
        {query.isLoading ? (
          <LoadingState />
        ) : query.isError ? (
          <ErrorState onRetry={() => query.refetch()} />
        ) : missions.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              {missions.map((mission) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  isLikePending={pendingMissionId === mission.id}
                  onLikeClick={() =>
                    toggleMissionLike({
                      missionId: Number(mission.id),
                      liked: Boolean(mission.liked),
                    })
                  }
                  onClick={() =>
                    navigate(
                      PATH.MISSION_DETAIL.replace(
                        ":missionId",
                        String(mission.id),
                      ),
                    )
                  }
                />
              ))}
            </div>

            {query.hasNextPage ? (
              <button
                type="button"
                disabled={query.isFetchingNextPage}
                onClick={() => query.fetchNextPage()}
                className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-[14px] font-black text-[#5bb5f8] shadow-[0_2px_8px_rgba(8,37,95,0.08)] disabled:opacity-60"
              >
                {query.isFetchingNextPage ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : null}
                {query.isFetchingNextPage ? "불러오는 중" : "추천 미션 더보기"}
              </button>
            ) : (
              <p className="m-0 py-6 text-center text-[12px] font-semibold text-[#a2adba]">
                추천 미션을 모두 확인했어요.
              </p>
            )}
          </>
        )}
      </QuespotPageContent>
    </QuespotPageLayout>
  );
}

function LoadingState() {
  return (
    <div className="grid grid-cols-2 gap-3" aria-label="추천 미션 불러오는 중">
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className="h-[210px] animate-pulse rounded-2xl bg-[#e3edf7]" />
      ))}
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <section className="grid min-h-[360px] place-content-center text-center">
      <div className="text-[38px]">☁️</div>
      <strong className="mt-3 text-[16px] text-[#1c1c3a]">
        추천 미션을 불러오지 못했어요
      </strong>
      <button
        type="button"
        onClick={onRetry}
        className="mx-auto mt-5 h-10 rounded-full bg-[#5bb5f8] px-5 text-[13px] font-black text-white"
      >
        다시 시도
      </button>
    </section>
  );
}

function EmptyState() {
  return (
    <section className="grid min-h-[360px] place-content-center text-center">
      <div className="text-[42px]">🧭</div>
      <strong className="mt-3 text-[16px] text-[#1c1c3a]">
        지금 추천할 수 있는 미션이 없어요
      </strong>
      <p className="m-0 mt-2 text-[13px] font-medium text-[#9aa8b8]">
        새로운 미션이 생기면 여기에 보여드릴게요.
      </p>
    </section>
  );
}

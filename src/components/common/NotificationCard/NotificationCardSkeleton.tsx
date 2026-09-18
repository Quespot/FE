import { ContentCard } from "../ContentCard";

interface NotificationCardSkeletonProps {
  showDescription?: boolean;
  showAmount?: boolean;
}

export function NotificationCardSkeleton({
  showDescription = true,
  showAmount = true,
}: NotificationCardSkeletonProps) {
  return (
    <ContentCard className="relative bg-white" aria-hidden="true">
      <div className="flex animate-pulse gap-3 motion-reduce:animate-none">
        <div className="h-12 w-12 shrink-0 rounded-2xl bg-slate-100" />

        <div className="flex min-w-0 flex-1 flex-col pr-4">
          <div className="my-1 h-3 w-3/4 rounded bg-slate-200" />

          {showDescription && (
            <div className="mt-1 h-3 w-full rounded bg-slate-100" />
          )}

          <div className="mt-2 h-2.5 w-16 rounded bg-slate-100" />
        </div>

        {showAmount && (
          <div className="flex shrink-0 items-center">
            <div className="h-5 w-12 rounded bg-slate-100" />
          </div>
        )}
      </div>
    </ContentCard>
  );
}

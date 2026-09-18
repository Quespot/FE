import { useEffect, useState, type RefObject } from "react";

type UseInfiniteScrollOptions = {
  hasNextPage: boolean;
  isFetching: boolean;
  isError: boolean;
  fetchNextPage: () => Promise<unknown>;
  enabled?: boolean;
  rootRef?: RefObject<HTMLElement | null>;
};

// 하단 요소가 실제 스크롤 영역에 들어오면 다음 페이지를 요청합니다.
export function useInfiniteScroll({
  hasNextPage,
  isFetching,
  isError,
  fetchNextPage,
  enabled = true,
  rootRef,
}: UseInfiniteScrollOptions) {
  const [target, setTarget] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!target || !enabled || !hasNextPage || isFetching || isError) return;

    let root = rootRef?.current ?? null;
    if (!rootRef) {
      let parent = target.parentElement;
      while (parent) {
        if (/(auto|scroll|overlay)/.test(getComputedStyle(parent).overflowY)) {
          root = parent;
          break;
        }
        parent = parent.parentElement;
      }
    }

    let requested = false;
    let active = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!active || !entry.isIntersecting || requested) return;
        requested = true;
        // 오류 표시는 각 화면의 쿼리 상태로 처리합니다.
        void fetchNextPage().catch(() => undefined);
      },
      { root, rootMargin: "0px 0px 120px 0px" },
    );
    observer.observe(target);
    return () => {
      active = false;
      observer.disconnect();
    };
  }, [target, enabled, hasNextPage, isFetching, isError, fetchNextPage, rootRef]);

  return setTarget;
}

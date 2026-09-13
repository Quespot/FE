import { useQuery } from "@tanstack/react-query";

import { getMissionCourseDetail } from "@/apis/missionCourse";

export function useMissionCourseDetail(courseId?: number | null) {
  return useQuery({
    queryKey: ["missionCourseDetail", courseId],
    queryFn: () => getMissionCourseDetail(courseId as number),
    enabled: Boolean(courseId) && Number.isFinite(courseId) && courseId! > 0,
    staleTime: 1000 * 60,
    retry: false,
  });
}
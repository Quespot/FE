import { useQuery } from "@tanstack/react-query";

import { getMissionCourses } from "@/apis/missionCourse";

export function useMissionCourses() {
  return useQuery({
    queryKey: ["missionCourses"],
    queryFn: getMissionCourses,
    staleTime: 1000 * 60,
    retry: false,
  });
}
import { useQuery } from "@tanstack/react-query";

import { getCourseAttempts } from "@/apis/missionCourse";

export function useCourseAttempts() {
  return useQuery({
    queryKey: ["courseAttempts"],
    queryFn: getCourseAttempts,
    staleTime: 1000 * 60,
    retry: false,
  });
}
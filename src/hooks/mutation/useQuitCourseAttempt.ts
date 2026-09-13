import { useMutation, useQueryClient } from "@tanstack/react-query";

import { quitCourseAttempt } from "@/apis/missionCourse";

export function useQuitCourseAttempt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseAttemptId: number) =>
      quitCourseAttempt(courseAttemptId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courseAttempts"],
      });

      queryClient.invalidateQueries({
        queryKey: ["missionCourses"],
      });
    },
  });
}
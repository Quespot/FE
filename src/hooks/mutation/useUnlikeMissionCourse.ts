import { useMutation, useQueryClient } from "@tanstack/react-query";

import { unlikeMissionCourse } from "@/apis/like";

export function useUnlikeMissionCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: number) => unlikeMissionCourse(courseId),
    onSuccess: (_, courseId) => {
      queryClient.invalidateQueries({
        queryKey: ["missionCourses"],
      });

      queryClient.invalidateQueries({
        queryKey: ["missionCourseDetail", courseId],
      });

      queryClient.invalidateQueries({
        queryKey: ["likedCourses"],
      });
    },
  });
}
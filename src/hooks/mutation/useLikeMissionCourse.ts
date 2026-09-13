import { useMutation, useQueryClient } from "@tanstack/react-query";

import { likeMissionCourse } from "@/apis/like";

export function useLikeMissionCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: number) => likeMissionCourse(courseId),
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
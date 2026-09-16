import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createMissionCourse } from "@/apis/missionCourse";
import type {
  CreateMissionCourseRequest,
  MissionCourseDetail,
} from "@/types/missionCourse";

export function useCreateMissionCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateMissionCourseRequest) => createMissionCourse(body),
    onSuccess: (createdCourse: MissionCourseDetail) => {
      queryClient.invalidateQueries({
        queryKey: ["missionCourses"],
      });

      queryClient.invalidateQueries({
        queryKey: ["courseAttempts"],
      });

      queryClient.setQueryData(
        ["missionCourseDetail", createdCourse.courseId],
        createdCourse,
      );
    },
  });
}
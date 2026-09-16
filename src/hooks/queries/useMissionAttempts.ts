import { useQuery } from "@tanstack/react-query";

import { getMissionAttempts } from "@/apis/missionAttempt";

export function useMissionAttempts() {
  return useQuery({
    queryKey: ["missionAttempts"],
    queryFn: getMissionAttempts,
    staleTime: 0,
    refetchOnMount: "always",
    retry: false,
  });
}

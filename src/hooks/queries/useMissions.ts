import { useQuery } from "@tanstack/react-query";

import { getMissions } from "@/apis/mission";
import type { GetMissionsParams } from "@/types/mission";

export function useMissions(params: GetMissionsParams) {
  return useQuery({
    queryKey: ["missions", params],
    queryFn: () => getMissions(params),
    staleTime: 1000 * 60,
    retry: false,
  });
}
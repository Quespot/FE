import { useQuery } from "@tanstack/react-query";

import { getMyQuesty } from "@/apis/item";
import { getProfile } from "@/apis/profile";

export function useHomeProfile() {
  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const questyQuery = useQuery({
    queryKey: ["items", "questy"],
    queryFn: getMyQuesty,
    staleTime: 1000 * 60,
    retry: false,
  });

  return { profileQuery, questyQuery };
}

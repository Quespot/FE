import { useQuery } from "@tanstack/react-query";

import { getAllArchivePhotos, getArchiveMap, type ArchiveMapParams } from "@/apis/archive";

export function useArchiveMap(params: ArchiveMapParams) {
  return useQuery({
    queryKey: ["archives", "map", params],
    queryFn: () => getArchiveMap(params),
    staleTime: 1000 * 30,
    retry: false,
  });
}

export function useArchivePhotos() {
  return useQuery({
    queryKey: ["archives", "photos"],
    queryFn: getAllArchivePhotos,
    staleTime: 1000 * 30,
    retry: false,
  });
}

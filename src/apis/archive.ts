import { apiClient } from "@/apis/client";

export type ArchiveCategory =
  | "HISTORY"
  | "CULTURE"
  | "NATURE"
  | "FOOD"
  | "NIGHT_VIEW"
  | "ETC";

export type ArchiveFeedItem = {
  photoId: number;
  source: "MISSION" | "ARCHIVE";
  imageUrl: string;
  caption: string;
  missionId: number | null;
  missionTitle: string | null;
  missionCategory: ArchiveCategory | null;
  completedAt: string | null;
  createdAt: string;
};

export type ArchiveFeedResult = {
  archives: ArchiveFeedItem[];
  nextCursor: string | null;
  hasNext: boolean;
};

export type ArchiveMapParams = {
  yearMonth?: string;
  regionCode?: string;
  category?: ArchiveCategory;
};

export type ArchiveMapResult = {
  footprint: {
    completedMissionCount: number;
    totalEarnedPoint: number;
  };
  completedMissions: Array<{
    missionId: number;
    spotName: string;
    latitude: number;
    longitude: number;
    completedAt: string;
    earnedPoint: number;
  }>;
};

type ApiEnvelope<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
  errorDetail?: string;
};

export async function getArchiveMap(params: ArchiveMapParams = {}) {
  const { data } = await apiClient.get<ApiEnvelope<ArchiveMapResult>>(
    "/api/users/me/archives/map",
    { params },
  );
  return data.result;
}

async function getArchiveFeedPage(cursor?: string, size = 50) {
  const { data } = await apiClient.get<ApiEnvelope<ArchiveFeedResult>>(
    "/api/users/me/archives",
    { params: { cursor, size } },
  );
  return data.result;
}

export async function getAllArchivePhotos() {
  const archives: ArchiveFeedItem[] = [];
  const usedCursors = new Set<string>();
  let cursor: string | undefined;

  for (let pageNumber = 0; pageNumber < 100; pageNumber += 1) {
    const page = await getArchiveFeedPage(cursor);
    archives.push(...page.archives);

    if (!page.hasNext || !page.nextCursor || usedCursors.has(page.nextCursor)) break;
    usedCursors.add(page.nextCursor);
    cursor = page.nextCursor;
  }

  return archives;
}

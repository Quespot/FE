export type SpotStatus = "completed" | "available" | "current";

export type LatLng = {
  lat: number;
  lng: number;
};

export type RoutePlace = {
  id: number;
  name: string;
  area: string;
  emoji: string;
  lat: number;
  lng: number;
  duration: string;
  distance: string;
  direction: string;
};

export type MapSpot = {
  id: number;
  name: string;
  shortName: string;
  emoji: string;
  lat: number;
  lng: number;
  status: SpotStatus;
  missionCount?: number;
  places: RoutePlace[];
};

export const SEOUL_JONGNO_CENTER: LatLng = {
  lat: 37.5759,
  lng: 126.9768,
};

export const DEFAULT_CURRENT_LOCATION: LatLng = {
  lat: 37.5752,
  lng: 126.9812,
};

export const MAP_SPOTS: MapSpot[] = [
  {
    id: 1,
    name: "경복궁",
    shortName: "경복궁",
    emoji: "🏯",
    lat: 37.579617,
    lng: 126.977041,
    status: "completed",
    places: [
      {
        id: 101,
        name: "경복궁 정문 인증샷",
        area: "서울 종로구 세종로",
        emoji: "🏯",
        lat: 37.579617,
        lng: 126.977041,
        duration: "도보 9분",
        distance: "650m",
        direction: "북서쪽으로",
      },
    ],
  },
  {
    id: 2,
    name: "북촌",
    shortName: "북촌",
    emoji: "🏡",
    lat: 37.582604,
    lng: 126.984874,
    status: "completed",
    places: [
      {
        id: 201,
        name: "북촌 한옥 골목",
        area: "서울 종로구 계동",
        emoji: "🏡",
        lat: 37.582604,
        lng: 126.984874,
        duration: "도보 14분",
        distance: "1.1km",
        direction: "북쪽으로",
      },
    ],
  },
  {
    id: 3,
    name: "인사동",
    shortName: "인사동",
    emoji: "☕",
    lat: 37.574331,
    lng: 126.985944,
    status: "available",
    missionCount: 2,
    places: [
      {
        id: 301,
        name: "인사동 전통찻집",
        area: "서울 종로구 인사동",
        emoji: "☕",
        lat: 37.574331,
        lng: 126.985944,
        duration: "도보 18분",
        distance: "1.3km",
        direction: "북쪽으로",
      },
      {
        id: 302,
        name: "쌈지길 포토존",
        area: "서울 종로구 인사동길",
        emoji: "🎨",
        lat: 37.574701,
        lng: 126.984822,
        duration: "도보 16분",
        distance: "1.2km",
        direction: "북쪽으로",
      },
    ],
  },
  {
    id: 4,
    name: "명동",
    shortName: "명동",
    emoji: "🛍️",
    lat: 37.563692,
    lng: 126.98221,
    status: "available",
    missionCount: 4,
    places: [
      {
        id: 401,
        name: "명동 거리 쇼핑 미션",
        area: "서울 중구 명동",
        emoji: "🛍️",
        lat: 37.563692,
        lng: 126.98221,
        duration: "도보 28분",
        distance: "2.5km",
        direction: "남쪽으로",
      },
      {
        id: 402,
        name: "명동성당 포토 미션",
        area: "서울 중구 명동길",
        emoji: "⛪",
        lat: 37.56313,
        lng: 126.987221,
        duration: "도보 26분",
        distance: "2.3km",
        direction: "남동쪽으로",
      },
      {
        id: 403,
        name: "명동 간식 탐방",
        area: "서울 중구 명동",
        emoji: "🍡",
        lat: 37.562981,
        lng: 126.984802,
        duration: "도보 27분",
        distance: "2.4km",
        direction: "남쪽으로",
      },
      {
        id: 404,
        name: "명동 야경 산책",
        area: "서울 중구 명동",
        emoji: "🌙",
        lat: 37.564002,
        lng: 126.982507,
        duration: "도보 29분",
        distance: "2.6km",
        direction: "남쪽으로",
      },
    ],
  },
  {
    id: 5,
    name: "성수동",
    shortName: "성수동",
    emoji: "🎨",
    lat: 37.544581,
    lng: 127.055961,
    status: "available",
    missionCount: 3,
    places: [
      {
        id: 501,
        name: "성수동 감성 카페",
        area: "서울 성동구 성수동",
        emoji: "☕",
        lat: 37.544581,
        lng: 127.055961,
        duration: "대중교통 34분",
        distance: "8.1km",
        direction: "동쪽으로",
      },
      {
        id: 502,
        name: "성수 팝업스토어",
        area: "서울 성동구 연무장길",
        emoji: "🎁",
        lat: 37.543905,
        lng: 127.054644,
        duration: "대중교통 36분",
        distance: "8.3km",
        direction: "동쪽으로",
      },
      {
        id: 503,
        name: "서울숲 산책 미션",
        area: "서울 성동구 뚝섬로",
        emoji: "🌳",
        lat: 37.544388,
        lng: 127.037442,
        duration: "대중교통 31분",
        distance: "7.2km",
        direction: "동쪽으로",
      },
    ],
  },
];
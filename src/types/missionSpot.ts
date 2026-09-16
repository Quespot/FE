export type NearbyMissionSpot = {
  districtCode: string;
  districtName: string;
  latitude: number;
  longitude: number;
  missionCount: number;
  completedMissionCount: number;
  completionStatus: string;
  distanceMeters: number;
};

export type NearbyMissionSpotsResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    missionSpots: NearbyMissionSpot[];
  };
  errorDetail: string | null;
};

export type GetNearbyMissionSpotsParams = {
  latitude: number;
  longitude: number;
  limit?: number;
};

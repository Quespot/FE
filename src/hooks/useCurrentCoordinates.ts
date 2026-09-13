import { useEffect, useState } from "react";

export type CurrentCoordinates = {
  latitude: number;
  longitude: number;
};

export type CurrentCoordinatesStatus = "loading" | "success" | "error";

export function useCurrentCoordinates() {
  const [coordinates, setCoordinates] = useState<CurrentCoordinates | null>(null);
  const [status, setStatus] = useState<CurrentCoordinatesStatus>("loading");

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setStatus("success");
      },
      () => {
        setStatus("error");
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 1000 * 60 * 5,
      },
    );
  }, []);

  return { coordinates, status };
}

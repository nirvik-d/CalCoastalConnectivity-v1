import { useEffect } from "react";

interface DisplayPlacesProps {
  mapRef?: any;
  layerRef?: any;
}

function DisplayPlaces({ mapRef, layerRef }: DisplayPlacesProps) {
  useEffect(() => {
    const arcgisMap = mapRef.current;
    if (!arcgisMap) return;

    const coastalPlacesLayer = layerRef.current;
    if (!coastalPlacesLayer) return;

    arcgisMap.map.add(coastalPlacesLayer);
  }, [mapRef, layerRef]);

  return null;
}

export default DisplayPlaces;

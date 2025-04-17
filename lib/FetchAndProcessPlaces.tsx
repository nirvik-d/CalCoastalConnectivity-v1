import { useEffect } from "react";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import {
  removeDuplicates,
  createPlaceGraphics,
  queryPlacesByName,
} from "./FetchAndProcessPlacesUtils";

interface FetchAndProcessDataProps {
  layerRef?: any;
  layers?: any;
  onDataLoaded: (loaded: boolean) => void;
}

function FetchAndProcessData({
  layers,
  layerRef,
  onDataLoaded,
}: FetchAndProcessDataProps) {
  useEffect(() => {
    const coastalBuffersLayer = layers[0],
      placesLayer = layers[1];
    let coastalPlacesGraphicsLayer: any;

    coastalPlacesGraphicsLayer = new GraphicsLayer();
    const additionalPlaces = ["Huntington Beach", "Costa Mesa"];

    coastalBuffersLayer.queryFeatures().then((bufferResults: any) => {
      if (!bufferResults.features.length) return;
      const spatialQueries = bufferResults.features.map((bufferFeature: any) =>
        placesLayer.queryFeatures({
          geometry: bufferFeature.geometry,
          spatialRelationship: "intersects",
          returnGeometry: true,
          outFields: ["*"],
        })
      );

      Promise.all(spatialQueries)
        .then((placeQueryResults) => {
          const allPlaces = placeQueryResults.flatMap((res) => res.features);
          const uniquePlaces = removeDuplicates(allPlaces, "OBJECTID");
          if (uniquePlaces.length > 0) {
            const placeGraphics = createPlaceGraphics(uniquePlaces);
            coastalPlacesGraphicsLayer.addMany(placeGraphics);
          }
          return queryPlacesByName(placesLayer, additionalPlaces);
        })
        .then((additionalPlaces: any) => {
          if (additionalPlaces.length > 0) {
            const uniqueAdditionalPlaces = removeDuplicates(
              additionalPlaces,
              "OBJECTID"
            );

            const graphics = createPlaceGraphics(uniqueAdditionalPlaces);
            coastalPlacesGraphicsLayer.addMany(graphics);
          }
          layerRef.current = coastalPlacesGraphicsLayer;
          console.log(coastalPlacesGraphicsLayer);
          onDataLoaded(true);
        })
        .catch((error: any) => {
          console.error("Error querying places:", error);
        });
    });
  }, [layerRef]);

  return null;
}

export default FetchAndProcessData;

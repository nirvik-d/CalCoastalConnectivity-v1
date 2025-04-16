import { useEffect } from "react";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";

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

    function removeDuplicates(features: any[], key: any) {
      const seen = new Set();
      return features.filter((feature: any) => {
        const id = feature.attributes[key];
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      });
    }

    function createPlaceGraphics(features: any[]) {
      return features.map(
        (feature) =>
          new Graphic({
            geometry: feature.geometry,
            attributes: feature.attributes,
            symbol: {
              type: "simple-fill",
              color: [0, 120, 255, 0.5],
              outline: {
                color: [0, 0, 0, 0.6],
                width: 1,
              },
            },
            popupTemplate: {
              title: "{CDTFA_CITY}",
              content: `
        <b>Census Place Type:</b> {CENSUS_PLACE_TYPE}<br/>
        <b>County:</b> {CDTFA_COUNTY}
      `,
            },
          })
      );
    }

    async function queryPlacesByName(placesLayer: any, placeNames: string[]) {
      const queries = placeNames.map((place) =>
        placesLayer.queryFeatures({
          where: `CDTFA_CITY = '${place}'`,
          returnGeometry: true,
          outFields: ["*"],
        })
      );
      const results = await Promise.all(queries);
      return results.flatMap((result) => result.features);
    }
  }, [layerRef]);

  return null;
}
export default FetchAndProcessData;

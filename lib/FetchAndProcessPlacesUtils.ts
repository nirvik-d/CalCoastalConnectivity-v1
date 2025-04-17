import Graphic from "@arcgis/core/Graphic";

export function removeDuplicates(features: any[], key: any) {
  const seen = new Set();
  return features.filter((feature: any) => {
    const id = feature.attributes[key];
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

export function createPlaceGraphics(features: any[]) {
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

export async function queryPlacesByName(
  placesLayer: any,
  placeNames: string[]
) {
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

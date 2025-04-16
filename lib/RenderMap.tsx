import esriConfig from "@arcgis/core/config";

import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-search";
import { useEffect } from "react";

interface RenderMapProps {
  basemap?: any;
  center?: any;
  zoom?: any;
  mapRef?: any;
  mapViewRef?: any;
  onRenderingComplete: (complete: boolean) => void;
}

function RenderMap({
  basemap,
  center,
  zoom,
  mapRef,
  mapViewRef,
  onRenderingComplete,
}: RenderMapProps) {
  esriConfig.apiKey = import.meta.env.VITE_ARCGIS_API_KEY;
  useEffect(() => {
    mapViewRef.current = mapRef.current.view;
    onRenderingComplete(true);
  });
  return (
    <>
      <arcgis-map basemap={basemap} center={center} zoom={zoom} ref={mapRef}>
        <arcgis-zoom></arcgis-zoom>
        <arcgis-search></arcgis-search>
      </arcgis-map>
    </>
  );
}

export default RenderMap;

import esriConfig from "@arcgis/core/config";

import "@arcgis/map-components/components/arcgis-scene";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-navigation-toggle";

interface RenderSceneProps {
  basemap?: any;
  ground?: any;
  cameraPosition?: any;
  cameraTilt?: any;
  sceneRef?: any;
}

function RenderScene({
  basemap,
  ground,
  cameraPosition,
  cameraTilt,
  sceneRef,
}: RenderSceneProps) {
  esriConfig.apiKey = import.meta.env.VITE_ARCGIS_API_KEY;
  return (
    <arcgis-scene
      basemap={basemap}
      ground={ground}
      camera-position={cameraPosition}
      camera-tilt={cameraTilt}
      ref={sceneRef}
    >
      <arcgis-zoom position="top-left"></arcgis-zoom>
      <arcgis-navigation-toggle position="top-left"></arcgis-navigation-toggle>
    </arcgis-scene>
  );
}

export default RenderScene;

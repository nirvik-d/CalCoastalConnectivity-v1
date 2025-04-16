import "./App.css";
import DisplayPlaces from "../lib/DisplayPlaces.tsx";
import RenderUI from "../lib/RenderUI.tsx";
import { useRef, useState } from "react";
import RenderMap from "../lib/RenderMap.tsx";
import FetchAndProcessData from "../lib/FetchAndProcessData";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

function App() {
  const [renderingComplete, setRenderingComplete] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const mapRef = useRef<any>(null),
    coastalPlacesLayerRef = useRef<any>(null),
    mapViewRef = useRef<any>(null);

  const coastalBuffersLayer = new FeatureLayer({
    url: "https://services3.arcgis.com/uknczv4rpevve42E/arcgis/rest/services/California_County_Boundaries_and_Identifiers_with_Coastal_Buffers/FeatureServer/1/",
    outFields: ["*"],
    definitionExpression: "OFFSHORE IS NOT NULL",
  });

  const citiesLayer = new FeatureLayer({
    url: "https://services3.arcgis.com/uknczv4rpevve42E/arcgis/rest/services/California_Cities_and_Identifiers_Blue_Version_view/FeatureServer/2/",
    outFields: ["*"],
  });

  function handleDataLoaded(loaded: boolean) {
    setDataLoaded(loaded);
  }
  function handleRenderingComplete(complete: boolean) {
    setRenderingComplete(complete);
  }

  return (
    <>
      <FetchAndProcessData
        layers={[coastalBuffersLayer, citiesLayer]}
        layerRef={coastalPlacesLayerRef}
        onDataLoaded={handleDataLoaded}
      />
      <RenderMap
        basemap="arcgis/navigation"
        center={[-117.9988, 33.6595]}
        zoom={8}
        mapRef={mapRef}
        mapViewRef={mapViewRef}
        onRenderingComplete={handleRenderingComplete}
      />
      {dataLoaded && renderingComplete && (
        <>
          <DisplayPlaces mapRef={mapRef} layerRef={coastalPlacesLayerRef} />
          <RenderUI
            mapRef={mapRef}
            viewRef={mapViewRef}
            layerRef={coastalPlacesLayerRef}
          />
        </>
      )}
    </>
  );
}

export default App;

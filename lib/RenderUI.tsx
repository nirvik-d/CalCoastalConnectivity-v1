import React, { useEffect, useRef, useState } from "react";
import { defineCustomElements } from "@esri/calcite-components/loader";
import { handlePlaceChange } from "./RenderUIUtils";

interface UIProps {
  mapRef?: any;
  viewRef: any;
  layerRef?: any;
}

function RenderUI({ mapRef, viewRef, layerRef }: UIProps) {
  useEffect(() => {
    defineCustomElements(window);
  }, [mapRef, layerRef]);

  const coastalPlacesLayer = layerRef.current;
  const divRef = useRef<any>(null);
  const [position, setPosition] = useState({ x: 15, y: 200 });
  const seen = new Set();

  const handleDragStart = (e: any) => {
    const startX = e.clientX;
    const startY = e.clientY;

    const initX = position.x;
    const initY = position.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      setPosition({ x: initX + deltaX, y: initY + deltaY });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      className="place-selector"
      ref={divRef}
      onMouseDown={handleDragStart}
      style={{ left: position.x, top: position.y }}
    >
      <calcite-label layout="inline" style={{ fontWeight: "bold" }}>
        Explore Beach Cities and Towns
      </calcite-label>
      <calcite-select
        id="townSelect"
        oncalciteSelectChange={(e) =>
          handlePlaceChange(e, coastalPlacesLayer, viewRef)
        }
        label=""
      >
        <calcite-option value="" disabled selected>
          Pick a city or town
        </calcite-option>
        {[...coastalPlacesLayer?.graphics?.items]
          .filter((city) => {
            const name = city.attributes.CDTFA_CITY;
            if (seen.has(name)) return false;
            seen.add(name);
            return true;
          })
          .sort((a, b) =>
            a.attributes.CDTFA_CITY.localeCompare(b.attributes.CDTFA_CITY)
          )
          .map((city: any) => (
            <calcite-option
              key={`${city.attributes.CDTFA_CITY}`}
              value={city.attributes.CDTFA_CITY}
            >
              {city.attributes.CDTFA_CITY}
            </calcite-option>
          ))}
      </calcite-select>
    </div>
  );
}

export default RenderUI;

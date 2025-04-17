import { describe, expect, it, vi } from "vitest";
import Polygon from "@arcgis/core/geometry/Polygon";
import {
  removeDuplicates,
  createPlaceGraphics,
  queryPlacesByName,
} from "../lib/FetchAndProcessPlacesUtils";
import { handlePlaceChange } from "../lib/RenderUIUtils";

describe("removeDuplicates", () => {
  it("removes duplicate features based on a key", () => {
    const features = [
      { attributes: { id: 1 } },
      { attributes: { id: 2 } },
      { attributes: { id: 1 } },
    ];

    const result = removeDuplicates(features, "id");
    expect(result).toHaveLength(2);
    expect(result[0].attributes.id).toBe(1);
    expect(result[1].attributes.id).toBe(2);
  });

  it("returns the same array if no duplicates exist", () => {
    const features = [{ attributes: { id: "a" } }, { attributes: { id: "b" } }];
    const result = removeDuplicates(features, "id");
    expect(result).toHaveLength(2);
  });
});

describe("createPlaceGraphics", () => {
  it("creates Graphic instances with correct structure", () => {
    const polygon = new Polygon({
      rings: [
        [
          [-118.5, 33.5],
          [-118.5, 33.6],
          [-118.4, 33.6],
          [-118.4, 33.5],
          [-118.5, 33.5], // closed ring
        ],
      ],
      spatialReference: { wkid: 4326 },
    });

    const features = [
      {
        geometry: polygon,
        attributes: {
          CDTFA_CITY: "Laguna Beach",
          CENSUS_PLACE_TYPE: "City",
          CDTFA_COUNTY: "Orange",
        },
      },
    ];

    const graphics = createPlaceGraphics(features);
    expect(graphics).toHaveLength(1);
    expect(graphics[0].geometry).toEqual(features[0].geometry);
    expect(graphics[0].attributes).toEqual(features[0].attributes);
    expect(graphics[0].popupTemplate?.title).toBe("{CDTFA_CITY}");
  });
});

describe("queryPlacesByName", () => {
  it("queries multiple place names and returns flattened features", async () => {
    const mockQueryFeatures = vi
      .fn()
      .mockResolvedValueOnce({ features: [{ attributes: { name: "A" } }] })
      .mockResolvedValueOnce({ features: [{ attributes: { name: "B" } }] });

    const mockLayer = { queryFeatures: mockQueryFeatures };
    const result = await queryPlacesByName(mockLayer, ["A", "B"]);

    expect(mockQueryFeatures).toHaveBeenCalledTimes(2);
    expect(result).toHaveLength(2);
    expect(result[0].attributes.name).toBe("A");
    expect(result[1].attributes.name).toBe("B");
  });
});

describe("handlePlaceChange", () => {
  it("calls view.goTo with the matching city graphic", () => {
    const mockGoTo = vi.fn();
    const mockViewRef = { current: { goTo: mockGoTo } };

    const event = { target: { value: "Santa Monica" } };
    const mockGraphic = {
      attributes: { CDTFA_CITY: "Santa Monica" },
      geometry: { type: "point", x: 0, y: 0 },
    };
    const mockLayer = { graphics: { items: [mockGraphic] } };

    handlePlaceChange(event, mockLayer, mockViewRef);

    expect(mockGoTo).toHaveBeenCalledWith(
      {
        target: mockGraphic.geometry,
        zoom: 12,
      },
      {
        duration: 1000,
        easing: "ease-in-out",
      }
    );
  });

  it("does not call goTo if city not found", () => {
    const mockGoTo = vi.fn();
    const mockViewRef = { current: { goTo: mockGoTo } };

    const event = { target: { value: "Nonexistent City" } };
    const mockLayer = { graphics: { items: [] } };

    handlePlaceChange(event, mockLayer, mockViewRef);
    expect(mockGoTo).not.toHaveBeenCalled();
  });
});

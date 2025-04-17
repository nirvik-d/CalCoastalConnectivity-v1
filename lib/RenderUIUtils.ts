export function handlePlaceChange(
  event: any,
  coastalPlacesLayer: any,
  viewRef: any
) {
  const selectedCity = event.target.value;
  if (!selectedCity || !coastalPlacesLayer) return;

  // Find the matching city graphic
  const cityGraphic = coastalPlacesLayer.graphics.items.find(
    (graphic: any) => graphic.attributes.CDTFA_CITY === selectedCity
  );

  if (cityGraphic && viewRef?.current) {
    viewRef.current.goTo(
      {
        target: cityGraphic.geometry,
        zoom: 12,
      },
      {
        duration: 1000,
        easing: "ease-in-out",
      }
    );
  }
}

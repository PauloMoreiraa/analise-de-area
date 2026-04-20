import MapView from "@arcgis/core/views/MapView";
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery";
import Expand from "@arcgis/core/widgets/Expand";

export function addBasemapWidget(view: MapView, expands: any[]) {
  const basemapGallery = new BasemapGallery({
    view
  });

  const basemapExpand = new Expand({
    view,
    content: basemapGallery,
    icon: "basemap",
    expanded: false
  });

  basemapExpand.watch("expanded", (value) => {
    if (value) {
      expands.forEach((e) => {
        if (e !== basemapExpand) {
          e.expanded = false;
        }
      });
    }
  });

  view.ui.add(basemapExpand, "top-right");

  expands.push(basemapExpand);
}
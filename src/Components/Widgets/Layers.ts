import MapView from "@arcgis/core/views/MapView";
import LayerList from "@arcgis/core/widgets/LayerList";
import Expand from "@arcgis/core/widgets/Expand";

export function addLayersWidget(view: MapView, expands: any[]) {
  const layerList = new LayerList({
    view
  });

  const layersExpand = new Expand({
    view,
    content: layerList,
    icon: "layers",
    expanded: false
  });

  layersExpand.watch("expanded", (value) => {
    if (value) {
      expands.forEach((e) => {
        if (e !== layersExpand) {
          e.expanded = false;
        }
      });
    }
  });

  view.ui.add(layersExpand, "top-right");

  expands.push(layersExpand);
}
import MapView from "@arcgis/core/views/MapView";
import Legend from "@arcgis/core/widgets/Legend";
import Expand from "@arcgis/core/widgets/Expand";

export function addLegendWidget(view: MapView, expands: any[]) {
  const legend = new Legend({
    view
  });

  const legendExpand = new Expand({
    view,
    content: legend,
    icon: "legend",
    expanded: false
  });

  legendExpand.watch("expanded", (value) => {
    if (value) {
      expands.forEach((e) => {
        if (e !== legendExpand) {
          e.expanded = false;
        }
      });
    }
  });

  view.ui.add(legendExpand, "top-right");

  expands.push(legendExpand);
}
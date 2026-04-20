import MapView from "@arcgis/core/views/MapView";
import Zoom from "@arcgis/core/widgets/Zoom";

export function addZoomWidget(view: MapView) {
  const zoom = new Zoom({
    view
  });

  view.ui.add(zoom, "top-right");
}
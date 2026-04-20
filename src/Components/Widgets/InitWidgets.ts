import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

import { addZoomWidget } from "./ZoomWidget";
import { addHomeWidget } from "./Home";
import { addSearchWidget } from "./Search";
import { addLayersWidget } from "./Layers";
import { addBasemapWidget } from "./BaseMap";
import { addSketchWidget } from "./SketchWidget";
import { addLegendWidget } from "./LegendWidget";
import { addPrintWidget } from "./PrintWidget";

export function initWidgets(view: MapView, sketchLayer: GraphicsLayer) {
  const expands: any[] = [];

  addZoomWidget(view);
  addHomeWidget(view);

  addBasemapWidget(view, expands);
  addSearchWidget(view, expands);
  addLayersWidget(view, expands);
  addLegendWidget(view, expands);

  addSketchWidget(view, expands, sketchLayer);

  addPrintWidget(view, expands);
}
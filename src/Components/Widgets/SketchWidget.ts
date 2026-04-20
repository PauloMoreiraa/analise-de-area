import MapView from "@arcgis/core/views/MapView";
import Sketch from "@arcgis/core/widgets/Sketch";
import Expand from "@arcgis/core/widgets/Expand";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";

export function addSketchWidget(
  view: MapView,
  expands: Expand[],
  sketchLayer: GraphicsLayer
) {
  const polygonSymbol = new SimpleFillSymbol({
    color: [255, 255, 0, 0.18], // amarelo com transparência
    style: "backward-diagonal", // listrado
    outline: {
      color: [255, 255, 0, 1], // borda amarela
      width: 2
    }
  });

  const sketch = new Sketch({
    view,
    layer: sketchLayer,

    polygonSymbol,

    visibleElements: {
      createTools: {
        point: false,
        polyline: false,
        polygon: true,
        rectangle: false,
        circle: false
      },
      undoRedoMenu: true,
      duplicateButton: false
    }
  });

  const expand = new Expand({
    view,
    content: sketch,
    icon: "pencil",
    expanded: false
  });

  expands.push(expand);

  expand.watch("expanded", (isOpen) => {
    if (!isOpen) return;

    expands.forEach((e) => {
      if (e !== expand) e.expanded = false;
    });
  });

  sketch.on("create", (event) => {
    if (event.state === "start") {
      sketchLayer.removeAll();
      view.closePopup();
    }

    if (event.state === "complete") {
      if (event.graphic) {
        event.graphic.symbol = polygonSymbol;

        event.graphic.popupTemplate = {
          title: "Área desenhada",
          content:
            "Execute a análise para visualizar os resultados desta geometria."
        };
      }

      sketch.cancel();

      if (view?.container) {
        view.container.style.cursor = "default";
      }

      view.focus();
    }
  });

  view.ui.add(expand, "top-right");

  return { sketch, expand };
}
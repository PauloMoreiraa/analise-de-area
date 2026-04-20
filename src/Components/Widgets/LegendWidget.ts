import MapView from "@arcgis/core/views/MapView";
import Legend from "@arcgis/core/widgets/Legend";
import Expand from "@arcgis/core/widgets/Expand";

export function addLegendWidget(view: MapView, expands: any[]) {
  const legend = new Legend({
    view
  });

  const legendDiv = document.createElement("div");
  const customItem = document.createElement("div");

  customItem.style.marginTop = "10px";

  const label = document.createElement("div");
  label.textContent = "Área Desenhada";
  label.style.marginLeft = "20px";
  label.style.marginBottom = "4px";
  label.style.fontWeight = "600";
    label.style.color = "#333333";


  const symbol = document.createElement("div");
  symbol.style.width = "18px";
  symbol.style.height = "18px";
  symbol.style.marginLeft = "30px";
  symbol.style.marginBottom = "10px";
  symbol.style.backgroundColor = "rgba(255,255,0,0.18)";
  symbol.style.border = "2px solid yellow";
  symbol.style.backgroundImage =
    "repeating-linear-gradient(135deg, transparent, transparent 4px, rgba(255,255,0,1) 4px, rgba(255,255,0,1) 8px)";

  customItem.appendChild(label);
  customItem.appendChild(symbol);

  const container = document.createElement("div");
  container.appendChild(legendDiv);
  container.appendChild(customItem);

  legend.container = legendDiv;

  const legendExpand = new Expand({
    view,
    content: container,
    expandIcon: "legend",
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
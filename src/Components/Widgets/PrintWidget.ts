import MapView from "@arcgis/core/views/MapView";
import Print from "@arcgis/core/widgets/Print";
import Expand from "@arcgis/core/widgets/Expand";

export function addPrintWidget(view: MapView, expands: any[]) {
  const print = new Print({
    view,
    printServiceUrl:
      "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
  });

  const printExpand = new Expand({
    view,
    content: print,
    icon: "print",
    expanded: false
  });

  printExpand.watch("expanded", (value) => {
    if (value) {
      expands.forEach((e) => {
        if (e !== printExpand) {
          e.expanded = false;
        }
      });
    }
  });

  view.ui.add(printExpand, "top-right");

  expands.push(printExpand);
}
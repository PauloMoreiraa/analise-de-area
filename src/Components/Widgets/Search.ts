import MapView from "@arcgis/core/views/MapView";
import Search from "@arcgis/core/widgets/Search";
import Expand from "@arcgis/core/widgets/Expand";

export function addSearchWidget(view: MapView, expands: any[]) {
  const search = new Search({ view });

  const searchExpand = new Expand({
    view,
    content: search,
	  icon: "search",
    expanded: false
  });

  searchExpand.watch("expanded", (value) => {
    if (value) {
      expands.forEach((e) => {
        if (e !== searchExpand) {
          e.expanded = false;
        }
      });
    }
  });

  view.ui.add(searchExpand, "top-right");

  expands.push(searchExpand);
}
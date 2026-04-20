import MapView from "@arcgis/core/views/MapView";
import Home from "@arcgis/core/widgets/Home";

export function addHomeWidget(view: MapView) {
  const home = new Home({
    view,
    label: 'teste',
    goToOverride: (view) => {
      return view.goTo({
        center: [-55, -14],
        zoom: 4
      });
    }
  });

  view.ui.add(home, "top-right");
}
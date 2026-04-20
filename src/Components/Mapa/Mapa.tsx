import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { useEffect, useRef, useState } from "react";
import "./Mapa.css";

import { initWidgets } from "../Widgets/InitWidgets";
import Dashboard from "../Dashboard/Dashboard";

import {
  createBiomasLayer,
  createEstadosLayer,
  createMunicipioLayer
} from "../../Layers/LayerConfig";

export default function Mapa() {
  const mapDiv = useRef<HTMLDivElement>(null);

  const [ctx, setCtx] = useState<any>(null);

  useEffect(() => {
    if (!mapDiv.current) return;

    const estadosLayer = createEstadosLayer();
    const municipioLayer = createMunicipioLayer();
    const biomasLayer = createBiomasLayer();

    const sketchLayer = new GraphicsLayer({
      title: "Desenhos"
    });

    const map = new Map({
      basemap: "satellite",
      layers: [
        biomasLayer,
        municipioLayer,
        estadosLayer,
        sketchLayer
      ]
    });

    const view = new MapView({
      container: mapDiv.current,
      map,
      center: [-55, -14],
      zoom: 4,
      popupEnabled: true,
      ui: { components: [] }
    });

    view.when(() => {
      initWidgets(view, sketchLayer);

      setCtx({
        view,
        sketchLayer,
        estadosLayer,
        municipioLayer,
        biomasLayer
      });
    });

    return () => {
      view.destroy();
    };
  }, []);

  return (
    <div className="map-container">
      <div ref={mapDiv} className="map-container" />

      {ctx && (
        <Dashboard
          view={ctx.view}
          sketchLayer={ctx.sketchLayer}
          estados={ctx.estadosLayer}
          municipios={ctx.municipioLayer}
          biomas={ctx.biomasLayer}
        />
      )}
    </div>
  );
}
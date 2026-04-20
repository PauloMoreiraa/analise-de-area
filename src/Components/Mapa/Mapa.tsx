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

    // 🌍 layers base
    const estadosLayer = createEstadosLayer();
    const municipioLayer = createMunicipioLayer();
    const biomasLayer = createBiomasLayer();

    // ✏️ sketch layer global (IMPORTANTE pro dashboard)
    const sketchLayer = new GraphicsLayer({
      title: "Desenhos"
    });

    // 🗺️ mapa
    const map = new Map({
      basemap: "satellite",
      layers: [
        biomasLayer,
        municipioLayer,
        estadosLayer,
        sketchLayer
      ]
    });

    // 👁️ view
    const view = new MapView({
      container: mapDiv.current,
      map,
      center: [-55, -14],
      zoom: 4,
      popupEnabled: true,
      ui: { components: [] }
    });

    // widgets + sketch
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
      {/* MAPA */}
      <div ref={mapDiv} className="map-container" />

      {/* DASHBOARD */}
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
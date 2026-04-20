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
      layers: [biomasLayer, municipioLayer, estadosLayer, sketchLayer]
    });

    const view = new MapView({
      container: mapDiv.current,
      map,
      center: [-55, -14],
      zoom: 4,
      popupEnabled: true,
      ui: { components: [] }
    });

    const coordDiv = document.createElement("div");
    coordDiv.style.position = "absolute";
    coordDiv.style.right = "10px";
    coordDiv.style.bottom = "20px";
    coordDiv.style.padding = "6px 10px";
    coordDiv.style.background = "rgba(0,0,0,0.65)";
    coordDiv.style.color = "#fff";
    coordDiv.style.fontSize = "12px";
    coordDiv.style.borderRadius = "6px";
    coordDiv.style.pointerEvents = "none";
    coordDiv.style.zIndex = "999";

    mapDiv.current.appendChild(coordDiv);

    let pointerHandle: any;

    view.when(() => {
      initWidgets(view, sketchLayer);

      setCtx({
        view,
        sketchLayer,
        estadosLayer,
        municipioLayer,
        biomasLayer
      });

      pointerHandle = view.on("pointer-move", (event) => {
        const point = view.toMap({
          x: event.x,
          y: event.y
        });

        if (!point || point.latitude == null || point.longitude == null) {
          coordDiv.innerHTML = "Lat: -- | Lon: --";
          return;
        }

        coordDiv.innerHTML = `
          Lon: ${point.longitude.toFixed(5)} <br/>
          Lat: ${point.latitude.toFixed(5)}
        `;
      });
    });

    return () => {
      pointerHandle?.remove();
      coordDiv.remove();
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
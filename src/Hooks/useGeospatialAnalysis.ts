import { useState } from "react";
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { runGeospatialAnalysis } from "../Services/AnalysisResult";
import type { AnalysisResult } from "../Services/AnalysisResult";

export function useGeospatialAnalysis() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const animateProgress = () => {
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 120);

    return interval;
  };

  const run = async (params: {
    view: MapView;
    sketchLayer: GraphicsLayer;
    estados: FeatureLayer;
    municipios: FeatureLayer;
    biomas: FeatureLayer;
  }) => {
    const graphic = params.sketchLayer.graphics.getItemAt(
      params.sketchLayer.graphics.length - 1
    );

    if (!graphic?.geometry || graphic.geometry.type !== "polygon") return;

    setLoading(true);
    setError(null);

    const interval = animateProgress();

    try {
      const data = await runGeospatialAnalysis({
        geometry: graphic.geometry,
        estados: params.estados,
        municipios: params.municipios,
        biomas: params.biomas
      });

      clearInterval(interval);
      setProgress(100);

      setResult(data);

      await params.view.goTo(graphic);
    } catch (e) {
      console.error(e);
      setError("Erro ao executar análise.");
    } finally {
      setLoading(false);
    }
  };

  return {
    run,
    loading,
    progress,
    result,
    error,
    setResult
  };
}
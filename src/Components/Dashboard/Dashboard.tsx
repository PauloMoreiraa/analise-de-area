import { useEffect, useState } from "react";
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { useGeospatialAnalysis } from "../../Hooks/useGeospatialAnalysis";
import { generateAnalysisPdf } from "../../Utils/GeradorPdf";
import "./Dashboard.css";

type Props = {
  view: MapView;
  sketchLayer: GraphicsLayer;
  estados: FeatureLayer;
  municipios: FeatureLayer;
  biomas: FeatureLayer;
};

export default function Dashboard(props: Props) {
  const {
    run,
    loading,
    result,
    error,
    setResult
  } = useGeospatialAnalysis();

  const [hasGeometry, setHasGeometry] = useState(false);

  useEffect(() => {
    const sync = () => {
      setHasGeometry(props.sketchLayer.graphics.length > 0);
      setResult(null);
    };

    sync();

    const handle = props.sketchLayer.graphics.on("change", sync);

    return () => handle.remove();
  }, [props.sketchLayer]);

  const handleRun = () => {
    run(props);
  };

  const handlePdf = async () => {
    if (!result) return;

    await generateAnalysisPdf({
      view: props.view,
      sketchLayer: props.sketchLayer,
      result
    });
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h3>Análise Geográfica</h3>
        <p>Interseção espacial da geometria desenhada</p>
      </div>

      <div className="dashboard-actions">
        <button
          className="btn"
          disabled={!hasGeometry || loading}
          onClick={handleRun}
        >
          {loading ? "Analisando..." : "Executar análise"}
        </button>

        <button
          className="btn btn-secondary"
          disabled={!result}
          onClick={handlePdf}
        >
          Gerar PDF
        </button>
      </div>

      {error && <div className="card error">{error}</div>}

      <div className="results">
        {result?.areaKm2 !== undefined && (
          <div className="card">
            <h4>Área total</h4>
            <p>{result.areaKm2.toFixed(6)} km²</p>
          </div>
        )}

        {result && (
          <>
            <div className="card">
              <h4>Estados ({result.estados.length})</h4>
              <ul>
                {result.estados.map((e, i) => (
                  <li key={i}>{e.nm_uf}</li>
                ))}
              </ul>
            </div>

            <div className="card">
              <h4>Municípios ({result.municipios.length})</h4>
              <ul>
                {result.municipios.map((m, i) => (
                  <li key={i}>{m.nm_mun}</li>
                ))}
              </ul>
            </div>

            <div className="card">
              <h4>Biomas ({result.biomas.length})</h4>
              <ul>
                {result.biomas.map((b, i) => (
                  <li key={i}>{b.NOME}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
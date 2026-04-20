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
  const { run, loading, progress, result, setResult } =
    useGeospatialAnalysis();

  const [hasGeometry, setHasGeometry] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const sync = () => {
      const hasGeo = props.sketchLayer.graphics.length > 0;
      setHasGeometry(hasGeo);

      if (!hasGeo) setExpanded(false);
      setResult(null);
    };

    sync();
    const handle = props.sketchLayer.graphics.on("change", sync);

    return () => handle.remove();
  }, [props.sketchLayer]);

  const handleRun = async () => {
    await run(props);
    setExpanded(true);
  };

  const handlePdf = async () => {
    if (!result) return;

    await generateAnalysisPdf({
      view: props.view,
      sketchLayer: props.sketchLayer,
      result
    });
  };

  const Skeleton = () => (
    <div className="skeleton">
      <div className="bar" />
      <div className="bar short" />
      <div className="bar" />
    </div>
  );

  const Chip = ({ label }: { label: string }) => (
    <span className="chip">{label}</span>
  );

  return (
    <div className={`dashboard ${expanded ? "expanded" : "collapsed"}`}>
      
      <div className="dashboard-header">
        <h3>Análise Geográfica</h3>
        <p>Interseção espacial</p>

        {loading && (
          <div className="progress">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {!hasGeometry && (
          <div className="hint">
            Crie um polígono para iniciar a análise
          </div>
        )}
      </div>

      <div className="dashboard-actions">
        <button
          className="btn"
          disabled={!hasGeometry || loading}
          onClick={handleRun}
        >
          {loading ? "Analisando..." : "Executar análise"}
        </button>
      </div>

      <div className="results">

        {loading && <Skeleton />}

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
              <div className="chips">
                {result.estados.map((e, i) => (
                  <Chip key={i} label={e.nm_uf} />
                ))}
              </div>
            </div>

            <div className="card">
              <h4>Municípios ({result.municipios.length})</h4>
              <div className="chips">
                {result.municipios.map((m, i) => (
                  <Chip key={i} label={m.nm_mun} />
                ))}
              </div>
            </div>

            <div className="card">
              <h4>Biomas ({result.biomas.length})</h4>
              <div className="chips">
                {result.biomas.map((b, i) => (
                  <Chip key={i} label={b.NOME} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {result && expanded && (
        <div className="dashboard-footer">
          <button className="btn btn-secondary" onClick={handlePdf}>
            Gerar PDF
          </button>
        </div>
      )}
    </div>
  );
}
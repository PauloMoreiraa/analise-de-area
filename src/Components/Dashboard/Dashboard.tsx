import { useEffect, useState } from "react";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";
import { generateAnalysisPdf } from "../../Utils/GeradorPdf";
import "./Dashboard.css";

type Props = {
  view: MapView;
  sketchLayer: GraphicsLayer;
  estados: FeatureLayer;
  municipios: FeatureLayer;
  biomas: FeatureLayer;
};

type AnalysisResult = {
  areaKm2: number;
  estados: any[];
  municipios: any[];
  biomas: any[];
};

export default function Dashboard({
  view,
  sketchLayer,
  estados,
  municipios,
  biomas
}: Props) {
  const [hasGeometry, setHasGeometry] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] =
    useState<AnalysisResult | null>(null);
  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    const sync = () => {
      const count =
        sketchLayer.graphics.length;

      setHasGeometry(count > 0);

      if (count > 0) {
        setResult(null);
        setError(null);
      }
    };

    sync();

    const handle =
      sketchLayer.graphics.on(
        "change",
        sync
      );

    return () => handle.remove();
  }, [sketchLayer]);

  const queryLayer = async (
    layer: FeatureLayer,
    geometry: any
  ) => {
    const res =
      await layer.queryFeatures({
        geometry,
        spatialRelationship:
          "intersects",
        outFields: ["*"],
        returnGeometry: false
      });

    return res.features.map(
      (f) => f.attributes
    );
  };

  const runAnalysis = async () => {
    const graphic =
      sketchLayer.graphics.getItemAt(
        sketchLayer.graphics.length -
          1
      );

    if (
      !graphic?.geometry ||
      graphic.geometry.type !==
        "polygon"
    )
      return;

    setLoading(true);
    setError(null);

    try {
      const geometry =
        graphic.geometry;

      const areaKm2 = Math.abs(
        geometryEngine.geodesicArea(
          geometry,
          "square-kilometers"
        )
      );

      const [
        ufs,
        muns,
        bios
      ] = await Promise.all([
        queryLayer(
          estados,
          geometry
        ),
        queryLayer(
          municipios,
          geometry
        ),
        queryLayer(
          biomas,
          geometry
        )
      ]);

      setResult({
        areaKm2,
        estados: ufs,
        municipios: muns,
        biomas: bios
      });

      await view.goTo(graphic);
    } catch (e) {
      console.error(e);

      setError(
        "Erro ao executar análise."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePdf =
    async () => {
      if (!result) return;

      await generateAnalysisPdf({
        view,
        sketchLayer,
        result
      });
    };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h3>
          Análise Geográfica
        </h3>

        <p>
          Interseção espacial da
          geometria desenhada
        </p>
      </div>

      <div className="dashboard-actions">
        <button
          className="btn"
          disabled={
            !hasGeometry ||
            loading
          }
          onClick={
            runAnalysis
          }
        >
          {loading
            ? "Analisando..."
            : "Executar análise"}
        </button>

        <button
          className="btn btn-secondary"
          disabled={!result}
          onClick={
            handleGeneratePdf
          }
        >
          Gerar PDF
        </button>
      </div>

      {error && (
        <div className="card error">
          {error}
        </div>
      )}

      <div className="results">
        {result?.areaKm2 !==
          undefined && (
          <div className="card">
            <h4>
              Área total
            </h4>

            <p>
              {result.areaKm2.toFixed(
                6
              )}{" "}
              km²
            </p>
          </div>
        )}

        {result && (
          <>
            <div className="card">
              <h4>
                Estados (
                {
                  result.estados
                    .length
                }
                )
              </h4>

              <ul>
                {result.estados.map(
                  (
                    e,
                    i
                  ) => (
                    <li
                      key={i}
                    >
                      {
                        e.nm_uf
                      }
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="card">
              <h4>
                Municípios (
                {
                  result
                    .municipios
                    .length
                }
                )
              </h4>

              <ul>
                {result.municipios.map(
                  (
                    m,
                    i
                  ) => (
                    <li
                      key={i}
                    >
                      {
                        m.nm_mun
                      }
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="card">
              <h4>
                Biomas (
                {
                  result
                    .biomas
                    .length
                }
                )
              </h4>

              <ul>
                {result.biomas.map(
                  (
                    b,
                    i
                  ) => (
                    <li
                      key={i}
                    >
                      {
                        b.NOME
                      }
                    </li>
                  )
                )}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
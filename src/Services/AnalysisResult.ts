import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";
import type Polygon from "@arcgis/core/geometry/Polygon";

export type AnalysisResult = {
  areaKm2: number;
  estados: any[];
  municipios: any[];
  biomas: any[];
};

export async function queryLayer(
  layer: FeatureLayer,
  geometry: Polygon
) {
  const res = await layer.queryFeatures({
    geometry,
    spatialRelationship: "intersects",
    outFields: ["*"],
    returnGeometry: false
  });

  return res.features.map((f) => f.attributes);
}

export async function runGeospatialAnalysis(params: {
  geometry: Polygon;
  estados: FeatureLayer;
  municipios: FeatureLayer;
  biomas: FeatureLayer;
}): Promise<AnalysisResult> {
  const { geometry, estados, municipios, biomas } = params;

  const areaKm2 = Math.abs(
    geometryEngine.geodesicArea(geometry, "square-kilometers")
  );

  const [ufs, muns, bios] = await Promise.all([
    queryLayer(estados, geometry),
    queryLayer(municipios, geometry),
    queryLayer(biomas, geometry)
  ]);

  const sortByField = (arr: any[], field: string) => {
    return [...arr].sort((a, b) =>
      (a[field] || "").localeCompare(
        b[field] || "",
        "pt-BR",
        { sensitivity: "base" }
      )
    );
  };

  return {
    areaKm2,
    estados: sortByField(ufs, "nm_uf"),
    municipios: sortByField(muns, "nm_mun"),
    biomas: sortByField(bios, "NOME")
  };
}
import jsPDF from "jspdf";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import MapView from "@arcgis/core/views/MapView";

type AnalysisResult = {
  areaKm2: number;
  estados: any[];
  municipios: any[];
  biomas: any[];
};

type Props = {
  view: MapView;
  sketchLayer: GraphicsLayer;
  result: AnalysisResult;
};

export async function generateAnalysisPdf({
  view,
  sketchLayer,
  result
}: Props) {
  if (!view.map) return;

  const graphic = sketchLayer.graphics.getItemAt(
    sketchLayer.graphics.length - 1
  );

  const screenshot = await view.takeScreenshot({
    width: 1800,
    height: 1000
  });

  const pdf = new jsPDF("landscape", "mm", "a4");

  pdf.setFontSize(18);
  pdf.text("Relatório de Análise Geográfica", 14, 15);

  pdf.setFontSize(9);
  pdf.text(
    `Gerado em: ${new Date().toLocaleString("pt-BR")}`,
    14,
    21
  );

  pdf.addImage(
    screenshot.dataUrl,
    "PNG",
    10,
    28,
    277,
    110
  );

  if (graphic?.geometry?.type === "polygon") {
    const rings = graphic.geometry.rings[0];

    const coords = rings
      .slice(0, 15)
      .map((coord: number[]) =>
        `${coord[0].toFixed(5)}, ${coord[1].toFixed(5)}`
      )
      .join(" | ");

    pdf.setFontSize(6);
    pdf.setTextColor(90, 90, 90);

    const lines = pdf.splitTextToSize(coords, 270);

    pdf.text(lines, 10, 142);
  }

  let y = 148;

  pdf.setFontSize(10);
  pdf.text("Resultados", 14, y);

  y += 6;

  pdf.setFontSize(8);

  pdf.text(
    `Área Total: ${result.areaKm2.toFixed(6)} km²`,
    14,
    y
  );

  y += 5;

  const estadosText = `Estados (${result.estados.length}): ${result.estados
    .map((e) => e.nm_uf)
    .join(", ")}`;

  const estadosLines = pdf.splitTextToSize(estadosText, 150);
  pdf.text(estadosLines, 14, y);
  y += estadosLines.length * 4;

  const municipiosText = `Municípios (${result.municipios.length}): ${result.municipios
    .map((m) => m.nm_mun)
    .join(", ")}`;

  const municipiosLines = pdf.splitTextToSize(municipiosText, 150);
  pdf.text(municipiosLines, 14, y);
  y += municipiosLines.length * 4;

  const biomasText = `Biomas (${result.biomas.length}): ${result.biomas
    .map((b) => b.NOME)
    .join(", ")}`;

  const biomasLines = pdf.splitTextToSize(biomasText, 150);
  pdf.text(biomasLines, 14, y);
  y += biomasLines.length * 4;

  pdf.setFontSize(10);
  pdf.text("Legenda", 175, 148);

  const items = [
    ["Unidades Federativas", [255, 255, 255], [144, 144, 144], true],
    ["Municípios", [255, 255, 255], [255, 215, 0], true],
    ["Amazônia", [168, 255, 0], [168, 255, 0], false],
    ["Caatinga", [255, 255, 168], [255, 255, 168], false],
    ["Cerrado", [255, 192, 168], [255, 192, 168], false],
    ["Mata Atlântica", [214, 255, 168], [214, 255, 168], false],
    ["Pampa", [255, 240, 213], [255, 240, 213], false],
    ["Pantanal", [255, 229, 255], [255, 229, 255], false],
    ["Área Desenhada", [180, 220, 255], [0, 102, 255], false]
  ];

  const startY = 154;
  const rowH = 7;
  const col1X = 175;
  const col2X = 232;

  items.forEach((item, i) => {
    const col = i < 5 ? col1X : col2X;
    const row = i < 5 ? i : i - 5;
    const yy = startY + row * rowH;

    const text = item[0] as string;
    const fill = item[1] as number[];
    const line = item[2] as number[];
    const dashed = item[3] as boolean;

    if (dashed) {
      pdf.setLineDashPattern([1, 1], 0);
    } else {
      pdf.setLineDashPattern([], 0);
    }

    pdf.setDrawColor(line[0], line[1], line[2]);
    pdf.setFillColor(fill[0], fill[1], fill[2]);

    pdf.rect(col, yy - 4, 6, 5, "FD");

    pdf.setLineDashPattern([], 0);

    pdf.setTextColor(60, 60, 60);
    pdf.setFontSize(7.5);
    pdf.text(text, col + 9, yy);
  });

  const blob = pdf.output("blob");
  const url = URL.createObjectURL(blob);

  window.open(url, "_blank");

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 10000);
}
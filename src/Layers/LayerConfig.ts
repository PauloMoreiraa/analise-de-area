import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";

export function createEstadosLayer() {
	return new FeatureLayer({
		url: import.meta.env.VITE_CAMADA_ESTADOS,
		title: "Camada de Unidades Federativas",
		minScale: 0,
		maxScale: 0,
		visible: true,
		outFields: ["*"],
		popupEnabled: true,
		popupTemplate: {
			title: "{nm_uf} ({sigla})",
			content: [
				{
					type: "fields",
					fieldInfos: [
						{
							fieldName: "nm_uf",
							label: "Estado"
						},
						{
							fieldName: "sigla",
							label: "Sigla"
						},
						{
							fieldName: "cd_uf",
							label: "Código IBGE"
						},
						{
							fieldName: "nm_regiao",
							label: "Região"
						},
						{
							fieldName: "st_area(shape)",
							label: "Área (m²)"
						}
					]
				}
			]
		},

		renderer: new SimpleRenderer({
			symbol: new SimpleFillSymbol({
				color: [252, 221, 207, 0],
				outline: new SimpleLineSymbol({
					color: [144, 144, 144, 1],
					width: 0.8,
					style: "dash"
				})
			})
		})
	});
}

export function createMunicipioLayer() {
	return new FeatureLayer({
		url: import.meta.env.VITE_CAMADA_MUNICIPIOS,
		title: "Camada de Municípios",
		minScale: 0,
		maxScale: 0,
		visible: false,
		outFields: ["*"],

		popupEnabled: true,

		popupTemplate: {
			title: "{nm_mun} - {sigla}",
			content: [
				{
					type: "fields",
					fieldInfos: [
						{
							fieldName: "nm_mun",
							label: "Município"
						},
						{
							fieldName: "sigla",
							label: "UF"
						},
						{
							fieldName: "cd_mun",
							label: "Código IBGE"
						},
						{
							fieldName: "area_km2",
							label: "Área (km²)"
						},
						{
							fieldName: "sg_uf_mun",
							label: "UF - Município"
						}
					]
				}
			]
		},

		renderer: new SimpleRenderer({
			symbol: new SimpleFillSymbol({
				color: [255, 250, 220, 0],
				outline: new SimpleLineSymbol({
					color: [255, 215, 0, 0.5],
					width: 0.6,
					style: "dash"
				})
			})
		})
	});
}

export function createBiomasLayer() {
	return new FeatureLayer({
		url: import.meta.env.VITE_CAMADA_BIOMAS,
		title: "Biomas do Brasil",
		minScale: 0,
		maxScale: 0,
		visible: false,
		opacity: 0.8,
		outFields: ["*"],

		popupEnabled: true,

		popupTemplate: {
			title: "Bioma: {NOME}",
			content: [
				{
					type: "fields",
					fieldInfos: [
						{
							fieldName: "NOME",
							label: "Nome do Bioma"
						},
						{
							fieldName: "OBJECTID",
							label: "ID"
						},
						{
							fieldName: "SHAPE_Area",
							label: "Área"
						},
						{
							fieldName: "SHAPE_Length",
							label: "Perímetro"
						}
					]
				}
			]
		}
	});
}
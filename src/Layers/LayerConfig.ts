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

		renderer: {
			type: "unique-value",

			field: "bioma",

			uniqueValueInfos: [
				{
					value: "Amazônia",

					symbol: {
						type: "simple-fill",

						color: [168, 255, 0, 0.5],

						outline: {
							color: [168, 255, 0],
							width: 1.2
						}
					}
				},
				{
					value: "Caatinga",

					symbol: {
						type: "simple-fill",

						color: [255, 255, 168, 0.5],

						outline: {
							color: [255, 255, 168],
							width: 1.2
						}
					}
				},
				{
					value: "Cerrado",

					symbol: {
						type: "simple-fill",

						color: [255, 192, 168, 0.5],

						outline: {
							color: [255, 192, 168],
							width: 1.2
						}
					}
				},
				{
					value: "Mata Atlântica",

					symbol: {
						type: "simple-fill",

						color: [214, 255, 168, 0.5],

						outline: {
							color: [214, 255, 168],
							width: 1.2
						}
					}
				},
				{
					value: "Pampa",

					symbol: {
						type: "simple-fill",

						color: [255, 240, 213, 0.5],

						outline: {
							color: [255, 240, 213],
							width: 1.2
						}
					}
				},
				{
					value: "Pantanal",

					symbol: {
						type: "simple-fill",

						color: [255, 229, 255, 0.5],

						outline: {
							color: [255, 229, 255],
							width: 1.2
						}
					}
				}
			]
		},

		popupEnabled: true,

		popupTemplate: {
			title: "Bioma: {bioma}",

			content: [
				{
					type: "fields",

					fieldInfos: [
						{
							fieldName: "bioma",
							label: "Nome do Bioma"
						},
						{
							fieldName: "cd_bioma",
							label: "Código do Bioma"
						},
						{
							fieldName: "objectid",
							label: "ID"
						},
						{
							fieldName: "Shape__Area",
							label: "Área",
							format: {
								places: 2,
								digitSeparator: true
							}
						},
						{
							fieldName: "Shape__Length",
							label: "Perímetro",
							format: {
								places: 2,
								digitSeparator: true
							}
						}
					]
				}
			]
		}
	});
}
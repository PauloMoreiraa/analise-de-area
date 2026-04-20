# Analise Geográfica

Projeto de aplicação web para análise geográfica.

---

## 📌 Sobre o projeto

Este sistema permite a visualização e análise de dados geoespaciais, com ferramentas de desenho, camadas, widgets de mapa e exportação de resultados (ex: PDF).

Tecnologias principais:
- React 19
- Vite
- TypeScript
- ArcGIS JS API (@arcgis/core)
- React Router DOM
- jsPDF

---

## 📁 Estrutura do projeto

src/
├── App.tsx                
├── main.tsx              
├── index.css
│
├── Components/
│   ├── Dashboard/        
│   ├── Mapa/            
│   └── Widgets/          
│
├── Hooks/
│   └── useGeospatialAnalysis.ts  
│
├── Layers/
│   └── LayerConfig.ts    
│
├── Services/
│   └── AnalysisResult.ts 
│
└── Utils/
    └── GeradorPdf.ts   

---

## 🚀 Como rodar o projeto

1. Instalar dependências:
npm install

2. Rodar em desenvolvimento:
npm run dev

3. Build:
npm run build

4. Preview:
npm run preview

---

## ⚙️ Scripts

- dev → inicia servidor Vite
- build → build produção
- lint → ESLint
- preview → preview build

---

## 🗺️ Funcionalidades

- Mapa com ArcGIS
- Widgets de interação
- Desenho de geometrias
- Análises geoespaciais
- Exportação PDF

---

## 📌 Observações

- Arquitetura modular

# AGENTS.md

Contexto para agentes de IA (Claude Code, Codex, etc.) que trabajen en este repositorio.

## Qué es
PWA para armar rápido el **Informe de Estado de Planta** (desvíos de calidad) desde el celular durante la recorrida: se cargan sector, fotos, descripción y acción correctiva de cada desvío, y se genera un PDF con las fotos acomodadas solas. Opcionalmente, la IA mejora la redacción.

## Stack y restricciones
- HTML + CSS + JavaScript puro. **Sin frameworks ni paso de build.**
- Mobile-first, funciona offline (service worker con caché). PDF con jsPDF 2.5.1 incluido local (`jspdf.umd.min.js`).
- Datos en `localStorage` (clave `informe_planta_v1`); fotos reducidas a 1200 px, JPEG.
- Hosting: GitHub Pages (rutas siempre **relativas**). Interfaz y comentarios en español.
- Alcance mínimo (MVP): no agregar funciones no pedidas ni dependencias nuevas sin avisar.

## Archivos
- `index.html`, `style.css`, `app.js`: la app. `config.js`: URL del Worker (`IA_ENDPOINT`).
- `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`: PWA.
- `worker/worker.js`: Cloudflare Worker que llama a la API de Anthropic (no lo carga la app).
- `GUIA_IA.md`: guía de puesta en marcha de la IA.

## Formato del informe (respetar)
- Título "Informe de Estado de Planta", subtítulo "Departamento de Calidad", fecha de emisión.
- Cada desvío en su propia página: "Desvío N.° X - Sector"; descripción de 2 a 4 líneas (qué se ve, dónde, qué norma no se cumple); "Registro fotográfico" (1 foto grande, 2 o más en grilla de 2 columnas); "Acción Correctiva Propuesta" con 1 o 2 acciones numeradas (verbo + qué hacer + con qué), lenguaje poco técnico.
- No usar los nombres japoneses de las 5S (Seiri, Seiton, etc.) en las acciones.

## IA
- Flujo: `app.js` (`mejorar()` / `askAI()`) → Worker (`X-App-Token`) → API de Anthropic (modelo definido en `worker.js`).
- Los prompts están en `mejorar()`. La IA reescribe texto; **no recibe fotos**. El resultado queda editable y con "Deshacer".
- Si `IA_ENDPOINT` está vacío, los botones de IA quedan ocultos.

## Reglas de trabajo
- **Nunca** poner claves de API en el repo: viven como secrets en Cloudflare.
- Al cambiar cualquier archivo, subir la versión de `V` en `sw.js` y mantener `FILES` al día.
- Para probar en local: `python3 -m http.server` y abrir `http://localhost:8000` (el service worker exige localhost o HTTPS).
- No incluir datos personales ni de la empresa en el repo (es público en GitHub Pages).

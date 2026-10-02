# Informe de Estado de Planta

PWA para armar rápido el **Informe de Estado de Planta** (desvíos de calidad) desde el celular durante la recorrida. Se cargan sector, fotos, descripción y acción correctiva de cada desvío, y la app genera un **PDF** con las fotos acomodadas solas. Opcionalmente, una IA ayuda a mejorar la redacción.

## Características

- **Carga de desvíos en el momento**: sector (con autocompletado de sectores ya usados), fotos de la cámara o galería, descripción y acciones correctivas.
- **Fotos**: se reducen a 1200 px (JPEG) y se pueden reordenar o quitar antes de guardar.
- **Edición**: cada desvío guardado se puede editar o eliminar antes de generar el informe.
- **PDF automático** (jsPDF) con el formato de la plantilla de la empresa:
  - Logo y línea gris en el encabezado de cada página.
  - Portada con etiqueta, título, fecha, nombre y departamento, más el párrafo de objetivo.
  - Un bloque por desvío: descripción, registro fotográfico en grilla de hasta 2 columnas (sin recortar) y acciones correctivas en viñetas.
  - Flujo continuo con saltos de página automáticos y pie con fecha, nombre y numeración.
- **Mejorar con IA** (opcional): reescribe descripción y acción correctiva con Workers AI de Cloudflare. Las fotos nunca salen del celular y el resultado queda editable con botón "Deshacer".
- **Borrador guardado** en el dispositivo (`localStorage`), por si se cierra la app a mitad de la recorrida.
- **Funciona offline** gracias al service worker, e instalable como app.
- **Tema claro/oscuro**.

## Tecnologías

HTML + CSS + JavaScript puro, **sin frameworks ni paso de build**. Mobile-first.

- [jsPDF](https://github.com/parallax/jsPDF) 2.5.1 incluido de forma local (`jspdf.umd.min.js`).
- Cloudflare Worker + Workers AI para la función de IA (opcional).
- Hosting pensado para GitHub Pages (rutas relativas).

## Estructura

```
├── index.html            # Interfaz
├── style.css             # Estilos y temas
├── app.js                # Lógica: carga, fotos, PDF, IA
├── brand.js              # Marca: empresa, color de acento y textos fijos del PDF
├── config.js             # URL del Worker de IA (IA_ENDPOINT)
├── logo.png              # Logo para el PDF
├── manifest.json         # Configuración PWA
├── sw.js                 # Service worker (caché offline)
├── jspdf.umd.min.js      # Librería de PDF
├── worker.js             # Cloudflare Worker de IA (no lo carga la app)
├── wrangler.jsonc        # Configuración de despliegue del Worker
├── GUIA_IA.md            # Puesta en marcha de la IA
├── GUIA_MARCA.md         # Cómo cambiar logo, colores y textos
└── AGENTS.md             # Contexto para agentes de IA
```

## Uso

Para probarla en local (el service worker exige `localhost` o HTTPS):

```bash
python3 -m http.server 8000
```

Abrir `http://localhost:8000`. Para usarla en el celular, publicarla en GitHub Pages (o similar) e instalarla desde el navegador ("Agregar a pantalla de inicio").

Flujo de trabajo:

1. Completar fecha y nombre.
2. Por cada desvío: sector, fotos, descripción y acción correctiva → **Agregar desvío**.
3. **Generar PDF** al terminar la recorrida.
4. **Empezar informe nuevo** para limpiar el borrador.

## Personalización de la marca

Todo se edita en `brand.js`, sin tocar `app.js`:

```js
const BRAND = {
  empresa: '...',            // texto de respaldo si no carga logo.png
  colorAcento: '#BF382A',    // línea bajo títulos
  tituloInforme: 'REPORTE DIARIO\nDE ESTADO DE PLANTA',
  etiqueta: 'INFORME | CALIDAD',
  departamento: 'DEPARTAMENTO DE CALIDAD',
  objetivo: '...'            // párrafo fijo bajo el encabezado
};
```

Para cambiar el logo, reemplazar `logo.png` conservando el nombre. Detalles en [GUIA_MARCA.md](GUIA_MARCA.md).

## IA (opcional)

La función "✨ Mejorar con IA" usa un Cloudflare Worker (`worker.js`) con Workers AI, protegido por origen permitido (`ALLOWED_ORIGIN`) y código de acceso (`APP_TOKEN`). **No hay claves de API en el repositorio**: se guardan como secrets en Cloudflare.

```bash
wrangler deploy
wrangler secret put APP_TOKEN
```

Luego pegar la URL del Worker en `config.js` (`IA_ENDPOINT`). Si queda vacío, los botones de IA se ocultan. Guía completa en [GUIA_IA.md](GUIA_IA.md).

## Notas de mantenimiento

- Al cambiar cualquier archivo, subir la versión `V` en `sw.js` y mantener `FILES` al día; si no, los celulares siguen mostrando la versión vieja.
- Los datos viven en el dispositivo: si se borran los datos del navegador, se pierde el borrador. Generar el PDF antes de limpiar.
- El repositorio es público: no subir datos personales ni sensibles de la empresa.

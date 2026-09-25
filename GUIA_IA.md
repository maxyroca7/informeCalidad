# Guía: activar "Mejorar con IA"

La app usa **Workers AI de Cloudflare** para reescribir el texto. No se envía a Anthropic y no hace falta una clave de API de Anthropic. Solo viajan el texto del desvío y el contexto escrito por la persona usuaria; las fotos nunca salen del celular.

El plan Workers Free incluye una cuota diaria gratuita de **10.000 neuronas**, reiniciada a las 00:00 UTC. El uso es limitado y puede cambiar; el modelo `@cf/meta/llama-3.2-1b-instruct` prioriza un consumo bajo.

## Paso 1 – Crear el Worker

1. Instalá o usá Wrangler y ejecutá `wrangler login`.
2. Desde esta carpeta, desplegá el Worker:
   ```bash
   wrangler deploy
   ```
3. Copiá la URL terminada en `.workers.dev`.
4. En el Worker, configurá estas variables:
   - `APP_TOKEN`: secreto largo e inventado por vos.
   - `ALLOWED_ORIGIN`: origen exacto de la app, separado por coma si hay más de uno. Ejemplos: `http://localhost:8000` o `https://TUUSUARIO.github.io`.

El binding `AI` ya está declarado en `wrangler.jsonc`; no hace falta crear una API key.

Para cargar el código de acceso sin escribirlo en el código:
```bash
wrangler secret put APP_TOKEN
```

`ALLOWED_ORIGIN` se puede cargar desde **Settings → Variables and Secrets** del Worker como texto, o en el despliegue con `--var ALLOWED_ORIGIN:https://TUUSUARIO.github.io`.

## Paso 2 – Conectar la app

1. Abrí `config.js` y pegá la URL del Worker:
   ```js
   const IA_ENDPOINT = 'https://informe-planta-ia.myworker-dev.workers.dev';
   ```
2. Subí `config.js`, `app.js`, `index.html` y `sw.js` a GitHub Pages.
3. En el celular, cerrá completamente la PWA y volvé a abrirla para que se actualice el service worker.

## Paso 3 – Probar

1. Escribí una descripción o acción correctiva.
2. Tocá **✨ Mejorar con IA**.
3. La primera vez ingresá el `APP_TOKEN`. Queda guardado únicamente en ese navegador.
4. Revisá el resultado: sigue siendo editable y se puede deshacer.

## Problemas frecuentes

- **No aparece el botón:** `IA_ENDPOINT` está vacío, falta subir `config.js` o el celular conserva la versión anterior.
- **Error 403:** `ALLOWED_ORIGIN` no coincide exactamente con el origen de la app.
- **Error 401:** el código de acceso no coincide con `APP_TOKEN`.
- **Error 502 o cuota agotada:** se alcanzó el límite diario gratuito o el modelo no está disponible temporalmente.
- **Sin internet:** la app sigue funcionando, pero la mejora con IA necesita conexión.

## Seguridad y privacidad

El token evita que otras personas usen el Worker. No lo publiques en GitHub. Revisá qué textos de trabajo enviás al modelo y no incluyas datos que la empresa no permita compartir.

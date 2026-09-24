# Guía: activar "Mejorar con IA"

**Cómo funciona:** la app (GitHub Pages) → tu Worker en Cloudflare, que guarda la clave → API de Anthropic. Solo viaja el **texto** que escribís; las fotos nunca salen del celular.

**Costo:** cada mejora usa Claude Haiku 4.5, el modelo más económico; suele ser una fracción de centavo de dólar. Confirmá los precios vigentes en la consola de Anthropic. La API se paga por uso y es aparte de tu suscripción a Claude.

## Paso 1 – Clave de API de Anthropic
1. Creá una cuenta en console.anthropic.com.
2. Cargá un crédito chico y fijá un **límite de gasto mensual** bajo en la configuración de límites.
3. Creá una API key y copiala (se muestra una sola vez). **Nunca** la subas a GitHub ni la compartas.

## Paso 2 – Crear el Worker en Cloudflare (gratis)
1. Creá una cuenta en dash.cloudflare.com.
2. Workers & Pages → Create → Create Worker. Nombre sugerido: `informe-planta-ia`. Tocá Deploy.
3. Edit code: borrá lo que haya, pegá todo el contenido de `worker/worker.js` y tocá Deploy.
4. En el Worker: Settings → Variables and Secrets → agregá estas tres:
   - `ANTHROPIC_API_KEY` (tipo Secret): tu clave del Paso 1.
   - `APP_TOKEN` (tipo Secret): un código de acceso que inventes (largo, tipo contraseña).
   - `ALLOWED_ORIGIN` (tipo Text): `https://TUUSUARIO.github.io` (solo el dominio: sin barra final y sin el nombre del repositorio).
5. Copiá la URL del Worker (`https://informe-planta-ia.xxxx.workers.dev`).

(Los nombres de menús de Cloudflare pueden variar un poco.)

## Paso 3 – Conectar la app
1. Abrí `config.js` y pegá la URL: `const IA_ENDPOINT = 'https://informe-planta-ia.xxxx.workers.dev';`
2. Subí a GitHub estos archivos, reemplazando los anteriores: `config.js`, `app.js`, `index.html`, `sw.js`. Esperá un par de minutos a que Pages actualice.
3. En el celular cerrá la app por completo y abrila dos veces para que tome la versión nueva (el `sw.js` ya viene en v2).

## Paso 4 – Probar
Escribí una descripción, tocá "✨ Mejorar con IA". La primera vez pide el código de acceso: es el `APP_TOKEN`. Queda guardado en ese celular.

## Seguridad
- El código de acceso y el origen permitido evitan que otras personas gasten tu crédito. Igual dejá el límite mensual bajo.
- Si la clave se filtra, borrala en la consola de Anthropic y creá otra.
- Enviás a la IA textos de tu trabajo: revisá que no incluyan datos que tu empresa no permita compartir.

## Problemas frecuentes
- **No aparece el botón:** `config.js` está vacío, no se subió, o el celular tiene la versión vieja (cerrá y abrí la app).
- **Error 403:** `ALLOWED_ORIGIN` mal escrito.
- **"codigo_incorrecto":** el código no coincide con `APP_TOKEN`; la app te lo vuelve a pedir.
- **Error 502:** revisá la clave de API y que tengas crédito.
- **Sin internet:** la app funciona, pero la IA no.

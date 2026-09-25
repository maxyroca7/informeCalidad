# Guía: logo, colores y textos del PDF

El PDF ahora imita la plantilla Word de la empresa: logo arriba, línea de color debajo de cada título, tipografía monoespaciada en el cuerpo y pie de página con numeración. Todo eso se ajusta en dos archivos, sin tocar `app.js`.

## 1. El logo
`logo.png` ya tiene el logo real de Agrofacil (lo extraje de tu PDF de plantilla). Si en algún momento conseguís una versión de mejor calidad, o cambia el isologo, reemplazalo:

1. Conseguí el logo oficial en PNG, con fondo transparente si es posible. Que no sea muy angosto ni muy alto (una proporción parecida a un rectángulo horizontal se ve mejor); una altura real de unos 300-400 px suele andar bien.
2. En GitHub, entrá al archivo `logo.png` del repositorio → ícono de lápiz o "Add file → Upload files" → subí tu archivo con el mismo nombre, `logo.png`, para no tener que tocar el código.
3. Esperá que GitHub Pages actualice (uno o dos minutos) y probá generar un PDF.

Si en algún momento `logo.png` no carga (por ejemplo, lo borraste), la app no rompe: usa el nombre de `BRAND.empresa` como texto, en su lugar.

**Sobre tenerlo en un repositorio público:** un isologo es material de marca pensado para mostrarse, así que no es un dato sensible como una clave o un número de cuenta. Igual, si preferís no tener el logo ni el nombre "Agrofacil" visibles en el código fuente público, dos opciones: (a) borrar `logo.png` del repo (la app cae al texto `BRAND.empresa` automáticamente) y editar `brand.js`, o (b) mover el hosting a Cloudflare Pages o Netlify, que en su plan gratuito permiten desplegar desde un repositorio **privado** de GitHub (el sitio publicado queda igual de accesible por su link, pero el código fuente no es público).

## 2. Ajustar colores y textos fijos
Todo esto está en `brand.js`, con comentarios en cada línea:

- `colorAcento`: el color de la línea bajo el título y bajo cada "DESVÍOS N°...". Ya está puesto en `#BF382A`, el rojo que saqué directamente de tu PDF de plantilla, así que no debería hacer falta tocarlo.
- `tituloInforme`, `etiqueta`, `departamento`, `objetivo`: los textos fijos del informe. Podés editarlos con total libertad.

Después de editar `brand.js`, subilo a GitHub reemplazando el archivo (igual que el logo) y esperá que Pages actualice.

## 3. Si tu empresa no usa la fuente Courier/Times
El PDF usa únicamente las tres fuentes que trae `jsPDF` de fábrica (Helvetica, Times y Courier), porque son las únicas que no requieren cargar un archivo de fuente aparte. Si más adelante querés una tipografía exacta de la empresa, avisame: se puede, pero hay que sumar el archivo de la fuente al repositorio y es un cambio en `app.js`, no solo en `brand.js`.

## Problemas frecuentes
- **El logo se ve enorme o cortado:** probá con un PNG con menos margen en blanco alrededor del isologo.
- **Subí `logo.png` y no cambió nada:** el celular puede estar mostrando la versión vieja guardada. Cerrá la app por completo y abrila de nuevo.
- **El color de la línea no es el correcto:** revisá que el valor en `colorAcento` tenga el `#` y las 6 letras/números (por ejemplo `#B0392C`).

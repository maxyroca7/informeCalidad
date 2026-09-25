// Personalización de marca del PDF. Editá estos valores para ajustar el informe
// a tu empresa. No hace falta tocar app.js para esto.
const BRAND = {
  // Reemplazá el archivo logo.png (misma carpeta) por el logo real de tu empresa.
  // Si no lo reemplazás, se usa este nombre como texto en el encabezado.
  empresa: 'AGROFACIL',

  // Color de acento: la línea bajo el título y bajo cada "DESVÍOS N°...".
  // Formato hexadecimal. Ajustalo al color institucional.
  colorAcento: '#BF382A',

  // Título del informe. Podés usar \n para partirlo en dos líneas, como el original.
  tituloInforme: 'REPORTE DIARIO\nDE ESTADO DE PLANTA',

  // Etiqueta chica en rojo, arriba del título.
  etiqueta: 'INFORME | CALIDAD',

  // Tercera línea del encabezado (debajo de la fecha y el nombre).
  departamento: 'DEPARTAMENTO DE CALIDAD',

  // Párrafo fijo que va debajo del encabezado, antes del primer desvío.
  objetivo: 'Objetivo del relevamiento. Se presenta evidencia fotográfica del estado de la planta al día de la fecha, organizada por sector para facilitar la lectura, el seguimiento de desvíos y la identificación de condiciones a corregir.'
};

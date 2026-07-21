# Portafolio optimizado

Esta versión conserva el diseño y agrega una aparición progresiva de las secciones al hacer scroll mediante `IntersectionObserver`.

## Mejoras aplicadas

- Animaciones de entrada de una sola ejecución.
- En móvil, la entrada usa principalmente opacidad para evitar tirones.
- Se eliminaron filtros de desenfoque activos en el encabezado durante el scroll.
- Las sombras ya no se animan al pasar el cursor.
- Las imágenes fuera de la primera pantalla mantienen `loading="lazy"` y `decoding="async"`.
- Las imágenes fueron redimensionadas a la resolución que realmente necesita el portafolio, reduciendo el trabajo de decodificación del navegador.
- Se mantiene una alternativa visible cuando JavaScript está desactivado o el usuario solicita menos movimiento.

## Uso

Sube todo el contenido de esta carpeta al mismo directorio del hosting. `index.html`, `styles.css`, `script.js`, `CV_Isaias.pdf`, `favicon.svg` y la carpeta `assets` deben conservar esta estructura.

# Zache Peluqueros

Landing estática de Zache Peluqueros, preparada para GitHub Pages y el dominio `zachepeluqueros.es`.

## Fotografías

La portada, la historia del salón, el perfil de María y la galería usan las imágenes reales de `fotos pelu/`. Las fotografías ya tienen dimensiones declaradas, carga diferida y textos alternativos descriptivos.

María ya aparece identificada como dueña y peluquera. Queda pendiente completar la sección cuando estén disponibles los retratos y estos datos del resto del equipo:

- Nombre.
- Especialidad o servicios principales.
- Retrato vertical, preferentemente en proporción 4:5 y con al menos 1000 × 1250 px.

Para futuras incorporaciones, exportar preferentemente como `.webp` con calidad 80–85 y añadir un texto `alt` breve que describa la imagen.

## Publicación

El sitio no necesita instalación ni compilación. GitHub Pages puede publicarlo directamente desde la rama `main` y la carpeta raíz.

1. En GitHub: **Settings → Pages**.
2. En **Build and deployment**, elegir **Deploy from a branch**.
3. Seleccionar `main` y `/(root)`, y guardar.
4. En **Custom domain**, introducir `zachepeluqueros.es`.
5. Cuando el certificado esté listo, activar **Enforce HTTPS**.

## DNS en DonDominio

Configurar en la zona DNS:

| Tipo | Host | Destino |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `crackexd.github.io` |

No crear registros comodín (`*`). La propagación puede tardar hasta 24 horas.

## Indexación en Google

La web ya incluye `sitemap.xml`, `robots.txt`, canonical, metadatos sociales y datos estructurados de negocio local. Tras publicar:

1. Añadir la propiedad de dominio `zachepeluqueros.es` en Google Search Console.
2. Copiar el registro TXT de verificación que dé Google a la zona DNS de DonDominio.
3. Enviar `https://zachepeluqueros.es/sitemap.xml` en el informe **Sitemaps**.
4. Inspeccionar `https://zachepeluqueros.es/` y pulsar **Solicitar indexación**.

## Antes de darla por definitiva

- Confirmar el horario publicado (actualmente lunes a viernes 10:00–19:00 y sábado 10:00–14:00).
- Confirmar que el catálogo publicado refleja exactamente lo que ofrece el salón.
- Añadir los retratos y datos del resto del equipo y, si se desea, la información legal del titular del negocio.
- Los datos identificativos del titular están incorporados en las tres páginas de `legal/`.

## Blog

El índice está en `blog/index.html` y el primer artículo completo sirve de plantilla en `blog/cuidar-el-cabello.html`. Para publicar otro artículo, duplica esa plantilla, cambia el contenido y añade una tarjeta en el índice y una URL en `sitemap.xml`.

## Plan maestro de septiembre de 2026

La revisión y el estado de las propuestas están en [docs/revision-plan-web-2026.md](docs/revision-plan-web-2026.md). La referencia de datos publicados y los campos pendientes están en [docs/datos-maestros-zache.md](docs/datos-maestros-zache.md).

El sitio cuenta con cinco páginas de servicio: corte y estilo, color y mechas, cabello rizado, peinados y acabados y recogidos para eventos. Las reservas siguen siendo telefónicas. El blog, la galería y la portada enlazan a los servicios, y las páginas públicas incorporan un acceso móvil a cita y mapa.

Analytics incorpora los eventos `click_ver_servicio`, `click_info_cita` y `abrir_pregunta`, además de las intenciones de llamada y ruta existentes. Todos requieren consentimiento. La documentación explica las dimensiones que debe configurar el propietario en GA4 y los límites de interpretar estos clics como citas.

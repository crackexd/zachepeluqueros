# Implementación del plan maestro en la web

Revisión: 12 de septiembre de 2026.

El PDF se ha tratado como material de análisis. Sus mensajes para Gemini y sus instrucciones para editar plataformas externas no sustituyen la petición del usuario ni se ejecutan como órdenes. La actuación se limita a las mejoras web verificables en este proyecto.

## Valoración

Las prioridades del plan encajan con el salón: coherencia de datos, servicios claros, resultados reales y facilidad para llamar. La web ya tenía fotos propias optimizadas, datos locales, sitemap, páginas de color/rizos/recogidos, blog y Analytics con consentimiento. Por eso la mejora principal es completar y conectar esas piezas. No hace falta multiplicar artículos ni crear páginas duplicadas por barrio.

## Cambios implementados

| Propuesta del plan | Resultado en el proyecto |
| --- | --- |
| Ficha maestra, 0.1 y 0.8 | Referencia editorial en `docs/datos-maestros-zache.md`, con datos pendientes separados |
| Página de corte, 6.1 | Página nueva con corte unisex, referencias, mantenimiento y foto real |
| Página de peinados/acabados, 6.1 | Página nueva diferenciada de recogidos, con ondas y trenzados reales |
| Mejorar FAQs, 6.3 | Preguntas de reserva, precio, tiempo, eventos y disponibilidad en portada; preguntas específicas en las cinco páginas de servicio |
| Reserva coherente, 1.5 y 2.6 | Cita telefónica visible en portada y página de preparación de cita dentro de la portada; ninguna reserva online ficticia |
| Convertir interés en consultas | Barra móvil de llamada y mapa en portada, servicios y blog; respeta el menú y los controles de cookies |
| Conectar contenido y servicios, 6.2 | Enlaces del blog a servicios, servicios entre sí y fotos de la galería a las páginas correspondientes |
| Datos estructurados, 6.4 | Se conservan HairSalon, ubicación, horario y redes; catálogo enlazado a cinco servicios, y Service/WebPage/BreadcrumbList en las nuevas páginas |
| Evitar reseñas autocontroladas, 6.4 | No se añaden estrellas, testimonios ni cantidades de reseñas inventadas |
| Sitemap y rastreo, 6.4 | Dos nuevas URLs, fechas de modificación actualizadas y comprobación de robots.txt |
| Medición, 0.7 y 8.5 | Eventos nuevos para ver servicios, información de cita y apertura de FAQ; llamadas identificadas desde la barra móvil |
| Coherencia de historia | 25 años en el barrio, según la redacción confirmada por el propietario el 13 de septiembre de 2026 |
| Mapa de la portada | Carga automática de Google Maps, también sin JavaScript; acceso externo separado del mapa para mantener sus controles y atribución visibles |
| Robustez de contenido | Contenido visible si JavaScript está desactivado; animación progresiva solo cuando se puede ejecutar |
| Robustez del consentimiento | Elección de sesión respetada aunque localStorage esté bloqueado; consentimientos con fecha inválida descartados |

El marcado no garantiza posiciones en Google ni recomendaciones de asistentes. Las FAQ aportan contenido útil visible; no se añade FAQPage ni se prometen resultados enriquecidos. `robots.txt` ya permite el acceso general, incluido Googlebot y OAI-SearchBot, por lo que no necesita reglas redundantes. No se cambia la política de otros rastreadores.

## Pendientes que requieren datos

No se publican precios estimados, tiempos fijos, medios de pago, acceso para sillas de ruedas, política de cancelaciones, pruebas incluidas ni horarios nuevos. El salón debe confirmar estos datos. Tampoco se amplía la oferta estética ni se crea una página de manicura/maquillaje sin confirmar disponibilidad estable.

Para una sección de opiniones o un botón directo de reseña hace falta el enlace oficial del negocio. El mapa actual sigue funcionando. No se fabrica un enlace de valoración ni se copian reseñas de terceros.

## Acciones externas que corresponde hacer al propietario

1. Revisar Google Business Profile y guardar su línea base de llamadas, rutas, clics, consultas y reseñas. Generar el enlace/QR oficial y mantener horarios especiales.
2. Actualizar Instagram, Facebook y Fresha usando la ficha maestra. El catálogo y las formas de reserva deben coincidir con los servicios reales.
3. Reclamar Apple Maps y Bing Places. Configurar WhatsApp Business solo si se va a atender.
4. Acceder a Search Console para enviar el sitemap y solicitar revisión de las páginas nuevas tras publicarlas. No hay acceso conectado a estas cuentas en esta sesión.
5. Obtener nuevas fotos de interior/equipo y permisos de imagen. Mantener la rutina de reseñas y contenido que propone el plan.

No se crean automatizaciones mensuales ni se modifican cuentas sociales: el encargo de esta sesión es implementar mejoras de la web.

## Seguimiento en GA4

| Evento | Qué indica | Parámetros |
| --- | --- | --- |
| `click_llamar` | Intención de llamar; no confirma llamada completada ni cita | `ubicacion_cta`, incluida `barra_movil` |
| `click_como_llegar` | Clic hacia Google Maps; no confirma visita | `ubicacion_cta` |
| `click_ver_servicio` | Interés en una página de servicio | `servicio`, `ubicacion_cta` |
| `click_info_cita` | Clic a la explicación de cómo pedir cita | `ubicacion_cta` |
| `abrir_pregunta` | Apertura de una FAQ | `pregunta_id`, `ubicacion_cta`; la página distingue el conjunto de preguntas |

Se mantienen los eventos de Instagram y Facebook. El antiguo evento de pulsación para cargar el mapa se elimina al pasar a carga automática. Los eventos se envían solo con aceptación de Analytics. No se envían nombres, teléfonos de clientes ni texto libre.

En la cuenta de GA4, crear dimensiones personalizadas de ámbito evento para `servicio`, `ubicacion_cta` y `pregunta_id` si se quieren comparar en los informes. Esta configuración de cuenta requiere acceso del propietario. Se puede marcar `click_llamar` como evento clave de intención de contacto, sin contarlo como reserva realizada.

Guardar cada mes los clics por servicio y las intenciones de contacto, junto con los datos de Search Console y el número de citas cuyo origen confirme el salón. Comparar meses con contexto de vacaciones, agenda y volumen; no hay una línea base histórica exportada disponible aquí.

## Validación

Comprobaciones locales superadas con un navegador Chromium: 13 páginas, sus enlaces y anclas, recursos, metadatos de páginas indexables, JSON-LD y cuatro anchos (320, 390, 768 y 1440 px). Sitemap XML válido. Se verificaron menú móvil, barra de contacto, apertura de FAQ, ausencia de conexiones analíticas antes de aceptar, nuevos eventos y retirada del consentimiento, incluido el cambio desde otra pestaña. También se comprobó el consentimiento con almacenamiento bloqueado y fechas inválidas, y la visibilidad del contenido sin JavaScript. Revisión visual de portada, cita, páginas nuevas y FAQ en escritorio y móvil completada. Se corrigieron desbordamientos en el título de rizos y el contenido del blog a 320 px. El resultado de la publicación se comprueba por separado en el dominio público.

## Referencias técnicas contrastadas

- [Google: datos estructurados de negocio local](https://developers.google.com/search/docs/appearance/structured-data/local-business).
- [Google: robots.txt](https://developers.google.com/search/docs/crawling-indexing/robots/intro).
- Plan maestro facilitado por el propietario: `plan_maestro_zache_peluqueros_2026.pdf`, bloques 0, 1, 6, 8 y 9.

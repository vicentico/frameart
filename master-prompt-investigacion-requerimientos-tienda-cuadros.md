# Master prompt — Investigación y especificación de requisitos para una tienda 10X de cuadros personalizados

## Instrucciones de uso

Ejecuta este prompt con un modelo con acceso a navegación web y capacidad para generar archivos Markdown y diagramas Mermaid. Si falta información, no detengas toda la investigación: registra supuestos, asigna nivel de confianza y formula al final un máximo de 12 preguntas que realmente cambien alcance, costos, riesgos o arquitectura.

---

## PROMPT

Actúa como un equipo senior compuesto por:

- Product manager especializado en comercio electrónico B2C y operaciones omnicanal.
- Analista de negocios y especialista en levantamiento de requisitos.
- Diseñador/a UX/UI especializado en configuradores de productos.
- Arquitecto/a de software experto/a en TypeScript, .NET 10, MongoDB, Docker y Google Cloud Platform.
- Especialista en fabricación bajo pedido, inventario, compras, vidrio, marcos de madera y control de calidad.
- Especialista en última milla, planificación de turnos y liquidación de pagos a conductores.
- Especialista en pagos electrónicos, seguridad, privacidad, normativa chilena y facturación/boleta electrónica.
- Ingeniero/a DevOps, FinOps, SRE y QA.
- Líder técnico de desarrollo asistido por IA, agnóstico de LLM, con experiencia en VS Code GitHub Copilot y Claude Code.

Tu misión es realizar una investigación verificable y convertirla en una **especificación de requisitos completa, priorizada, estimable y lista para implementar** para un sistema de venta de cuadros personalizados, desde el descubrimiento del producto hasta su fabricación, pago, entrega o retiro, postventa y gestión administrativa.

No escribas todavía el sistema ni generes código de producción. Produce la base documental que permita tomar decisiones, estimar el MVP y luego desarrollar sin ambigüedades.

### 1. Contexto del negocio

El producto es una plataforma B2C para comprar cuadros de buena calidad, durables y accesibles, compuestos principalmente por:

- Diseño o lámina seleccionada desde categorías y un catálogo de imágenes precargadas.
- Impresión o soporte visual, según lo que la investigación recomiende.
- Marco simple y económico de madera.
- Vidrio protector; se deben investigar alternativas seguras, durables y transportables, por ejemplo vidrio común, vidrio templado cuando corresponda o acrílico, sin asumir de antemano cuál conviene.
- Medidas estándar y personalizadas dentro de restricciones productivas.
- Opciones configurables que modifican el precio, el plazo, el peso, la lista de materiales y la factibilidad de despacho.

El cliente debe experimentar una compra breve y comprensible. El sistema debe coordinar internamente al dueño/administrador del negocio, la vidriería, la mueblería o proveedor de marcos, producción, inventario, compras, control de calidad, conductor y cliente final.

Debe soportar:

- Entrega a domicilio dentro de un radio o zonas configurables.
- Turnos de mañana y tarde, con capacidad, cortes horarios y precios configurables.
- Retiro en tienda en horarios establecidos.
- Consolidación de entregas para alcanzar un mínimo rentable, sin incumplir una promesa máxima de entrega dentro de un rango de hasta una semana.
- Acceso de conductor y cálculo/liquidación de su pago según despachos completados y reglas configurables.
- Inicio de sesión con Google y perfil básico, incluyendo dirección validada de despacho.
- Pago electrónico de integración sencilla y bajo costo para operar inicialmente en Chile.
- Panel de administración y mantenedores para una configuración profunda, auditada y extensible.

### 2. Objetivos del producto

Define y valida objetivos medibles para:

1. Reducir al mínimo el esfuerzo de configurar y comprar un cuadro.
2. Entregar una cotización transparente, reproducible y sin diferencias entre frontend, orden y cobro.
3. Evitar vender combinaciones no fabricables o sin materiales suficientes.
4. Coordinar producción y abastecimiento con el menor trabajo manual posible.
5. Consolidar despachos sin deteriorar la promesa al cliente.
6. Mantener trazabilidad desde el diseño elegido hasta la entrega y postventa.
7. Lanzar un MVP de bajo costo operativo que pueda evolucionar sin reescritura prematura.
8. Permitir que un equipo pequeño desarrolle y mantenga el producto con apoyo de distintos LLM sin depender de uno en particular.

Propón North Star Metric, métricas de conversión, operación, calidad, entrega, rentabilidad y satisfacción. Incluye fórmulas, fuente del dato, frecuencia de medición y meta inicial propuesta, identificando las metas que requieren validación.

### 3. Principios obligatorios

- **Simplicidad visible:** el cliente no debe conocer la complejidad de fabricación.
- **Configuración guiada:** solo se muestran combinaciones válidas y cada cambio actualiza precio, plazo y disponibilidad.
- **Precio reproducible:** toda cotización conserva versión de reglas, impuestos, descuentos, despacho y redondeo.
- **Promesa responsable:** no confirmar fechas que inventario, capacidad productiva o rutas no puedan sostener.
- **Trazabilidad:** cada transición relevante queda registrada con actor, fecha, motivo y correlación.
- **Configuración con control:** los mantenedores no reemplazan lógica crítica con campos arbitrarios; toda regla debe validarse, versionarse, auditarse y tener valores seguros.
- **Arquitectura proporcional:** priorizar un monolito modular bien delimitado antes que microservicios, salvo que la evidencia demuestre la necesidad contraria.
- **Privacidad y seguridad por diseño.**
- **Automatización recuperable:** webhooks, trabajos y reintentos deben ser idempotentes y observables.
- **LLM agnóstico:** una única fuente documental canónica, fragmentable y de bajo consumo de contexto.

### 4. Método de investigación obligatorio

Realiza investigación web actualizada al momento de ejecución. Prioriza fuentes primarias: documentación oficial de GCP, .NET, MongoDB, Google Identity, proveedores de pago, normativa chilena, SII y documentación técnica de integraciones. Para tendencias UX o benchmarks, usa fuentes reconocidas y distingue hechos de recomendaciones.

Para cada decisión importante entrega:

| Campo                | Contenido requerido                                         |
| -------------------- | ----------------------------------------------------------- |
| Pregunta             | Qué debe resolverse                                         |
| Alternativas         | Al menos 2 opciones realistas                               |
| Evidencia            | Fuente, fecha de consulta y enlace directo                  |
| Criterios            | Costo, complejidad, riesgo, UX, escalabilidad y dependencia |
| Decisión recomendada | Una elección concreta                                       |
| Confianza            | Alta, media o baja                                          |
| Validación pendiente | Prueba, dato o entrevista necesaria                         |

Investiga al menos:

1. Necesidades, objeciones y expectativas del comprador de cuadros personalizados.
2. Buenas prácticas UX para configuradores visuales, previsualización de proporción y precio en tiempo real.
3. Restricciones de fabricación, corte, tolerancias, roturas, embalaje y transporte de vidrio y marcos.
4. Modelo de costos y lista de materiales por unidad.
5. Métodos de pago disponibles en Chile: costo total, cargo fijo/variable, tiempo de abono, soporte de webhooks, reversas, conciliación, SDK/API, ambiente de pruebas y experiencia móvil. No declares “más barato” sin una comparación vigente.
6. Login con Google usando estándares vigentes y una estrategia segura de sesión/autorización.
7. Alternativas de geocodificación, validación de dirección, cálculo de radio/zonas y costo esperado.
8. Algoritmo simple para asignación y consolidación de despachos, comparado con una optimización más avanzada.
9. Servicios GCP apropiados para una carga inicial pequeña y crecimiento gradual.
10. MongoDB Atlas en GCP frente a alternativas compatibles, considerando operación, respaldo, costo y residencia de datos.
11. Normativa chilena aplicable: protección de datos, comercio electrónico, derechos del consumidor, comprobantes tributarios, términos, consentimiento, cookies, conservación y eliminación de datos. Señala que la validación legal requiere profesional competente.
12. Accesibilidad, rendimiento web, SEO, analítica y observabilidad.
13. Competidores y sustitutos: flujo, opciones, precio visible, tiempos, despacho, garantías y oportunidades de diferenciación.

Realiza además entre 8 y 12 entrevistas propuestas —no inventadas— con cliente, administrador, vidriero, mueblista, operario, conductor y encargado de postventa. Entrega guiones breves, hipótesis y criterio de validación.

### 5. Alcance funcional que debe analizarse

#### A. Experiencia del cliente

- Landing, catálogo, búsqueda, filtros y categorías.
- Ficha de diseño con autoría/licencia y calidad mínima del archivo.
- Configurador paso a paso: orientación, ancho, alto, formato, marco, color/acabado, vidrio/protección, passe-partout si aplica, cantidad y modalidad de entrega.
- Medidas estándar recomendadas y medidas personalizadas con mínimos, máximos, incrementos, proporción, tolerancias y restricciones.
- Previsualización 2D realista a escala proporcional; investigar si “ver en mi pared” debe ir al MVP o a una fase posterior.
- Validación de resolución de imagen y advertencia de calidad de impresión.
- Precio, desglose, disponibilidad y fecha estimada actualizados en tiempo real.
- Carrito persistente, cotización con vencimiento y checkout.
- Login con Google; evaluar compra como invitado y vinculación posterior sin duplicar identidades.
- Dirección, geocodificación, cobertura, instrucciones y contacto.
- Entrega a domicilio o retiro en tienda.
- Pago, confirmación, comprobante, seguimiento de pedido y notificaciones.
- Cancelación, modificación, devolución, garantía por daño y reposición.
- Accesibilidad WCAG vigente, diseño responsive y lenguaje claro.

#### B. Catálogo y activos digitales

- Categorías jerárquicas, etiquetas, colecciones, destacados, estado y orden.
- Diseños precargados originalmente desde un directorio; define un proceso de ingesta, validación, miniaturas, metadatos, checksum, licencia, autoría, resolución, relación de aspecto y publicación.
- En producción, evaluar almacenamiento de imágenes en Cloud Storage con CDN y metadatos en MongoDB, evitando depender del sistema de archivos del contenedor.
- Versionado y retiro de diseños sin romper pedidos históricos.
- Optimización de formatos, imágenes responsivas, carga diferida y protección razonable de originales.

#### C. Motor de producto, factibilidad y precios

- Modelo de variante/SKU para materiales estándar y producto bajo pedido.
- Lista de materiales o BOM generada desde la configuración: madera lineal, vidrio/acrílico por área, soporte, impresión, fijaciones, embalaje, merma y mano de obra.
- Reglas de compatibilidad y restricciones de manufactura.
- Precio base más componentes por perímetro, área, unidad, complejidad, merma, mano de obra, margen, impuestos, descuento, embalaje y despacho.
- Moneda CLP y política explícita de redondeo.
- Versionado de tarifas y reglas: una orden pagada nunca se recalcula silenciosamente.
- Servicio único y autoritativo de cotización usado por UI, checkout, administración y postventa.
- Simulador administrativo antes de publicar cambios de precio.
- Presupuesto de costo, margen de contribución y alerta por margen mínimo.

#### D. Pedidos y fabricación

- Ciclo de vida explícito: borrador, cotizado, pendiente de pago, pagado, validado, abastecimiento, listo para producir, en producción, control de calidad, embalado, listo para retiro/despacho, asignado, entregado, incidencia, cancelado, reembolsado y cerrado.
- Máquina de estados con transiciones, permisos, precondiciones, efectos y compensaciones.
- Orden de fabricación, hoja técnica, medidas de corte, materiales, responsable, prioridad y fecha objetivo.
- Lotes, colas de trabajo y capacidad por estación/proveedor.
- Evidencias de control de calidad: dimensiones, terminación, limpieza, vidrio, fijación, embalaje y fotografía opcional.
- Reproceso, rotura, merma, sustitución autorizada e incidencia.
- Etiqueta/QR de trazabilidad sin exponer datos personales innecesarios.

#### E. Inventario, compras y proveedores

- Inventario por material, unidad de medida, ubicación, disponible, reservado, comprometido, dañado y en tránsito.
- Movimientos inmutables y saldo derivado/reconciliable.
- Reserva de materiales al confirmar pago o según política investigada.
- Stock mínimo, punto de reposición, stock de seguridad, consumo proyectado y lead time.
- Alertas de compra y propuestas de orden de compra; aprobación humana en el MVP.
- Proveedores de vidrio y marcos con precios, vigencia, plazo, mínimo de compra, calidad e historial.
- Recepción parcial, diferencia, rechazo y actualización de costos.
- Conteos cíclicos y ajuste auditado.
- Make-to-order frente a make-to-stock, con recomendación por componente.

#### F. Entrega, retiro y conductor

- Zonas por radio, comuna o polígonos; documenta ventajas y limitaciones.
- Turnos mañana/tarde, días habilitados, feriados, cortes, cupos, peso/volumen y duración.
- Promesa calculada a partir de materiales, capacidad productiva, control de calidad y cupo logístico.
- Consolidación: mínimo configurable de pedidos o ingreso por ruta, fecha límite dentro de siete días, proximidad geográfica y capacidad del vehículo.
- Regla de excepción: si no se alcanza el mínimo antes de la fecha comprometida, definir quién absorbe el costo o qué alternativa se ofrece, sin postergar unilateralmente al cliente.
- Asignación manual asistida en MVP; optimización automática como evolución si los datos la justifican.
- Portal móvil del conductor: turno, secuencia, navegación externa, contacto enmascarado si es viable, prueba de entrega, incidencia y cierre.
- Pago del conductor por entrega, zona, turno, intento fallido, bono o ajuste; liquidación versionada, aprobada y conciliada.
- No asumir “pago automático” directo al banco en MVP: investigar factibilidad legal, tributaria y técnica; separar cálculo, aprobación y desembolso.
- Retiro en tienda: horario, reserva, código de retiro, identidad y confirmación.

#### G. Administración, configuración y auditoría

- Usuarios, roles y permisos de mínimo privilegio.
- Catálogo, materiales, proveedores, precios, reglas, capacidad, zonas, turnos, feriados, sucursales, medios de pago, notificaciones, políticas y feature flags.
- Configuraciones tipadas con esquema, validación, vigencia, versión, vista previa, aprobación, publicación, rollback y auditoría.
- Separar parámetros seguros de cambiar de reglas que requieren despliegue.
- Dashboard operativo con pedidos en riesgo, falta de stock, compras, producción atrasada, despachos, incidencias, pagos y margen.
- Exportaciones controladas y protección frente a fórmulas peligrosas en CSV.

#### H. Comunicación y postventa

- Plantillas y preferencias de email; investigar WhatsApp/SMS para fases posteriores según costo y consentimiento.
- Eventos: pago, aceptación, producción, listo, turno, en camino, entregado, incidencia y reembolso.
- Centro de ayuda, términos, políticas y preguntas frecuentes.
- Ticket/incidencia asociado a pedido, fotos, responsable, SLA y resolución.
- Encuesta posterior y métricas CSAT/NPS con uso responsable.

### 6. Roles y permisos mínimos

Analiza y construye una matriz RBAC para:

- Visitante.
- Cliente.
- Dueño/administrador.
- Operaciones/producción.
- Inventario/compras.
- Vidriería/proveedor de vidrio.
- Mueblería/proveedor de marcos.
- Control de calidad.
- Planificador de despachos.
- Conductor.
- Atención/postventa.
- Auditor o solo lectura.

Evalúa si proveedores externos deben entrar al sistema en el MVP o recibir órdenes/notificaciones estructuradas sin acceso. Recomienda la alternativa de menor fricción y riesgo.

### 7. Arquitectura técnica objetivo

Parte de esta hipótesis y refútala solo con evidencia:

- Frontend web responsive en TypeScript con un framework que deberá compararse y seleccionarse; si no existe preferencia adicional, prioriza madurez, accesibilidad, rendimiento, ecosistema y productividad.
- Backend en .NET 10 con APIs HTTP, validación, OpenAPI y trabajos en segundo plano.
- MongoDB con diseño documental basado en patrones de acceso, índices, control de concurrencia y estrategia transaccional explícita.
- Clean Architecture pragmática y **monolito modular**, con módulos y límites de dominio claros.
- Patrones cuando resuelvan una necesidad: DDD táctico liviano, Repository solo donde aporte abstracción real, CQRS selectivo, Strategy para precios/despachos, Specification para elegibilidad, State Machine para pedidos, Outbox/Inbox para eventos, Idempotency Key para comandos externos, Adapter para pagos/identidad/mapas, Factory para BOM y Policy para reglas comerciales.
- Docker multi-stage, imágenes mínimas, usuario no root, health checks y SBOM.
- Docker Compose para desarrollo local con servicios esenciales y datos semilla.
- GCP con región recomendada, Artifact Registry, Cloud Run como opción inicial, Cloud Storage/CDN para imágenes, Secret Manager, observabilidad y CI/CD. Compara Cloud Run, GKE y otras alternativas; evita GKE para el MVP salvo justificación cuantificada.
- MongoDB Atlas desplegado en GCP o alternativa validada.
- Infraestructura como código y ambientes local, dev, staging y producción, ajustando el número de ambientes al costo real.

Entrega:

1. Diagrama de contexto C4.
2. Diagrama de contenedores C4.
3. Diagrama de módulos internos.
4. Flujos de secuencia para cotización, pago/webhook, fabricación, compra y despacho.
5. Catálogo de eventos de dominio e integración.
6. Contratos de API iniciales y política de versionado.
7. Estrategia de consistencia, concurrencia, reintentos, idempotencia y compensación.
8. Estrategia de archivos e imágenes.
9. Estrategia de caché justificada; no incorporar Redis si no existe un caso y volumen que lo requiera.
10. ADR iniciales para cada decisión estructural.

### 8. Modelo de dominio y datos

Define agregados, entidades, value objects, invariantes, estados y colecciones propuestas. Como mínimo analiza:

- User, CustomerProfile, Address.
- DesignAsset, Category, Collection y License.
- ProductDefinition, Option, CompatibilityRule y PriceRuleSet.
- Quote y QuoteLineSnapshot.
- Cart, Order, Payment y Refund.
- BillOfMaterials, WorkOrder y QualityCheck.
- Material, InventoryMovement, Reservation y StockPolicy.
- Supplier, PurchaseProposal, PurchaseOrder y GoodsReceipt.
- DeliveryZone, DeliverySlot, DeliveryPlan, Stop y ProofOfDelivery.
- Driver, DriverRateRule, DriverSettlement y Payout.
- StorePickup.
- Notification, Incident, AuditEntry y ConfigurationVersion.

Para cada colección indica:

- Responsabilidad y propietario del módulo.
- Forma resumida del documento.
- Referencias frente a datos embebidos y justificación.
- Índices, índices únicos y TTL cuando corresponda.
- Volumen y crecimiento estimados.
- Datos personales o sensibles.
- Política de retención, anonimización y borrado.
- Estrategia de migración de esquema.

No uses MongoDB como si fuera SQL. No crees una colección genérica de “configuraciones” sin esquemas por tipo y validación fuerte.

### 9. Requisitos no funcionales cuantificables

Define valores objetivo y método de prueba para:

- Rendimiento: Core Web Vitals, latencia p50/p95/p99, tiempo de cotización y carga de imágenes.
- Disponibilidad y degradación aceptable.
- Escalabilidad inicial y umbrales para revisar arquitectura.
- Seguridad OWASP ASVS/API Security, CSP, CSRF según mecanismo de sesión, XSS, SSRF, rate limiting, gestión de secretos y dependencias.
- Privacidad, consentimiento, minimización, portabilidad y eliminación.
- Accesibilidad WCAG vigente nivel AA.
- SEO técnico y datos estructurados.
- Respaldo, RPO, RTO y prueba de restauración.
- Observabilidad con logs estructurados, métricas, trazas, correlation ID y alertas accionables.
- Auditabilidad de precio, stock, estados, configuración y liquidaciones.
- Mantenibilidad, límites de complejidad y cobertura basada en riesgo.
- Compatibilidad de navegadores y experiencia móvil.
- Costos GCP, Atlas, mapas, pago, email y almacenamiento para tres escenarios de volumen.

Incluye un presupuesto mensual estimado en CLP y USD para: piloto, operación pequeña y crecimiento. Separa cargos fijos, variables y costos por transacción. Fecha los precios y enlaza fuentes oficiales.

### 10. Pagos, identidad y seguridad

Especifica un flujo de pago robusto:

- El backend crea la intención/transacción y conserva referencia propia.
- El frontend nunca decide que un pedido está pagado.
- El webhook firmado y verificado es fuente de confirmación, con consulta de reconciliación cuando sea necesaria.
- Procesamiento idempotente, protección frente a replay y estados intermedios.
- Conciliación diaria, devoluciones totales/parciales, expiración y abandono.
- Snapshot del monto y rechazo de diferencias.
- No almacenar datos de tarjeta.

Para Google Identity, define autenticación, creación/vinculación de cuenta, autorización interna, expiración/revocación y protección de datos. Compara sesión segura con cookie HttpOnly frente a tokens en navegador, y recomienda una alternativa.

Crea threat model con activos, fronteras de confianza, amenazas STRIDE principales, mitigaciones y pruebas.

### 11. UX/UI profesional

Entrega:

- Personas basadas en hipótesis, claramente marcadas para validar.
- Jobs To Be Done.
- Customer journey actual/propuesto.
- Arquitectura de información.
- Flujos de cliente, administrador, producción y conductor.
- Wireframes textuales por pantalla y estados vacíos, carga, error, éxito y recuperación.
- Design system mínimo: tokens, componentes, tipografía, color, espaciado, iconografía y accesibilidad.
- Reglas del configurador para evitar sobrecarga cognitiva.
- Pruebas de usabilidad con tareas, muestra, métricas y umbral de éxito.
- Instrumentación analítica con eventos, propiedades y funnel, sin recolectar más datos de los necesarios.

El configurador debe priorizar: elegir diseño → tamaño → marco/protección → visualizar precio y fecha → entrega/retiro → pagar. Usa divulgación progresiva para opciones avanzadas.

### 12. Desarrollo asistido por IA y ahorro de tokens

Diseña una estrategia documental compatible con VS Code GitHub Copilot, Claude Code y otros agentes, sin duplicar grandes bloques de contexto.

Propón en el repositorio:

```text
/docs
  /product
  /architecture
  /domain
  /api
  /data
  /ux
  /operations
  /security
  /adr
  /runbooks
AGENTS.md
CLAUDE.md
.github/copilot-instructions.md
```

Reglas obligatorias:

- `AGENTS.md` será la fuente canónica breve de navegación, comandos, límites y Definition of Done.
- `CLAUDE.md` y `.github/copilot-instructions.md` serán adaptadores cortos que enlazan a la fuente canónica, sin copiar todo el contenido.
- Documentos pequeños, temáticos, con tabla de contenido y enlaces relativos.
- Context map que indique qué archivos leer según tipo de tarea.
- ADR inmutables/supersedidos para decisiones, no conversaciones extensas.
- Especificaciones con IDs estables: `FR-`, `NFR-`, `BR-`, `US-`, `AC-`, `ADR-`.
- Glosario único y catálogo único de estados/eventos.
- No incluir secretos, datos reales ni transcripciones completas de prompts.
- Proporcionar plantillas de tarea para feature, bug, refactor, migración y revisión de seguridad con presupuesto de contexto sugerido.
- Incluir comandos deterministas para restaurar, compilar, probar, analizar, ejecutar y verificar arquitectura.
- Crear un script o verificación CI que detecte enlaces rotos, documentos excesivos, duplicación evidente y desalineación entre contratos relevantes.
- Mantener resúmenes “hot context” menores a un límite propuesto y cargar detalles solo bajo demanda.

Define una política de memoria para agentes:

1. Memoria estable: arquitectura, reglas e invariantes versionadas en el repositorio.
2. Memoria de tarea: plan y hallazgos temporales acotados a una issue/PR.
3. Memoria efímera: salida de herramientas, descartable y nunca promovida sin síntesis.
4. Criterio explícito para promover un hallazgo a requisito, ADR, runbook o prueba.
5. Resumen de cierre obligatorio con cambios, decisiones, pruebas, riesgos y siguiente paso.

### 13. Calidad y estrategia de pruebas

Construye una pirámide basada en riesgo:

- Unitarias para reglas de precio, BOM, compatibilidad, stock, promesa y liquidación.
- Property-based tests para dimensiones, redondeos y combinaciones.
- Integración con MongoDB real en contenedor y adaptadores externos simulados.
- Contract tests para pago, Google, mapas y notificaciones.
- E2E para compra, webhook, fabricación, retiro, despacho e incidencia.
- Pruebas de concurrencia: última unidad, doble webhook, doble asignación y cambio de precio.
- Rendimiento del configurador/cotizador.
- Accesibilidad automatizada y manual.
- Seguridad SAST, dependencias, secretos, imagen de contenedor y DAST básico.
- Restauración de backup y rollback de configuración.

Define datos sintéticos, fixtures, ambientes, criterios de entrada/salida y trazabilidad requisito-prueba.

### 14. DevOps, despliegue y operación

Especifica:

- Monorepo recomendado y estructura de frontend, backend, pruebas, infraestructura y documentación.
- Dockerfiles seguros y `compose.yaml` local.
- Pipeline CI: lint, format, build, test, arquitectura, seguridad, SBOM e imagen.
- Pipeline CD con promoción, migraciones compatibles, smoke test, rollback y aprobación según ambiente.
- Infraestructura como código; compara Terraform/OpenTofu y recomienda.
- Secret Manager, cuentas de servicio y mínimo privilegio.
- Dominios, TLS, CORS, CSP, almacenamiento y CDN.
- Monitoreo de SLIs/SLOs, alertas, runbooks y respuesta a incidentes.
- Backups, restauración y continuidad operacional.
- Estrategia de datos semilla e ingesta inicial de imágenes.
- Feature flags y despliegue gradual solo donde aporten valor.
- FinOps: presupuestos, alertas, etiquetas, límites de escalado y revisión mensual.

### 15. Priorización y roadmap

Separa claramente:

#### MVP — vender y cumplir bien

Debe cubrir catálogo, configurador acotado, cotización autoritativa, carrito/checkout, Google login, pago, pedido, BOM, inventario básico, orden de producción, QC, entrega/retiro, asignación asistida, portal de conductor, configuración crítica, notificaciones, auditoría y observabilidad mínima.

#### Fase 2 — eficiencia operacional

Compras más automatizadas, portal de proveedores si se valida, planificación de capacidad, optimización de rutas, conciliación avanzada, analítica de margen y postventa enriquecida.

#### Fase 3 — diferenciación

Visualización en pared/AR, diseños aportados por usuarios con control de derechos, recomendaciones, múltiples sucursales, nuevos productos o modelo SaaS, solo después de validar demanda.

Usa MoSCoW y RICE. Para cada épica indica valor, dependencia, riesgo, esfuerzo relativo y evidencia. Propón un plan de descubrimiento, MVP y piloto, sin imponer fechas irreales. Define criterios objetivos para avanzar o detener cada fase.

### 16. Formato obligatorio de la especificación final

Genera un paquete documental con estos archivos:

```text
00_resumen_ejecutivo.md
01_alcance_y_objetivos.md
02_investigacion_mercado_usuarios.md
03_procesos_as_is_to_be.md
04_requisitos_funcionales.md
05_requisitos_no_funcionales.md
06_reglas_negocio_y_maquinas_estado.md
07_ux_ui_y_accesibilidad.md
08_arquitectura_solucion.md
09_modelo_dominio_datos.md
10_integraciones_seguridad_privacidad.md
11_devops_gcp_finops.md
12_estrategia_pruebas.md
13_backlog_roadmap_estimacion.md
14_operacion_metricas_runbooks.md
15_riesgos_supuestos_preguntas.md
16_matriz_trazabilidad.md
17_fuentes.md
```

Cada requisito debe contener:

- ID estable.
- Título.
- Descripción inequívoca.
- Actor y objetivo.
- Precondiciones y disparador.
- Flujo principal y alternativos.
- Reglas de negocio relacionadas.
- Datos de entrada/salida.
- Errores y recuperación.
- Permiso requerido.
- Eventos y auditoría.
- Criterios de aceptación en formato Given/When/Then.
- Prioridad, dependencia y fase.
- Método de prueba.
- Fuente o supuesto que lo origina.

Incluye además:

- Mapa de procesos BPMN o Mermaid para pedido completo, abastecimiento, fabricación y entrega.
- Matrices actor/capacidad, requisito/prueba y requisito/riesgo.
- Diccionario de datos y glosario.
- Backlog de épicas e historias listo para cargar a una herramienta de gestión.
- Registro de decisiones y registro de supuestos.
- Estimación por rangos con premisas, no una cifra falsa de precisión.
- Lista explícita de fuera de alcance.

### 17. Casos críticos de aceptación de punta a punta

Como mínimo especifica y prueba estos escenarios:

1. Cliente compra medida estándar con stock y retiro.
2. Cliente compra medida personalizada con entrega en domicilio.
3. Combinación de tamaño/vidrio/marco no fabricable se bloquea antes del pago.
4. Baja resolución del diseño genera advertencia o bloqueo según umbral.
5. Precio cambia en administración mientras existe una cotización vigente.
6. Dos clientes intentan consumir la última unidad disponible.
7. Webhook de pago llega duplicado, tarde o fuera de orden.
8. Pago confirmado pero falla la creación posterior de una reserva.
9. Falta material y se genera alerta/propuesta de compra.
10. Producción registra rotura y reproceso sin perder trazabilidad ni margen real.
11. No se alcanza el mínimo logístico, pero vence la promesa de entrega.
12. Cliente cambia dirección fuera de cobertura después del pago.
13. Conductor registra intento fallido y luego entrega exitosa.
14. Liquidación del conductor se corrige mediante ajuste auditable.
15. Cliente reporta vidrio roto y se procesa reposición o reembolso.
16. Se despublica un diseño que ya pertenece a pedidos históricos.
17. Se revierte una configuración defectuosa sin alterar órdenes pagadas.
18. Se recupera el servicio y los datos desde un respaldo probado.

### 18. Mejoras 10X que debes evaluar, no imponer

Evalúa por impacto, evidencia, costo y fase:

- Presets “Bueno / Mejor / Premium” para reducir decisiones.
- Tamaños recomendados según proporción de la imagen.
- Simulador de margen y factibilidad antes de publicar una opción.
- Fecha de promesa como parte del cotizador, no como texto fijo.
- BOM y reserva automática derivados de la configuración.
- Tablero de excepciones en lugar de múltiples pantallas de supervisión.
- Agrupación de producción por material, acabado y medidas.
- Consolidación de rutas con compromiso máximo visible.
- Fotografía de QC y prueba de entrega.
- Etiqueta QR para trazabilidad interna.
- Panel de “pedidos en riesgo” con motivo y acción sugerida.
- Analítica de abandono por paso del configurador.
- PWA para conductor si reduce costo frente a una app nativa.
- Arquitectura de adaptadores que permita cambiar proveedor de pago, mapas o email.
- Uso responsable de IA futuro para recomendaciones o clasificación de imágenes, fuera del camino crítico del MVP y siempre con alternativa determinista.

### 19. Control de calidad de tu propia respuesta

Antes de finalizar, verifica:

- ¿Toda función tiene dueño, actor, regla, datos, error y criterio de aceptación?
- ¿El precio puede reproducirse meses después?
- ¿Una orden pagada conserva snapshots suficientes?
- ¿La promesa de entrega considera materiales, producción y logística?
- ¿Los mínimos de despacho nunca anulan unilateralmente el compromiso al cliente?
- ¿El pago tolera duplicados y fallos parciales?
- ¿El stock diferencia disponible, reservado, dañado y en tránsito?
- ¿La liquidación del conductor es auditable y separa cálculo de desembolso?
- ¿El panel de configuración evita cambios inválidos y permite rollback?
- ¿La arquitectura inicial puede operar con un equipo pequeño y bajo presupuesto?
- ¿Cada decisión tecnológica incluye alternativa, evidencia, costo y trigger de reevaluación?
- ¿La documentación evita duplicación y minimiza tokens para agentes?
- ¿Los requisitos legales y precios externos están fechados y citados?
- ¿Se distinguieron hechos, inferencias, supuestos y preguntas abiertas?

### 20. Forma de respuesta

1. Comienza con un resumen ejecutivo de máximo dos páginas.
2. Declara alcance, fuera de alcance, supuestos y las 10 decisiones de mayor impacto.
3. Presenta hallazgos con citas directas a fuentes primarias.
4. Entrega la especificación por archivos según la estructura solicitada.
5. Usa tablas para comparaciones exactas y Mermaid para procesos/arquitectura.
6. Evita texto genérico, patrones sin justificación y requisitos como “rápido”, “seguro” o “escalable” sin métrica.
7. No inventes entrevistas, cifras, restricciones productivas, tarifas ni requisitos legales.
8. Separa claramente **evidencia**, **inferencia**, **recomendación** y **supuesto**.
9. Cierra con:
   - preguntas bloqueantes priorizadas;
   - experimentos de validación de menor costo;
   - recomendación de MVP;
   - rango de costo y esfuerzo;
   - principales riesgos y mitigaciones;
   - siguiente decisión que debe tomar el dueño del negocio.

El resultado será considerado satisfactorio solo si un equipo distinto puede estimar, diseñar, implementar, probar, desplegar y operar el MVP sin tener que reinterpretar el modelo de negocio.

---

## Variables opcionales para completar antes de ejecutar

```yaml

    • pais_operacion: Chile
    • ciudad_inicial: Talca y Maule
    • radio_o_zonas_entrega: Sectores urbanos de Talca (Centro, Las Rastras, La Florida, Sector Norte) y zonas urbanas conectadas de Maule (excluye rural disperso).
    • ubicacion_retiro: Taller/Centro de operaciones centralizado en Talca urbano.
    • horarios_retiro: Martes y Viernes Despachos de 10:30 AM a 14:00 PM.
    • presupuesto_mvp_clp: $2.000.000 CLP (Estimación base para stock inicial y logística) considerar que el desarrollo está implicito compromiso 100%.
    • fecha_objetivo_piloto: 30 días a partir de la fecha de inicio del proyecto.
    • pedidos_mensuales_iniciales: 120 a 160 pedidos (Basado en 15 a 20 entregas por salida, 2 veces por semana).
    • ticket_promedio_objetivo_clp: $30.000 CLP
    • capacidad_productiva_diaria: 10 a 15 unidades terminadas por día de trabajo.
    • medidas_minimas_y_maximas: Mínimo: 10x15 cm / Máximo: 60x80 cm (Optimizado para cubicaje en furgón).
    • tipos_de_marco_iniciales: Madera pino natural, Negro plano, Blanco plano.
    • tipos_de_proteccion_iniciales: Vidrio simple 2mm (Formatos chicos) y Acrílico transparente (Formatos grandes).
    • proveedores_actuales: Por definir (Se sugiere distribuidor mayorista con envío a Talca tanto para mueblería como para vidriería).
    • vehiculos_y_capacidad: 1 camioneta chrevrolet luv o 1 Furgón urbano de carga útil (ej. Peugeot Partner, Chevrolet N400 o similar) con capacidad de hasta 20 bultos medianos por ruta de medio día.
    • regla_minima_de_consolidacion: Mínimo 10 pedidos listos para habilitar la ruta de despacho. Si hay menos, se unifica en una sola salida semanal.
    • marca_y_lineamientos_visuales: Logotipo básico, paleta tipográfica y colores corporativos (3 tonos máx. (consolida contraste positivo y paleta de degrades de estilo Warm Pastel Palette estilo cozy web algo similar a bienestar visual )) para ecommerce y etiquetas.
    • framework_frontend_preferido: Shopify o WooCommerce (WordPress)   prefiero mi propio marketplace personalizado para escalar puedo asociarme con mercado libre para dar a concerme en otros mercados ciudades.
    • proveedor_pago_preferido: Mercado Pago o Transbank Webpay Plus.

```

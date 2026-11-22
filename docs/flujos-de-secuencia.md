# Flujos de secuencia

Cada diagrama sigue un recorrido real del código. Los participantes son módulos de `src/` y `server/`; las reglas de negocio que aparecen se explican en [dominio.md](dominio.md).

1. [Arranque y rehidratación del estado](#1-arranque-y-rehidratación-del-estado)
2. [Del catálogo al estudio](#2-del-catálogo-al-estudio)
3. [Configurar un cuadro en el estudio](#3-configurar-un-cuadro-en-el-estudio)
4. [Agregar al carrito](#4-agregar-al-carrito)
5. [Subir una foto a Mi historia](#5-subir-una-foto-a-mi-historia)
6. [Proponer estilos con IA o con el estudio local](#6-proponer-estilos-con-ia-o-con-el-estudio-local)
7. [Usar un estilo propuesto](#7-usar-un-estilo-propuesto)
8. [Checkout y confirmación del pedido](#8-checkout-y-confirmación-del-pedido)
9. [Ciclos de vida](#9-ciclos-de-vida)

## 1. Arranque y rehidratación del estado

El punto de entrada (`src/main.tsx`) aún no existe; el diagrama muestra el montaje que esperan `Shell` y las páginas.

```mermaid
sequenceDiagram
    autonumber
    actor C as Cliente
    participant M as main.tsx (pendiente)
    participant SP as StoreProvider
    participant LS as localStorage
    participant R as Router
    participant SH as Shell
    participant P as Página de la ruta

    C->>M: Abre la app en el navegador
    M->>SP: Monta StoreProvider
    SP->>LS: getItem frameart.studio.v1
    alt Hay datos
        LS-->>SP: JSON
        SP->>SP: load() descarta lo inválido con isCartLine e isUpload
    else Vacío o JSON corrupto
        SP->>SP: Estado vacío
    end
    SP->>R: Renderiza RouterProvider
    R->>SH: Layout raíz
    SH->>SP: useStore() para cart y lastOrder
    SH->>P: Outlet según la URL
    P-->>C: Pantalla
    Note over SP,LS: Cada cambio de estado se reescribe completo en localStorage (useEffect)
```

## 2. Del catálogo al estudio

```mermaid
sequenceDiagram
    autonumber
    actor C as Cliente
    participant CP as CatalogPage
    participant CAT as data/catalog
    participant SZ as domain/sizing
    participant PR as domain/pricing
    participant DP as DesignPage
    participant ST as StudioPage

    C->>CP: Abre /catalogo
    CP->>CAT: DESIGNS
    C->>CP: Filtra por categoría o escribe una búsqueda
    loop Cada lámina que pasa el filtro
        CP->>SZ: recommendSize(widthPx, heightPx)
        SZ-->>CP: medida sugerida
        CP->>SZ: coerceProtection(medida, 0, vidrio)
        CP->>PR: quote(medida, sin margen, pino, protección, 1)
        PR-->>CP: QuoteSnapshot
    end
    CP-->>C: Tarjetas con medida sugerida y precio
    C->>DP: Elige una lámina (/catalogo/:id)
    DP->>CAT: getDesign(id)
    alt La lámina no existe
        DP-->>C: Esa lámina no está en el catálogo
    else Existe
        DP->>SZ: recommendSize y coerceProtection
        DP->>PR: quote(...)
        DP-->>C: Lámina enmarcada a escala y precio
        C->>ST: Configurar este cuadro
        Note right of ST: /disenar?origen=catalogo&pieza=id&an=w&al=h<br/>&marco=pino&proteccion=...&paspartu=0<br/>&preset=bueno&paso=medida
    end
```

## 3. Configurar un cuadro en el estudio

El estudio no guarda la configuración en React: cada cambio reescribe la URL y la página se vuelve a calcular entera desde ella.

```mermaid
sequenceDiagram
    autonumber
    actor C as Cliente
    participant ST as StudioPage
    participant URL as URL (searchParams)
    participant SZ as domain/sizing
    participant PR as domain/pricing
    participant PM as domain/promise
    participant UI as FramePreview y QuoteTicket

    C->>ST: Cambia medida, marco, passe-partout, protección o preset
    ST->>URL: setSearchParams(next, replace)
    URL-->>ST: Nuevo render con los parámetros
    ST->>ST: Interpreta parámetros con cm, asFrame, asMat, asPreset y asStep
    ST->>SZ: coerceProtection(an, al, paspartu, proteccion)
    ST->>SZ: sizeIssue(an, al, paspartu)
    alt Medida inválida
        SZ-->>ST: Mensaje de la regla que falla
        ST-->>C: Aviso, sin precio y botón bloqueado
    else Medida válida
        ST->>PR: quote(an, al, paspartu, marco, protección, cantidad)
        PR-->>ST: QuoteSnapshot
    end
    opt Origen historia
        ST->>SZ: qualityOf(foto, an, al)
        SZ-->>ST: dpi y nivel
    end
    ST->>PM: planDelivery(hoy, productionDays(an, al, isStandard))
    PM-->>ST: Salida, ventana y cupo
    ST->>UI: Marco a escala y desglose
    UI-->>C: Precio total y fecha de salida
    opt La protección de la URL no es válida para el formato
        ST->>URL: useEffect corrige proteccion a acrilico (replace)
    end
```

Pasos del inspector. El stepper permite abrir cualquier paso; "Seguir" avanza en orden.

```mermaid
stateDiagram-v2
    direction LR
    [*] --> medida: paso por defecto
    pieza --> medida: elegir lámina o Seguir
    medida --> marco: Seguir
    marco --> resumen: Seguir
    resumen --> [*]: Agregar al carrito
```

## 4. Agregar al carrito

```mermaid
sequenceDiagram
    autonumber
    actor C as Cliente
    participant ST as StudioPage
    participant S as Store
    participant PR as domain/pricing
    participant LS as localStorage
    participant CA as CartPage

    C->>ST: Agregar al carrito (paso Precio)
    alt Sin precio, o calidad baja sin confirmar
        ST-->>C: Botón deshabilitado
    else Configuración válida
        ST->>S: addLine(CartLine con su QuoteSnapshot)
        S->>S: Firma de la línea: origen, pieza, medida, margen, marco, protección y tarifa
        alt Ya hay una línea con la misma firma
            S->>PR: quote(..., cantidad sumada con tope 6)
            PR-->>S: Snapshot nuevo
            S->>S: Reemplaza la línea existente
        else Línea nueva
            S->>S: La agrega al final
        end
        S->>LS: setItem frameart.studio.v1
        ST->>CA: navigate a /carrito
        CA->>S: cart
        CA-->>C: Líneas con precio congelado y total de cuadros
    end
    opt Cambia la cantidad en el carrito
        C->>CA: Nueva cantidad (1 a 6)
        CA->>S: updateQuantity(id, n)
        S->>PR: quote(..., n) con la tarifa vigente
        PR-->>S: Snapshot nuevo
        S->>LS: Persiste
    end
```

## 5. Subir una foto a Mi historia

```mermaid
sequenceDiagram
    autonumber
    actor C as Cliente
    participant SP as StoryPage
    participant IM as story/images
    participant CV as Canvas del navegador
    participant S as Store
    participant LS as localStorage

    C->>SP: Suelta o elige archivos
    loop Cada archivo
        SP->>IM: readUserImage(file)
        alt No es imagen o pesa más de 12 MB
            IM-->>SP: error
            SP-->>C: Aviso y sigue con el siguiente archivo
        else Imagen válida
            IM->>CV: createImageBitmap y drawImage, lado largo máximo 1400 px
            CV-->>IM: toDataURL JPEG calidad 0.82
            IM-->>SP: UserImage con preview y píxeles originales
            SP->>S: addUpload(image)
            alt Ya hay 12 fotos
                S-->>SP: Puedes guardar hasta 12 fotos en este navegador
                SP-->>C: Aviso y deja de procesar archivos
            else Hay espacio
                S->>LS: Persiste (si la cuota se llena, falla en silencio)
                SP->>SP: Selecciona la foto y borra propuestas anteriores
            end
        end
    end
```

## 6. Proponer estilos con IA o con el estudio local

```mermaid
sequenceDiagram
    autonumber
    actor C as Cliente
    participant SP as StoryPage
    participant SC as story/styleClient
    participant MW as Middleware de Vite
    participant AD as server/estilos
    participant DS as domain/styles
    participant AI as Proveedor de IA

    Note over SP,MW: Al montar la página
    SP->>SC: fetchProviderStatus()
    SC->>MW: GET /api/estilos
    MW->>AD: providerStatus(env)
    AD-->>MW: gemini, claude y grok como booleanos
    MW-->>SC: 200 JSON
    SC-->>SP: Cada modelo se marca conectado o estudio local

    C->>SP: Elige foto o lámina, elige modelo y pulsa Proponer estilos
    SP->>SC: requestStyles(provider, title, brief, píxeles, imageDataUrl)
    SC->>MW: POST /api/estilos
    MW->>MW: readJson, máximo 2,5 MB
    MW->>AD: advise(body, env)
    AD->>AD: Sanea título, notas y píxeles
    AD->>DS: localProposals(contexto)
    DS-->>AD: 3 propuestas de respaldo
    alt Sin clave del proveedor
        AD-->>MW: source estudio y propuestas locales
    else Con clave
        AD->>AD: buildPrompt y parseDataUrl de la imagen
        AD->>AI: POST con prompt e imagen, timeout 20 s
        alt Respuesta útil
            AI-->>AD: Texto con JSON
            AD->>AD: parseJson, tolera bloques de código
            loop Cada propuesta cruda
                AD->>DS: normalizeProposal(raw)
                DS-->>AD: Propuesta fabricable o null
            end
            AD-->>MW: source del proveedor y hasta 3 propuestas
        else Error HTTP, timeout, JSON ilegible o ninguna válida
            AD-->>MW: source estudio, propuestas locales y aviso
        end
    end
    MW-->>SC: 200 StyleAdvice
    SC-->>SP: StyleAdvice
    loop Cada propuesta
        SP->>SP: ProposalCard calcula quote() y dibuja FramePreview
    end
    SP-->>C: Aviso y tarjetas con precio y botón Usar este estilo
    Note over SC,SP: Si el fetch falla (sin servidor de Vite), muestra No pudimos pedir estilos
```

## 7. Usar un estilo propuesto

```mermaid
sequenceDiagram
    autonumber
    actor C as Cliente
    participant PC as ProposalCard
    participant ST as StudioPage
    participant S as Store

    C->>PC: Usar este estilo
    PC->>ST: /disenar con origen, pieza, an, al, marco, proteccion, paspartu, preset y paso=resumen
    opt Origen historia
        ST->>S: Busca la foto en uploads
    end
    alt La foto ya no está en este navegador
        ST-->>C: Falta la foto, con enlace a Mi historia
    else Pieza disponible
        ST-->>C: Paso Precio con la configuración propuesta (sigue en el flujo 3)
    end
```

## 8. Checkout y confirmación del pedido

```mermaid
sequenceDiagram
    autonumber
    actor C as Cliente
    participant CA as CartPage
    participant CO as CheckoutPage
    participant PM as domain/promise
    participant PR as domain/pricing
    participant S as Store
    participant LS as localStorage
    participant OP as OrderPage

    C->>CA: Elegir entrega
    CA->>CO: navigate a /pago
    CO->>S: cart
    alt Carrito vacío
        CO-->>C: No hay cuadros para entregar
    else Hay líneas
        CO->>PM: productionDays de cada línea, se toma el máximo
        CO->>PM: planDelivery(hoy, días)
        PM-->>CO: Salida, ventana y cupo
        CO->>CO: Suma merchandiseTotal de las líneas, sin recotizar
        C->>CO: Modalidad, zona, dirección, contacto, medio de pago y aceptación
        CO->>PR: zoneById(zona)
        PR-->>CO: Costo de despacho o sin cobertura
        CO-->>C: Resumen y total actualizados
        C->>CO: Confirmar pedido de muestra
        CO->>CO: Valida los campos
        alt Hay errores
            CO-->>C: Mensaje junto a cada campo
        else Todo válido
            CO->>CO: id = FA- y 4 dígitos aleatorios
            CO->>S: placeOrder(DemoOrder con status pago-simulado)
            S->>S: lastOrder = pedido y carrito vacío
            S->>LS: Persiste
            CO->>OP: navigate a /pedido/id
            OP->>S: lastOrder
            alt El id coincide con lastOrder
                OP-->>C: Pedido registrado como muestra y línea de tiempo
            else Otro id
                OP-->>C: No encontramos ese pedido en este navegador
            end
        end
    end
```

En el piloto real el pago no se confirmaría desde esta pantalla: el backend crearía la transacción y un webhook firmado de Mercado Pago o Webpay confirmaría el pago (requisito §10 del [master prompt](../master-prompt-investigacion-requerimientos-tienda-cuadros.md)).

## 9. Ciclos de vida

Línea del carrito:

```mermaid
stateDiagram-v2
    direction LR
    [*] --> Configurada: StudioPage
    Configurada --> EnCarrito: addLine
    EnCarrito --> EnCarrito: updateQuantity recotiza
    EnCarrito --> [*]: removeLine
    EnCarrito --> EnPedido: placeOrder
    EnPedido --> [*]: el siguiente pedido reemplaza a lastOrder
```

Pedido. `OrderPage` muestra cuatro etapas, pero solo la primera existe en el código; el resto es la línea de tiempo prevista.

```mermaid
stateDiagram-v2
    direction LR
    [*] --> PagoSimulado: placeOrder
    PagoSimulado --> ValidacionTaller: no implementado
    ValidacionTaller --> ProduccionYControl: no implementado
    ProduccionYControl --> SalidaORetiro: no implementado
    SalidaORetiro --> [*]
```

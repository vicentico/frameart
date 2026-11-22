# Reglas de negocio

Todas viven en [src/domain/](../src/domain/), no dependen de React y las usan tanto la interfaz como el servidor. Las pruebas están en [domain.test.ts](../src/domain/domain.test.ts).

## 1. Medidas fabricables

Fuente: [sizing.ts](../src/domain/sizing.ts).

La medida que elige el cliente es la de la **imagen**. La **medida exterior** suma el passe-partout por ambos lados:

```text
exterior = imagen + 2 × passe-partout
```

| Regla | Límite | Mensaje al cliente |
|---|---|---|
| Centímetros enteros | — | "Usa centímetros enteros." |
| Lado mínimo de la imagen | 10 cm | "Ningún lado de la imagen puede medir menos de 10 cm." |
| Lado largo mínimo de la imagen | 15 cm | "El lado largo de la imagen debe medir al menos 15 cm." |
| Tamaño exterior máximo (furgón) | lado corto ≤ 60 cm y lado largo ≤ 80 cm | "Con este passe-partout el cuadro supera 60×80 cm, el máximo del furgón." |
| Passe-partout | 0, 3 o 5 cm | (lo impone el tipo `MatCm`) |
| Vidrio | solo si el lado largo exterior mide ≤ 40 cm; si no, acrílico | "Este formato no usa vidrio. El acrílico viaja mejor." |

`sizeIssue()` devuelve el primer mensaje que aplica o `null`. `coerceProtection()` convierte un pedido de vidrio en acrílico cuando el formato no lo admite; la interfaz lo usa para corregir la URL y deshabilitar la opción.

Medidas estándar: 15×20, 20×30, 30×40, 40×50 y 50×70, en ambas orientaciones.

### Medida recomendada

`recommendSize(widthPx, heightPx)` parte de la proporción de la imagen:

1. La compara con cada medida estándar, en ambas orientaciones.
2. Si la diferencia más chica es de 0,08 o menos, devuelve esa medida estándar. En empate gana la más grande (por eso una foto 3:4 recibe 30×40 y no 15×20).
3. Si ninguna calza, ajusta el lado largo a 40 cm conservando la proporción y dentro de los límites de fabricación, con `standard: false`.

Ejemplos: 3000×4000 px → 30×40; 4000×3000 px → 40×30.

### Calidad de impresión

`qualityOf(imagen, anchoCm, altoCm)` estima la resolución en el lado más exigido, considerando la orientación:

```text
dpi = píxeles / (cm / 2,54)
```

| dpi | Nivel | Efecto en el estudio |
|---|---|---|
| 150 o más | `optima` | "Se ve bien a este tamaño." |
| 100 a 149 | `aceptable` | Aviso: de cerca se notará suave. |
| menos de 100 | `baja` | Bloquea "Agregar al carrito" hasta que el cliente marque "Imprimir igual". La línea queda con `qualityOverride: true`. |

Solo aplica a fotos de Mi historia; las láminas son vectoriales. Usa las dimensiones originales de la foto, no las de la copia reducida que se guarda en el navegador.

## 2. Tarifa `2026.11.pilot`

Fuente: [pricing.ts](../src/domain/pricing.ts). Es la única autoridad de precio del prototipo.

### Costo por cuadro

| Componente | Fórmula | Valores |
|---|---|---|
| Impresión | área de la imagen × $5 por cm² | — |
| Marco | perímetro exterior × precio por cm | pino $48, negro $54, blanco $54 |
| Protección | área exterior × precio por cm² | vidrio 2 mm $4, acrílico $5,5 |
| Passe-partout | monto fijo | 0 cm: $0, 3 cm: $1.800, 5 cm: $2.800 |
| Taller, herraje y embalaje | monto fijo | $3.200 |

Cada componente se multiplica por la cantidad de la línea (1 a 6).

### Precio de venta

1. `merchandiseTotal = roundClp(suma de costos × 1,42)`. IVA incluido.
2. Cada línea del desglose = `roundClp(costo × 1,42)`.
3. Si la suma de las líneas no da el total, se agrega la línea "Redondeo a $100" por la diferencia. Así el desglose siempre cierra.
4. El despacho se suma después, en el checkout, sin margen.

`roundClp` redondea al múltiplo de $100 más cercano.

### Ejemplo: 30×40, pino, vidrio, sin passe-partout

| Línea | Costo | × 1,42 | Redondeado |
|---|---:|---:|---:|
| Impresión · 30×40 cm | 6.000 | 8.520 | 8.500 |
| Marco pino natural · 140 cm | 6.720 | 9.542,4 | 9.500 |
| Vidrio 2 mm · 30×40 cm | 4.800 | 6.816 | 6.800 |
| Taller, herraje y embalaje | 3.200 | 4.544 | 4.500 |
| Suma de líneas | 20.720 | | 29.300 |
| Redondeo a $100 | | | 100 |
| **Total** | | 29.422,4 | **29.400** |

### Presets

| Preset | Passe-partout | Protección pedida | Nota |
|---|---|---|---|
| Bueno | 0 cm | vidrio | Pasa a acrílico si el lado largo supera 40 cm. |
| Mejor | 3 cm | vidrio | En un 30×40 el exterior es 36×46, así que queda en acrílico. |
| Premium | 5 cm | acrílico | — |
| A medida | el elegido | el elegido | Se activa al cambiar a mano la medida, la protección o el passe-partout. Cambiar el marco no lo activa. |

## 3. Zonas de despacho

Fuente: `ZONES` en [pricing.ts](../src/domain/pricing.ts).

| Zona | Grupo | Despacho |
|---|---|---:|
| Talca Centro | Talca | $3.500 |
| Las Rastras | Talca | $3.500 |
| La Florida | Talca | $3.500 |
| Sector Norte | Talca | $3.500 |
| Maule urbano | Maule | $4.900 |
| Otra comuna | Sin cobertura | no se despacha; el checkout la rechaza |

El retiro en el taller ("Taller central, Talca urbano") no tiene costo.

## 4. Promesa de entrega

Fuente: [promise.ts](../src/domain/promise.ts).

1. **Días de producción:** 2 si la medida es estándar y el área es de 2.000 cm² o menos; 3 en cualquier otro caso. En el checkout se usa el máximo entre todas las líneas.
2. **Listo:** hoy a las 00:00 + días de producción.
3. **Salidas candidatas:** martes y viernes desde la fecha "listo" hasta hoy + 7 días.
4. **Salida elegida:** la primera candidata con cupo (`reserved < capacity`). Si ninguna tiene cupo, la última, marcada como lista de espera.
5. **Ventana y capacidad:** 10:30–14:00, 20 cuadros por salida.

`routeLoad(día)` simula la carga ya reservada: `reserved = 8 + (AAAAMMDD mod 9)`. Es determinista para que la fecha no cambie al recargar. Como el máximo es 16 y la capacidad 20, hoy siempre hay cupo.

Ejemplo: el domingo 22-11-2026, un 30×40 (2 días de producción) queda listo el martes 24, que es día de salida. Promesa: "Martes, 24 de noviembre, 10:30–14:00".

## 5. Propuestas de estilo

Fuente: [styles.ts](../src/domain/styles.ts).

### Estudio local

`localProposals()` arma siempre tres propuestas a partir de la medida recomendada:

| id | Nombre | Marco | Passe-partout | Preset | Medida |
|---|---|---|---|---|---|
| `claro` | Claro y simple | pino | 0 cm | bueno | la recomendada |
| `casa` | Casa luminosa | blanco | 3 cm | mejor | la recomendada |
| `galeria` | Galería | negro | 5 cm | premium | el estándar siguiente más grande, si cabe con 5 cm de margen |

En las tres se pide vidrio y se corrige a acrílico cuando el formato lo exige. Si la medida no cabe con el passe-partout, este baja de 5 a 3 y luego a 0.

### Saneamiento de propuestas de IA

`normalizeProposal()` convierte lo que devuelva un modelo en una propuesta fabricable, o la descarta:

1. Si no es un objeto, se descarta.
2. Medidas: deben ser enteras; si faltan, se usa la medida recomendada.
3. Passe-partout: 0, 3 o 5, o 0 si viene otro valor. Baja de 5 a 3 y a 0 hasta que la medida quepa. Si aun así no cabe, se usa la medida recomendada sin passe-partout.
4. Marco: `pino`, `negro` o `blanco`; cualquier otro valor pasa a `pino`.
5. Protección: `vidrio` o `acrilico`, por defecto `acrilico`. Un vidrio ilegal pasa a acrílico.
6. Preset: `bueno`, `mejor` o `premium`; cualquier otro valor pasa a `mejor`.
7. Paleta: solo colores `#RRGGBB`, máximo 4. Si no queda ninguno, se usa la paleta por defecto.
8. Textos recortados: nombre a 48 caracteres, ánimo a 32 y fundamento a 280.

El servidor se queda con las tres primeras propuestas válidas.

## 6. Fotos y carrito

| Regla | Valor | Fuente |
|---|---|---|
| Formatos aceptados al subir | JPG, PNG, WebP | [images.ts](../src/features/story/images.ts) |
| Peso máximo por foto | 12 MB | [images.ts](../src/features/story/images.ts) |
| Copia guardada | lado largo de 1.400 px como máximo, JPEG calidad 0,82 | [images.ts](../src/features/story/images.ts) |
| Fotos guardadas por navegador | 12 | [store.tsx](../src/state/store.tsx) |
| Cantidad por línea | 1 a 6 | [pricing.ts](../src/domain/pricing.ts), [store.tsx](../src/state/store.tsx) |
| Fusión de líneas | misma pieza, medida, passe-partout, marco, protección y tarifa | [store.tsx](../src/state/store.tsx) |

## 7. Checkout

Fuente: [CheckoutPage.tsx](../src/features/checkout/CheckoutPage.tsx).

| Campo | Regla |
|---|---|
| Nombre | al menos 2 caracteres |
| Correo | formato `usuario@dominio.ext` |
| Teléfono | al menos 8 dígitos |
| Zona | obligatoria con despacho; "Otra comuna" se rechaza |
| Dirección | al menos 6 caracteres con despacho |
| Aceptación | obligatoria: "Entiendo que este pedido es una demostración y no se cobra." |

```text
total = suma de merchandiseTotal de las líneas + despacho de la zona (0 si es retiro)
```

Los medios de pago (Mercado Pago, Webpay Plus) solo se registran en el pedido. No hay integración.

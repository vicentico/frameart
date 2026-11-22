# Frameart — documentación técnica

Frameart es el prototipo piloto de una tienda en línea de cuadros personalizados para Talca y Maule. El cliente elige una lámina del catálogo o sube una foto propia, la configura (medida, marco, passe-partout y protección), ve el precio desglosado y la fecha de entrega, y cierra un pedido de muestra. El pago es simulado: esta versión no cobra dinero real.

Esta carpeta explica cómo está construido el prototipo y cómo circulan los datos entre sus piezas.

| Documento | Para qué sirve |
|---|---|
| [arquitectura.md](arquitectura.md) | Contexto, contenedores, capas, rutas, estado, modelo de datos, API interna y brechas conocidas. |
| [dominio.md](dominio.md) | Reglas de negocio: medidas fabricables, tarifa, promesa de entrega, propuestas de estilo, validaciones. |
| [flujos-de-secuencia.md](flujos-de-secuencia.md) | Diagramas de secuencia de los recorridos principales, de la portada al pedido. |

Los diagramas usan [Mermaid](https://mermaid.js.org/). GitHub los dibuja directamente; en VS Code hace falta una extensión de vista previa de Mermaid.

## Stack

| Pieza | Tecnología |
|---|---|
| Interfaz | React 19, React Router 7 (`createBrowserRouter`) |
| Lenguaje | TypeScript 5.9 en modo estricto, alias `@/` → `src/` |
| Build y servidor de desarrollo | Vite 7, con un plugin propio que expone `/api/estilos` |
| Pruebas | Vitest 3, entorno `node` |
| Persistencia | `localStorage` del navegador (clave `frameart.studio.v1`) |
| Proveedores de IA (opcionales) | Gemini, Claude (Anthropic) y Grok (xAI), llamados solo desde el servidor |

No hay base de datos, backend propio ni pasarela de pago real.

## Puesta en marcha

```bash
npm install
cp .env.example .env      # opcional: claves de Gemini, Anthropic o xAI
npm run dev               # http://localhost:5173
npm test                  # Vitest: dominio y adaptador de estilos
npm run build             # tsc --noEmit + vite build
```

Sin claves, la app funciona completa: el "estudio local" arma las propuestas de estilo y la foto no sale del navegador.

> **Antes del primer `npm run dev`.** El proyecto todavía no incluye `index.html`, el punto de entrada `src/main.tsx` ni la hoja de estilos que usan las clases CSS de los componentes. Vite no puede servir la app hasta que existan. El punto de entrada debe envolver el router en el proveedor de estado, porque `Shell` y las páginas llaman a `useStore()`:
>
> ```tsx
> // src/main.tsx (esperado, aún no existe)
> import { StrictMode } from "react";
> import { createRoot } from "react-dom/client";
> import { RouterProvider } from "react-router-dom";
> import { router } from "@/app/router";
> import { StoreProvider } from "@/state/store";
>
> createRoot(document.getElementById("root")!).render(
>   <StrictMode>
>     <StoreProvider>
>       <RouterProvider router={router} />
>     </StoreProvider>
>   </StrictMode>,
> );
> ```

## Estructura del código

```text
frameart/
├── .env.example             Claves de IA (solo servidor, nunca con prefijo VITE_)
├── vite.config.ts           Monta /api/estilos como middleware del servidor de Vite
├── vitest.config.ts         Pruebas en src/**/*.test.ts y server/**/*.test.ts
├── server/
│   └── estilos.ts           Adaptador de IA: arma el prompt, llama al proveedor, sanea la respuesta
└── src/
    ├── app/router.tsx       Tabla de rutas
    ├── domain/              Reglas de negocio puras (sin React): precio, medidas, promesa, estilos
    ├── data/catalog.ts      Catálogo de láminas (estático)
    ├── state/store.tsx      Carrito, fotos y último pedido, persistidos en localStorage
    ├── features/            Una carpeta por pantalla: home, catalog, studio, story, cart, checkout, order, art
    └── ui/                  Componentes compartidos: Shell, FramePreview, QuoteTicket, NotFoundPage
```

`master-prompt-investigacion-requerimientos-tienda-cuadros.md`, en la raíz, describe el sistema completo hacia el que apunta este piloto (ver [arquitectura.md §10](arquitectura.md#10-relación-con-la-arquitectura-objetivo)).

## Glosario

| Término | Significado |
|---|---|
| Lámina | Diseño del catálogo propio, dibujado como SVG en `PrintArt`. |
| Mi historia | Sección donde el cliente sube fotos propias. |
| Passe-partout (`matCm`) | Margen de cartón entre la imagen y el marco: 0, 3 o 5 cm por lado. |
| Medida exterior | Imagen + 2 × passe-partout. Es la que limita el furgón y el uso de vidrio. |
| Preset | Atajo de configuración: `bueno`, `mejor`, `premium`. Pasa a `a-medida` cuando el cliente se aparta de él. |
| Tarifa (`ruleset`) | Versión de las reglas de precio, hoy `2026.11.pilot`. Queda grabada en cada cotización. |
| Cotización (`QuoteSnapshot`) | Precio desglosado y congelado de una línea del carrito. |
| Salida | Día de reparto: martes o viernes, de 10:30 a 14:00. |
| Promesa | Fecha de salida que se muestra al cliente antes de comprar. |
| Estudio local | Generador de propuestas de estilo sin IA, en `src/domain/styles.ts`. |

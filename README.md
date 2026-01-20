# @fesmex/models

Paquete con modelos de Mongoose compartidos.

## Estructura
```
src/
  index.ts            # reexporta dominios
  clients/
    index.ts          # reexporta modelos de clientes
    models/ClientsContact.ts
```

## Build
```
npm install
npm run build
```
Genera `dist/` con JS + d.ts.

## Uso en otros servicios
1) Instala `mongoose` en el servicio consumidor (peer dependency):
```
npm install mongoose @fesmex/models
```
2) Importa el modelo:
```ts
import { ClientContact } from "@fesmex/models/clients"
```
3) Conéctate a la misma `DB_URI` con mongoose antes de usar los modelos.

## Publicar (npm privado)
```
npm publish --access restricted
```
Configura `.npmrc` en el consumidor con tu token/registry.

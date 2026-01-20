# Contribuir a @fesmex/models

Guía para agregar nuevos modelos al paquete compartido.

## Agregar un nuevo modelo

### 1. Copiar el modelo desde fesmex-be2

Copia el archivo del modelo desde `fesmex-be2/src/modules/<dominio>/models/<Modelo>.ts` a `fesmex-models/src/<dominio>/models/<Modelo>.ts`.

Ejemplo:
```bash
cp fesmex-be2/src/modules/clients/models/ClientsAddress.ts \
   fesmex-models/src/clients/models/ClientsAddress.ts
```

### 2. Exportar el modelo

Actualiza `src/<dominio>/index.ts` para exportar el nuevo modelo:

```typescript
export { default as ClientAddress } from "./models/ClientsAddress"
export type { ClientAddressType } from "./models/ClientsAddress"
```

### 3. Compilar y publicar

```bash
# Incrementar versión (patch, minor, o major)
npm version patch

# Compilar TypeScript
npm run build

# Publicar a npm (requiere NPM_TOKEN exportado)
export NPM_REGISTRY=https://registry.npmjs.org
export NPM_TOKEN=<tu_token_automation>
npm publish --access public
```

### 4. Actualizar en servicios consumidores

En fesmex-be2 u otros servicios:

```bash
# Actualizar a la nueva versión
npm install @fesmex/models@latest --legacy-peer-deps

# O especificar versión exacta
npm install @fesmex/models@0.1.x --legacy-peer-deps
```

Actualizar imports:
```typescript
// Antes
import ClientAddress from "../modules/clients/models/ClientsAddress"

// Después
import { ClientAddress } from "@fesmex/models"
```

## Agregar un nuevo dominio

Si necesitas agregar modelos de un dominio nuevo (ej. `quotes`, `inventory`):

1. Crea la estructura:
```bash
mkdir -p src/quotes/models
```

2. Copia los modelos del dominio

3. Crea `src/quotes/index.ts`:
```typescript
export { default as Quote } from "./models/Quote"
export type { QuoteType } from "./models/Quote"
// ... más exports
```

4. Actualiza `src/index.ts`:
```typescript
export * from "./clients"
export * from "./quotes"  // nuevo dominio
```

5. Compila, incrementa versión y publica

## Notas importantes

- **Peer dependency**: El paquete requiere `mongoose ^7 || ^8`. Asegúrate de que los servicios consumidores tengan mongoose instalado.
- **No incluir secretos**: Nunca incluyas credenciales, tokens o URIs de DB en los modelos.
- **Consistencia**: Mantén los nombres de colección y esquemas idénticos a fesmex-be2.
- **Versionado semántico**:
  - `patch` (0.1.x): agregar modelos, fix bugs
  - `minor` (0.x.0): cambios compatibles en schemas
  - `major` (x.0.0): breaking changes en schemas

## Workflow completo ejemplo

```bash
# 1. Agregar modelo ClientAddress
cp fesmex-be2/src/modules/clients/models/ClientsAddress.ts \
   fesmex-models/src/clients/models/

# 2. Exportar en src/clients/index.ts
echo 'export { default as ClientAddress } from "./models/ClientsAddress"' >> src/clients/index.ts
echo 'export type { ClientAddressType } from "./models/ClientsAddress"' >> src/clients/index.ts

# 3. Publicar
npm version patch
npm run build
export NPM_TOKEN=<token>
npm publish --access public

# 4. Actualizar fesmex-be2
cd ../fesmex-be2
npm install @fesmex/models@latest --legacy-peer-deps

# 5. Actualizar imports en fesmex-be2
# Cambiar todos los imports de ClientAddress a usar @fesmex/models
```

## Railway deployment

Para usar el paquete en Railway:

1. Define variables de entorno en Railway (solo si es privado):
   - `NPM_TOKEN`: token de lectura
   - `NPM_REGISTRY`: `https://registry.npmjs.org`

2. Asegúrate de tener `.npmrc` en el proyecto (si es privado):
```
@fesmex:registry=${NPM_REGISTRY}
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
always-auth=true
```

3. Railway ejecutará `npm install` y descargará el paquete automáticamente.

**Nota**: Como el paquete es público, no necesitas `NPM_TOKEN` para instalarlo, solo para publicarlo.

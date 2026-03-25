---
description: Habilidades, recetas y patrones paso a paso para tareas comunes en fesmex-models. Consultar antes de implementar cualquier cambio para seguir las convenciones del proyecto.
---

# FESMEX Models – Skills & Recipes

## Skill 1: Agregar un nuevo modelo a un dominio existente

### Paso 1 — Crear el archivo del modelo

Crear `src/<dominio>/models/<NombreModelo>.ts`:

```typescript
import mongoose, { Schema, model, Types } from "mongoose"

export interface NombreModeloType {
	parent_id: Types.ObjectId   // FK a la entidad padre
	field_a: string
	field_b?: number
	is_active: boolean
	created_at?: Date
	updated_at?: Date
}

const nombreModeloSchema = new Schema<NombreModeloType>(
	{
		parent_id: {
			type: Schema.Types.ObjectId,
			ref: "ParentModel",
			required: true,
			index: true,
		},
		field_a: { type: String, required: true },
		field_b: { type: Number },
		is_active: { type: Boolean, default: true },
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
)

// Agregar indexes según necesidad
nombreModeloSchema.index(
	{ parent_id: 1, field_a: 1 },
	{ name: "nombre_modelos_parent_field_a" }
)

export default mongoose.models.NombreModelo ||
	model<NombreModeloType>("NombreModelo", nombreModeloSchema, "nombre_modelos")
```

### Paso 2 — Exportar en el barrel del dominio

Editar `src/<dominio>/index.ts`:

```typescript
// Agregar al final:
export { default as NombreModelo } from "./models/NombreModelo"
export type { NombreModeloType } from "./models/NombreModelo"
```

### Paso 3 — Verificar que `src/index.ts` ya reexporta el dominio

```typescript
// src/index.ts ya debe tener:
export * from "./<dominio>"
```

### Paso 4 — Build y publish

```bash
pnpm run build:check   # Verificar types
pnpm run build         # Compilar
npm version patch      # Bump version
npm publish --access public
```

### Paso 5 — Actualizar consumidores

```bash
# En fesmex-be2 o fesmex-store-be:
pnpm install @fesmex/models@latest
```

---

## Skill 2: Agregar un nuevo dominio completo

### Paso 1 — Crear estructura

```bash
mkdir -p src/<nuevo-dominio>/models
```

### Paso 2 — Crear modelo(s) siguiendo Skill 1

### Paso 3 — Crear barrel del dominio

Crear `src/<nuevo-dominio>/index.ts`:

```typescript
export { default as ModeloA } from "./models/ModeloA"
export type { ModeloAType } from "./models/ModeloA"

export { default as ModeloB, SomeEnum } from "./models/ModeloB"
export type { ModeloBType } from "./models/ModeloB"
```

### Paso 4 — Agregar al barrel principal

Editar `src/index.ts`:

```typescript
// Agregar nueva línea:
export * from "./<nuevo-dominio>"
```

### Paso 5 — Build, publish, actualizar consumidores (ver Skill 1, pasos 4-5)

---

## Skill 3: Agregar un enum a un modelo

### Template de enum

```typescript
export enum NombreEnum {
	VALUE_A = "value_a",
	VALUE_B = "value_b",
	VALUE_C = "value_c",
}
```

### Usar en schema

```typescript
const schema = new Schema({
	status: {
		type: String,
		enum: Object.values(NombreEnum),
		default: NombreEnum.VALUE_A,
		required: true,
	},
})
```

### Exportar en barrel

```typescript
// En src/<dominio>/index.ts:
export { default as Modelo, NombreEnum } from "./models/Modelo"
```

### Convención de valores

- **Enums de status/type internos**: UPPER_CASE values (ej. `OPPORTUNITY`, `PENDING`, `SAP_QUOTATION`)
- **Enums de roles/status de usuario**: lowercase values (ej. `admin`, `active`, `stripe`)

---

## Skill 4: Agregar un sub-schema embedded

Para datos que **no** necesitan su propia colección (ej. address dentro de order, items dentro de cart).

```typescript
// Sub-schema sin _id
const subItemSchema = new Schema(
	{
		field_a: { type: String, required: true },
		field_b: { type: Number, min: 0 },
		ref_id: { type: Schema.Types.ObjectId, ref: "OtherModel" },
	},
	{ _id: false }  // IMPORTANTE: No generar _id para sub-docs embedded
)

// Usar en schema principal
const mainSchema = new Schema({
	items: { type: [subItemSchema], default: [] },
	address: { type: subItemSchema, required: false },
})
```

### Cuándo usar embedded vs colección separada

- **Embedded** (`_id: false`): Datos que siempre se leen/escriben junto con el padre, sin queries independientes
  - Ejemplos: `Order.items[]`, `Order.shipping_address`, `Article.files.images[]`
- **Colección separada**: Datos que se consultan independientemente, tienen relaciones propias, o crecen mucho
  - Ejemplos: `ClientContact`, `QuoteArticle`, `ArticlePrice`

---

## Skill 5: Agregar indexes

### Index simple

```typescript
const schema = new Schema({
	email: { type: String, index: true },
	// O con unique:
	username: { type: String, unique: true },
})
```

### Index compuesto

```typescript
schema.index(
	{ field_a: 1, field_b: -1 },
	{ name: "collection_field_a_field_b" }
)
```

### Index unique compuesto

```typescript
schema.index(
	{ parent_id: 1, child_field: 1 },
	{ name: "collection_parent_child_unique", unique: true }
)
```

### Text search index

```typescript
schema.index(
	{ name: "text", description: "text" },
	{ name: "collection_text_search" }
)
```

### TTL index (auto-delete)

```typescript
schema.index(
	{ expires_at: 1 },
	{ expireAfterSeconds: 0 }  // Elimina docs cuando expires_at <= now
)
```

### Sparse index (permite nulls únicos)

```typescript
schema.index(
	{ code: 1 },
	{ unique: true, sparse: true, name: "collection_code_unique_sparse" }
)
```

### Naming convention

Formato: `{collection}_{fields}_{qualifier}`

Ejemplos:
- `articles_text_search`
- `article_prices_article_pricelist`
- `inventory_stocks_article_warehouse_unique`
- `carts_customer_unique`
- `orders_customer_created`

---

## Skill 6: Modelo con soft delete

### Template

```typescript
import mongoose, { Schema, model, Types } from "mongoose"

export interface ModeloType {
	name: string
	// ... otros campos
	created_at?: Date
	updated_at?: Date
	deleted_at?: Date
	deleted_by?: Types.ObjectId
}

const modeloSchema = new Schema<ModeloType>(
	{
		name: { type: String, required: true },
		// ... otros campos
		deleted_at: { type: Date, default: null },
		deleted_by: { type: Schema.Types.ObjectId, ref: "User", default: null },
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
)

// Index para filtrar no-eliminados eficientemente
modeloSchema.index(
	{ deleted_at: 1, updated_at: -1 },
	{ name: "modelos_not_deleted_sort" }
)

export default mongoose.models.Modelo ||
	model<ModeloType>("Modelo", modeloSchema, "modelos")
```

### En queries (consumidor)

```typescript
// Filtrar no-eliminados:
Model.find({ deleted_at: null })

// Soft delete:
Model.updateOne({ _id: id }, { deleted_at: new Date(), deleted_by: userId })
```

---

## Skill 7: Modelo con password hashing

### Template

```typescript
import mongoose, { Schema, model } from "mongoose"
import bcrypt from "bcryptjs"

export interface ModeloType {
	email: string
	password: string
	// ... otros campos
}

const modeloSchema = new Schema<ModeloType>({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true, select: false },  // IMPORTANTE: select: false
	// ... otros campos
})

// Pre-save hook: hash automático
modeloSchema.pre("save", async function () {
	if (this.isModified("password")) {
		this.password = await bcrypt.hash(this.password, 12)
	}
})

export default mongoose.models.Modelo ||
	model<ModeloType>("Modelo", modeloSchema, "modelos")
```

### En queries (consumidor)

```typescript
// Para login, necesitas incluir password explícitamente:
const user = await Model.findOne({ email }).select("+password")

// Verificar password:
const isValid = await bcrypt.compare(inputPassword, user.password)
```

---

## Skill 8: Modelo con auth token (SHA-256 + TTL)

### Template

```typescript
import mongoose, {
	Schema,
	model,
	type Model,
	type HydratedDocument,
	type Types,
} from "mongoose"

export interface TokenType {
	customer_id: Types.ObjectId
	token_hash: string       // SHA-256 hash, never raw token
	expires_at: Date
	used_at?: Date           // Si el token es de un solo uso
	created_at: Date
	updated_at?: Date
}

export type TokenDoc = HydratedDocument<TokenType>
export type TokenModel = Model<TokenType>

const tokenSchema = new Schema<TokenType>({
	customer_id: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
	token_hash: { type: String, required: true },
	expires_at: { type: Date, required: true },
	used_at: { type: Date },
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date },
})

// Indexes
tokenSchema.index({ token_hash: 1 }, { unique: true })
tokenSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 })  // TTL auto-delete
tokenSchema.index({ customer_id: 1, expires_at: 1 })

// Auto-update updated_at
tokenSchema.pre("save", function () {
	this.updated_at = new Date()
})

const Token: TokenModel =
	(mongoose.models.Token as TokenModel) ||
	model<TokenType>("Token", tokenSchema, "tokens")

export default Token
```

### En consumidor (crear token)

```typescript
import crypto from "crypto"

const rawToken = crypto.randomBytes(32).toString("base64url")
const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex")

await Token.create({
	customer_id: customerId,
	token_hash: tokenHash,
	expires_at: new Date(Date.now() + 15 * 60 * 1000), // 15 min
})

// Enviar rawToken al usuario (email, response, etc.)
// Almacenar solo tokenHash en DB
```

---

## Skill 9: Relaciones entre modelos

### Referencia simple (N:1)

```typescript
const schema = new Schema({
	parent_id: {
		type: Schema.Types.ObjectId,
		ref: "ParentModel",
		required: true,
		index: true,
	},
})
```

### Referencia 1:1 (con unique)

```typescript
const schema = new Schema({
	parent_id: {
		type: Schema.Types.ObjectId,
		ref: "ParentModel",
		required: true,
		unique: true,  // Garantiza 1:1
	},
})
```

### Array de referencias

```typescript
const schema = new Schema({
	// Array de ObjectIds
	tag_ids: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
	
	// O con type explícito
	tags: { type: [Schema.Types.ObjectId], ref: "Tag", default: [], index: true },
})
```

### Referencia polimórfica (como SyncLog)

```typescript
const schema = new Schema({
	entity_type: { type: String, required: true, index: true },  // "Quote", "Order", etc.
	entity_id: { type: Schema.Types.ObjectId, required: true, index: true },
})

schema.index({ entity_type: 1, entity_id: 1, status: 1 })
```

---

## Skill 10: Export patterns

### Default export (modelo) + type export

```typescript
// En el archivo del modelo:
export interface ModeloType { /* ... */ }
export default mongoose.models.Modelo || model<ModeloType>("Modelo", schema, "modelos")

// En el barrel index.ts:
export { default as Modelo } from "./models/Modelo"
export type { ModeloType } from "./models/Modelo"
```

### Default export + enum exports

```typescript
// En el archivo del modelo:
export enum StatusEnum { ACTIVE = "active", INACTIVE = "inactive" }
export default mongoose.models.Modelo || model("Modelo", schema, "modelos")

// En el barrel:
export { default as Modelo, StatusEnum } from "./models/Modelo"
```

### Named export (alternativa para modelos con muchos exports)

```typescript
// En el archivo del modelo:
export const SyncLog = mongoose.models.SyncLog || model<ISyncLog>("SyncLog", schema, "sync_logs")
export enum SyncLogType { /* ... */ }
export type { ISyncLog }

// En el barrel:
export { SyncLog, SyncLogAction, SyncLogStatus, SyncLogType } from "./models/SyncLog"
export type { ISyncLog } from "./models/SyncLog"
```

### Typed model pattern (para Doc + Model types)

```typescript
// Para modelos que necesitan tipado fuerte:
export type ModeloDoc = HydratedDocument<ModeloType>
export type ModeloModel = Model<ModeloType>

const Modelo: ModeloModel =
	(mongoose.models.Modelo as ModeloModel) ||
	model<ModeloType>("Modelo", schema, "collection")

export default Modelo
```

---

## Skill 11: Timestamps

### Timestamps automáticos (preferido)

```typescript
const schema = new Schema(
	{ /* campos */ },
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
)
```

Mongoose maneja `created_at` y `updated_at` automáticamente.

### Timestamps manuales (legacy)

```typescript
const schema = new Schema({
	// ...
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date },
})
```

**Nota**: En modo manual, hay que actualizar `updated_at` explícitamente en las operaciones de update.

---

## Skill 12: Validaciones en schema

### Required + trim

```typescript
name: { type: String, required: true, trim: true }
```

### Enum validation

```typescript
status: {
	type: String,
	enum: Object.values(StatusEnum),
	default: StatusEnum.DEFAULT_VALUE,
	required: true,
}
```

### Min/Max para números

```typescript
percentage: { type: Number, required: true, min: 0, max: 1, default: 0.1 }
quantity: { type: Number, required: true, min: 1 }
amount: { type: Number, required: true, min: 0 }
```

### Array validation (custom)

```typescript
roles: {
	type: [String],
	enum: Object.values(UserRole),
	required: true,
	validate: {
		validator: (roles: UserRole[]) => roles.length > 0,
		message: "At least one role must be assigned.",
	},
}
```

### String transforms

```typescript
name: { type: String, trim: true, lowercase: true }   // auto-lowercase
code: { type: String, trim: true, uppercase: true }    // auto-uppercase
slug: { type: String, trim: true, lowercase: true }    // slug pattern
```

---

## Skill 13: Build y publish workflow

### Desarrollo local

```bash
# Type check sin compilar
pnpm run build:check

# Compilar a dist/
pnpm run build
```

### Publish a npm

```bash
# 1. Asegurar que compila limpio
pnpm run build

# 2. Bump version
npm version patch   # 0.1.x → fix/add model
npm version minor   # 0.x.0 → cambios compatibles en schemas
npm version major   # x.0.0 → breaking changes

# 3. Publish (requiere NPM_TOKEN)
export NPM_REGISTRY=https://registry.npmjs.org
export NPM_TOKEN=<tu_token>
npm publish --access public

# 4. Actualizar consumidores
cd ../fesmex-be2 && pnpm install @fesmex/models@latest
cd ../fesmex-store-be && pnpm install @fesmex/models@latest
```

### Versionado semántico

| Cambio | Version bump | Ejemplo |
|---|---|---|
| Agregar modelo nuevo | `patch` | 0.1.57 → 0.1.58 |
| Agregar campo opcional a modelo | `patch` | 0.1.58 → 0.1.59 |
| Agregar enum value | `patch` | |
| Cambiar tipo de campo existente | `minor` | 0.1.x → 0.2.0 |
| Renombrar modelo/colección | `major` | 0.x.x → 1.0.0 |
| Eliminar campo required | `major` | |

---

## Skill 14: Migrar modelo desde fesmex-be2

### Paso 1 — Copiar archivo

```bash
cp fesmex-be2/src/modules/<dominio>/models/<Modelo>.ts \
   fesmex-models/src/<dominio>/models/<Modelo>.ts
```

### Paso 2 — Ajustar imports

El modelo en `fesmex-be2` puede tener imports relativos a otros modelos locales. Ajustar a imports relativos dentro de `fesmex-models`:

```typescript
// Antes (en fesmex-be2):
import { UserRole } from "../../users/models/Users"

// Después (en fesmex-models):
import { UserRole } from "../../users/models/Users"
// (misma estructura relativa, pero verificar que el path sea correcto)
```

### Paso 3 — Verificar registration pattern

Asegurar que usa el patrón condicional:
```typescript
export default mongoose.models.ModelName ||
	model<TypeName>("ModelName", schema, "collection_name")
```

### Paso 4 — Exportar, build, publish (ver Skills 1-2)

### Paso 5 — Actualizar imports en fesmex-be2

```typescript
// Antes:
import Modelo from "../models/Modelo"

// Después:
import { Modelo } from "@fesmex/models"
```

---

## Skill 15: Debugging checklist

### Error: "OverwriteModelError: Cannot overwrite model"

**Causa**: El modelo se registra dos veces (común en HMR de desarrollo).
**Fix**: Verificar que usa el patrón condicional:
```typescript
mongoose.models.ModelName || model("ModelName", schema)
```

### Error: "MissingSchemaError: Schema hasn't been registered for model"

**Causa**: Referencia a un modelo que no está importado/registrado.
**Fix**: Asegurar que el modelo referenciado también está en `@fesmex/models` y se importa en algún lugar antes del populate.

### Error: "Cannot read properties of undefined (reading 'ObjectId')"

**Causa**: Import incorrecto de mongoose.
**Fix**: Verificar import:
```typescript
import mongoose, { Schema, model, Types } from "mongoose"
// Schema.Types.ObjectId ← para schema definition
// Types.ObjectId ← para TypeScript interface
```

### Error: Build falla con type errors

```bash
# Verificar types sin compilar:
pnpm run build:check

# Si falla, revisar:
# 1. Interfaces exportadas correctamente
# 2. Tipos de mongoose compatibles (^7 || ^8 || ^9)
# 3. Imports relativos correctos entre dominios
```

### Error: Campo no aparece en queries

**Causa posible**: `select: false` en el campo (como `password`).
**Fix**: Usar `.select("+fieldName")` en la query.

### Error: Index no se crea

**Causa**: Mongoose crea indexes solo en `mongoose.connect()` o con `Model.ensureIndexes()`.
**Fix**: En producción, crear indexes manualmente con `mongosh` o verificar que `autoIndex` está habilitado en la conexión del consumidor.

---

## Skill 16: Checklist de nuevo modelo

Antes de hacer publish, verificar:

1. **Schema correcto**: Tipos, required, defaults, enums, refs
2. **Interface TypeScript**: Matchea exactamente con el schema
3. **Collection name**: Tercer argumento de `model()` en snake_case plural
4. **Model name**: Segundo argumento de `model()` en PascalCase singular
5. **Registration pattern**: `mongoose.models.X || model("X", schema, "collection")`
6. **Timestamps**: Usar `{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }`
7. **Indexes**: Compound indexes para queries frecuentes, unique donde necesario
8. **Exports**: Default export (modelo) + type export en barrel
9. **Barrel updated**: `src/<dominio>/index.ts` exporta el modelo
10. **Root barrel**: `src/index.ts` reexporta el dominio
11. **Build check**: `pnpm run build:check` pasa sin errores
12. **Build**: `pnpm run build` genera `dist/` correctamente

---

## Skill 17: Patrones de colección MongoDB

### Naming de colecciones

| Mongoose Model | Collection Name |
|---|---|
| `Client` | `clients` |
| `ClientContact` | `client_contacts` |
| `ArticlePrice` | `article_prices` |
| `InventoryStock` | `inventory_stocks` |
| `OrderStatusLog` | `order_status_logs` |
| `CustomerPaymentMethod` | `customer_payment_methods` |

**Regla**: snake_case, plural, compuesto con `_` para multi-palabra.

### Colecciones actuales (37 total)

```
announcements
article_classes
article_groups
article_prices
article_views
articles
carts
categories
client_addresses
client_contacts
client_payment_methods
client_payment_terms
client_price_lists
client_sales_employees
clients
currencies
customer_payment_methods
customers
email_verification_tokens
fiscal_profiles
inventory_stocks
order_payments
order_status_logs
orders
password_reset_tokens
price_lists
quote_article_extras
quote_articles
quote_contacts
quote_terms
quotes
refresh_tokens
states
sync_logs
tags
users
warehouses
```

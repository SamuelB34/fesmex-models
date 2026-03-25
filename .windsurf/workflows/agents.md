---
description: Roles de agente IA para el proyecto fesmex-models. Usa este archivo para entender el contexto completo del paquete de modelos compartido, su arquitectura, dominios y convenciones antes de hacer cualquier cambio.
---

# FESMEX Models – Agents

## 1. Resumen del Proyecto

**@fesmex/models** es un paquete npm compartido que contiene todos los modelos de Mongoose (schemas, types, enums) usados por los distintos backends del ecosistema FESMEX (`fesmex-be2`, `fesmex-store-be`, y potencialmente otros). Es la **fuente única de verdad** para la capa de datos MongoDB.

### Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Runtime | Node.js (ES2020 target) |
| Lenguaje | TypeScript (strict: false) |
| ORM | Mongoose ^7 \|\| ^8 \|\| ^9 (peer dependency) |
| Hashing | bcryptjs |
| Build | tsup (ESM + CJS + dts) |
| Package Manager | pnpm |
| Registry | npm (público, @fesmex scope) |
| Versión actual | 0.1.58 |

### Estructura de Carpetas

```
fesmex-models/
├── src/
│   ├── index.ts                 # Barrel: reexporta todos los dominios
│   ├── announcements/
│   │   ├── index.ts
│   │   └── models/
│   │       └── Announcements.ts
│   ├── auth/
│   │   ├── index.ts
│   │   └── models/
│   │       ├── RefreshTokens.ts
│   │       ├── PasswordResetTokens.ts
│   │       └── EmailVerificationTokens.ts
│   ├── carts/
│   │   ├── index.ts
│   │   └── models/
│   │       └── Carts.ts
│   ├── clients/
│   │   ├── index.ts
│   │   └── models/
│   │       ├── Clients.ts
│   │       ├── ClientsContact.ts
│   │       ├── ClientsAddress.ts
│   │       ├── ClientsPaymentMethod.ts
│   │       ├── ClientsPaymentTerm.ts
│   │       ├── ClientsPriceList.ts
│   │       └── ClientsSalesEmployee.ts
│   ├── customers/
│   │   ├── index.ts
│   │   └── models/
│   │       ├── Customers.ts
│   │       └── FiscalProfileType.ts
│   ├── inventory/
│   │   ├── index.ts
│   │   └── models/
│   │       ├── Article.ts
│   │       ├── ArticleGroups.ts
│   │       ├── ArticleClasses.ts
│   │       ├── ArticlePrices.ts
│   │       ├── ArticleViews.ts
│   │       ├── Currencies.ts
│   │       ├── Warehouses.ts
│   │       ├── InventoryStocks.ts
│   │       ├── PriceLists.ts
│   │       ├── Category.ts
│   │       └── Tag.ts
│   ├── orders/
│   │   ├── index.ts
│   │   └── models/
│   │       ├── Orders.ts
│   │       ├── OrderStatusLogs.ts
│   │       └── State.ts
│   ├── payments/
│   │   ├── index.ts
│   │   └── models/
│   │       ├── PaymentMethods.ts
│   │       └── Payments.ts
│   ├── quotes/
│   │   ├── index.ts
│   │   └── models/
│   │       ├── Quote.ts
│   │       ├── QuoteArticle.ts
│   │       ├── QuoteArticleExtra.ts
│   │       ├── QuoteContact.ts
│   │       └── QuoteTerm.ts
│   ├── sap/
│   │   ├── index.ts
│   │   └── models/
│   │       └── SyncLog.ts
│   └── users/
│       ├── index.ts
│       └── models/
│           └── Users.ts
├── dist/                        # Build output (ESM + CJS + .d.ts)
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── .npmrc                       # Registry + auth token config
├── README.md
└── CONTRIBUTING.md
```

### Consumidores

| Proyecto | Uso |
|---|---|
| `fesmex-be2` | Backend principal (GraphQL API) — importa modelos para queries, mutations, resolvers |
| `fesmex-store-be` | Backend de tienda online — importa modelos de customers, orders, carts, payments, inventory |

### Build & Publish

```bash
pnpm run build          # tsup → dist/ (ESM + CJS + .d.ts + sourcemaps)
pnpm run build:check    # tsc --noEmit (type checking only)
npm version patch       # Bump version
npm publish --access public  # Publish to npm
```

---

## 2. Arquitectura

### Barrel Exports

```
src/index.ts → reexporta todos los dominios
  ├── src/clients/index.ts → 7 modelos + types
  ├── src/inventory/index.ts → 11 modelos
  ├── src/quotes/index.ts → 5 modelos + enums
  ├── src/customers/index.ts → 2 modelos + types
  ├── src/orders/index.ts → 3 modelos + enums
  ├── src/sap/index.ts → 1 modelo + enums + type
  ├── src/announcements/index.ts → 1 modelo + type
  ├── src/users/index.ts → 1 modelo + enums + type
  ├── src/carts/index.ts → 1 modelo + types
  ├── src/auth/index.ts → 3 modelos + types
  └── src/payments/index.ts → 2 modelos + enums + types
```

**Import pattern en consumidores**:
```typescript
import { Client, ClientContact, UserRole, Quote, QuoteStatus } from "@fesmex/models"
```

### Model Registration Pattern

Todos los modelos usan el patrón de registro condicional de Mongoose:
```typescript
export default mongoose.models.ModelName || model<TypeName>("ModelName", schema, "collection_name")
```

Esto previene el error `OverwriteModelError` cuando el modelo se importa múltiples veces (ej. en HMR de desarrollo).

### Timestamp Convention

Mayoría de modelos usan Mongoose `timestamps` mapeados a snake_case:
```typescript
{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
```

Algunos modelos más antiguos usan `created_at: { type: Date, default: Date.now }` manual.

### Soft Delete Pattern

Entidades con borrado lógico incluyen:
```typescript
deleted_at: { type: Date }
deleted_by: { type: Schema.Types.ObjectId, ref: "User" }
```

---

## 3. Dominios y Modelos

### 3.1 Dominio: Users (Usuarios internos)

**Modelo**: `User`
**Colección**: `users`
**Archivo**: `src/users/models/Users.ts`

Usuarios internos del backoffice (vendedores, admin, técnicos, almacenistas, QA tienda).

**Enums exportados**:
- `UserRole`: `admin`, `sales`, `technician`, `warehouseman`, `store_qa`
- `UserStatus`: `active`, `inactive`, `suspended`

**Campos clave**:
| Campo | Tipo | Notas |
|---|---|---|
| `first_name` | String | required |
| `last_name` | String | required |
| `username` | String | required, unique |
| `password` | String | required, `select: false`, auto-hash bcrypt(12) |
| `role` | UserRole enum | default: `sales` |
| `status` | UserStatus enum | default: `active` |
| `email` | String | opcional |
| `mobile` | String | opcional |
| `pipedrive_id` | String | ID en Pipedrive CRM |
| `sap_id` | String | ID en SAP |
| `sap_employee_id` | String | Employee ID en SAP |

**Pre-save hook**: Hash automático de password con bcrypt(12).

---

### 3.2 Dominio: Clients (Clientes B2B / CRM)

7 modelos normalizados para el CRM de clientes corporativos.

| Modelo | Colección | Relación |
|---|---|---|
| `Client` | `clients` | Entidad principal |
| `ClientContact` | `client_contacts` | N:1 → Client (`client_id`) |
| `ClientAddress` | `client_addresses` | N:1 → Client (`client_id`) |
| `ClientPaymentMethod` | `client_payment_methods` | 1:1 → Client (`client_id`, unique) |
| `ClientPaymentTerm` | `client_payment_terms` | 1:1 → Client (`client_id`, unique) |
| `ClientPriceList` | `client_price_lists` | 1:1 → Client (`client_id`, unique) |
| `ClientSalesEmployee` | `client_sales_employees` | 1:1 → Client (`client_id`, unique) |

**Client campos clave**: `sn_code` (SAP code, indexed), `sn_name`, `tax_id`, `currency`, `pipedrive_id`, `sap_id`

**Patrón**: Datos normalizados — cada sub-entidad tiene `client_id` como FK. ContactAddress es N:1, los demás son 1:1 (unique constraint).

---

### 3.3 Dominio: Inventory (Inventario)

11 modelos para gestión de artículos, precios, stock y categorización.

| Modelo | Colección | Descripción |
|---|---|---|
| `Article` | `articles` | Artículo principal. Tiene `article_number` (SAP ItemCode, unique), `group_id`, `category_id`, `tags[]`, `files.images[]`, `files.datasheets[]`, `is_featured` |
| `ArticleGroup` | `article_groups` | Grupo de artículos (name, description) |
| `ArticleClass` | `article_classes` | Clase de artículo |
| `ArticlePrice` | `article_prices` | Precio de artículo por `price_list_id` + `currency_id`. Index compuesto `(article_id, price_list_id)` |
| `Currency` | `currencies` | Moneda (code unique, symbol, name) |
| `Warehouse` | `warehouses` | Almacén (code unique, name, location) |
| `InventoryStock` | `inventory_stocks` | Stock por artículo+almacén. Index unique `(article_id, warehouse_id)` |
| `PriceList` | `price_lists` | Lista de precios (number unique, name) |
| `Category` | `categories` | Categoría jerárquica con `parent_id` (self-ref), `slug` unique, `is_active` |
| `Tag` | `tags` | Tag con `slug` unique, `type` ("filter" \| "sidebar"), `is_active` |
| `ArticleView` | `article_views` | Registro de visitas a artículos (`article_id`, `visited_at`) |

**Article sub-schemas** (embedded, `_id: false`):
- `articleFileSchema`: `{ key, url, filename, mime_type, size, uploaded_at, uploaded_by }`
- Almacenados en `files.images[]` y `files.datasheets[]`

**Text search index**: `Article` tiene index de texto en `description`, `brand`, `model`.

---

### 3.4 Dominio: Quotes (Cotizaciones)

5 modelos para el sistema de cotizaciones.

| Modelo | Colección | Relación |
|---|---|---|
| `Quote` | `quotes` | Cotización principal |
| `QuoteArticle` | `quote_articles` | N:1 → Quote (`quote_id`) |
| `QuoteArticleExtra` | `quote_article_extras` | 1:1 → QuoteArticle (`quote_article_id`) |
| `QuoteContact` | `quote_contacts` | N:1 → Quote (`quote_id`) |
| `QuoteTerm` | `quote_terms` | Standalone, referenced por `Quote.terms_ids[]` |

**Enums exportados**:
- `QuoteStatus`: `OPPORTUNITY`, `QUOTE`, `FOLLOWING`, `NEGOTIATION`
- `Status`: `OPEN`, `WIN`, `LOST`, `DELETE`
- `CreatedMethod`: `MANUAL`, `CSV`

**Quote campos clave**: `quote_number`, `quote_revision`, `quote_ref`, `company_id` → Client, `contact_id` → ClientContact, `currency_id` → Currency, `status`, `quote_status`, `sap_id`, `pipedrive_id`, `should_sync`, `created_by` → User

**QuoteArticle**: precio desglosado (`price`, `unit_price`, `original_price`, `total`, `utility`), opcionalmente con `extra_id` → QuoteArticleExtra (costos de importación: `multiplier`, `usa_freight`, `duty`, `mex_freight`).

---

### 3.5 Dominio: Customers (Clientes E-Commerce)

2 modelos para clientes de la tienda online (B2C).

| Modelo | Colección | Descripción |
|---|---|---|
| `Customer` | `customers` | Cliente de tienda. Email unique, password hash bcrypt(12) |
| `FiscalProfile` | `fiscal_profiles` | Perfil fiscal mexicano (RFC, razón social, uso CFDI, régimen fiscal, CP) |

**Customer enums**: `CustomerStatus`: `active`, `inactive`, `banned`

**Nota**: `Customer` ≠ `Client`. Customer = usuario de tienda online. Client = empresa CRM B2B.

---

### 3.6 Dominio: Orders (Órdenes)

3 modelos para órdenes de compra de la tienda.

| Modelo | Colección | Descripción |
|---|---|---|
| `Order` | `orders` | Orden de compra con items embedded, shipping address, totales |
| `OrderStatusLog` | `order_status_logs` | Log de cambios de status con `changed_by` → User |
| `State` | `states` | Estados de México con porcentaje de envío |

**Order enums**:
- `OrderStatus`: `pending`, `confirmed`, `shipped`, `cancelled`, `completed`
- `PaymentMethod`: `CARD`, `TRANSFER`
- `PaymentStatus`: `UNPAID`, `PENDING_TRANSFER`, `PAID`, `REFUNDED`

**Order sub-schemas** (embedded, `_id: false`):
- `shippingAddressSchema`: `{ full_name, phone, line1, line2, city, state, postal_code, country }`
- `orderItemSchema`: `{ article_id → Article, quantity, unit_price, total }`

**Order campos clave**: `customer_id` → Customer, `delivery_type` ("shipping" | "pickup"), `shipping_fee`, `shipping_state_id` → State, `expires_at`, `tracking_number`

**State**: `percentage` (0-1 range), `is_active`, `name` (lowercase, indexed)

---

### 3.7 Dominio: Auth (Tokens de Autenticación)

3 modelos de tokens para autenticación de customers (tienda online).

| Modelo | Colección | Descripción |
|---|---|---|
| `RefreshToken` | `refresh_tokens` | Token de refresh (SHA-256 hash). TTL index en `expires_at` |
| `PasswordResetToken` | `password_reset_tokens` | Token de reset de password. TTL index en `expires_at` |
| `EmailVerificationToken` | `email_verification_tokens` | Token de verificación de email. TTL index en `expires_at` |

**Patrón común**: Todos almacenan `token_hash` (SHA-256, nunca el token raw), tienen `expires_at` con TTL index (`expireAfterSeconds: 0`), y `customer_id` → Customer.

---

### 3.8 Dominio: Payments (Pagos)

2 modelos para procesamiento de pagos (Stripe).

| Modelo | Colección | Descripción |
|---|---|---|
| `CustomerPaymentMethod` | `customer_payment_methods` | Método de pago guardado (tarjeta Stripe). Unique por `(customer_id, provider_payment_method_id)` |
| `OrderPayment` | `order_payments` | Transacción de pago por orden. Unique por `provider_payment_intent_id` |

**PaymentMethods enums**:
- `PaymentProvider`: `stripe`
- `PaymentMethodType`: `card`, `apple_pay`, `google_pay`, `bank_transfer`

**Payments enums**:
- `TransactionStatus`: `pending`, `processing`, `succeeded`, `failed`, `refunded`
- `TransactionMethod`: `card`, `apple_pay`, `google_pay`, `bank_transfer`

---

### 3.9 Dominio: Carts (Carritos)

1 modelo para carrito de compras.

| Modelo | Colección | Descripción |
|---|---|---|
| `Cart` | `carts` | Carrito por customer (unique `customer_id`). Items embedded con `article_id`, `quantity`, `unit_price`, `line_subtotal` |

**Cart status**: `ACTIVE`, `CHECKED_OUT`, `ABANDONED`
**Constraint**: 1 carrito por customer (unique index).

---

### 3.10 Dominio: SAP (Sincronización)

1 modelo para logging de sincronización con SAP/Pipedrive.

| Modelo | Colección | Descripción |
|---|---|---|
| `SyncLog` | `sync_logs` | Log de sincronización con reintentos |

**Enums exportados**:
- `SyncLogType`: `SAP_QUOTATION`, `SAP_SALES_ORDER`, `PIPEDRIVE`
- `SyncLogStatus`: `PENDING`, `SUCCESS`, `FAILED`, `RETRYING`
- `SyncLogAction`: `CREATE`, `UPDATE`, `DELETE`

**Campos clave**: `entity_type` + `entity_id` (polimórfico), `retry_count`, `max_retries` (default 3), `next_retry_at`, `request_payload`, `response_payload`, `error_message/code/details`

---

### 3.11 Dominio: Announcements (Anuncios)

1 modelo para anuncios internos.

| Modelo | Colección | Descripción |
|---|---|---|
| `Announcement` | `announcements` | Anuncio con `title`, `text`, `roles[]` (filtrado por UserRole) |

**Validación**: `roles` array debe tener al menos 1 elemento.

---

## 4. Mapa de Relaciones entre Modelos

```
User ←──── Quote.created_by
  │ ←──── Quote.updated_by / deleted_by
  │ ←──── Announcement.created_by
  │ ←──── OrderStatusLog.changed_by
  │ ←──── InventoryStock.updated_by
  │ ←──── SyncLog.resolved_by
  │
Client ←── ClientContact.client_id (N:1)
  │ ←───── ClientAddress.client_id (N:1)
  │ ←───── ClientPaymentMethod.client_id (1:1)
  │ ←───── ClientPaymentTerm.client_id (1:1)
  │ ←───── ClientPriceList.client_id (1:1)
  │ ←───── ClientSalesEmployee.client_id (1:1)
  │ ←───── Quote.company_id
  │
Customer ←── FiscalProfile.customer_id
  │ ←──────── Order.customer_id
  │ ←──────── Cart.customer_id (1:1)
  │ ←──────── RefreshToken.customer_id
  │ ←──────── PasswordResetToken.customer_id
  │ ←──────── EmailVerificationToken.customer_id
  │ ←──────── CustomerPaymentMethod.customer_id
  │ ←──────── OrderPayment.customer_id
  │
Article ←── ArticlePrice.article_id (N:1)
  │ ←──────── InventoryStock.article_id (N:1)
  │ ←──────── QuoteArticle.article_id
  │ ←──────── Cart.items[].article_id
  │ ←──────── Order.items[].article_id
  │ ←──────── ArticleView.article_id
  │ ────────→ ArticleGroup (group_id)
  │ ────────→ Category (category_id)
  │ ────────→ Tag[] (tags)
  │
Quote ←──── QuoteArticle.quote_id (N:1)
  │ ←──────── QuoteContact.quote_id (N:1)
  │ ────────→ QuoteTerm[] (terms_ids)
  │ ────────→ Currency (currency_id)
  │ ────────→ Client (company_id)
  │ ────────→ ClientContact (contact_id)
  │
Order ←──── OrderStatusLog.order_id (N:1)
  │ ←──────── OrderPayment.order_id
  │ ────────→ Customer (customer_id)
  │ ────────→ State (shipping_state_id)
  │
QuoteArticle ←── QuoteArticleExtra.quote_article_id (1:1)
```

---

## 5. Agentes

### 5.1 Agente: Package Management

**Cuándo activar**: Build, publish, version bumps, dependency updates.

**Responsabilidades**:
- `tsup` build configuration
- Version management (semver)
- npm publish workflow
- `.npmrc` token/registry configuration
- Updating consumers (`fesmex-be2`, `fesmex-store-be`)

**Archivos clave**:
- `package.json` → version, exports, peer deps
- `tsup.config.ts` → build config
- `.npmrc` → registry auth
- `CONTRIBUTING.md` → workflow completo

---

### 5.2 Agente: Clients Domain

**Cuándo activar**: Cambios en modelos de clientes CRM.

**Responsabilidades**: 7 modelos normalizados del CRM B2B.

**Archivos**: `src/clients/models/` (7 files) + `src/clients/index.ts`

**Consideraciones**:
- `ClientContact` y `ClientAddress` son N:1 (múltiples por cliente)
- Los demás sub-modelos son 1:1 (unique constraint en `client_id`)
- Todos usan timestamps mapeados a snake_case
- Todos los campos (excepto `client_id`) son opcionales con `| null`

---

### 5.3 Agente: Inventory Domain

**Cuándo activar**: Cambios en artículos, precios, stock, categorías, tags.

**Responsabilidades**: 11 modelos de inventario.

**Archivos**: `src/inventory/models/` (11 files) + `src/inventory/index.ts`

**Consideraciones**:
- `Article` es el modelo más complejo (text search index, file sub-schemas, múltiples compound indexes)
- `ArticlePrice` tiene index compuesto `(article_id, price_list_id)`
- `InventoryStock` tiene unique index `(article_id, warehouse_id)`
- `Category` es jerárquica (self-referencing `parent_id`)
- `Tag` tiene `type` enum: "filter" | "sidebar"

---

### 5.4 Agente: Quotes Domain

**Cuándo activar**: Cambios en cotizaciones.

**Responsabilidades**: 5 modelos de cotizaciones.

**Archivos**: `src/quotes/models/` (5 files) + `src/quotes/index.ts`

**Consideraciones**:
- `Quote` tiene double-status: `status` (OPEN/WIN/LOST/DELETE) + `quote_status` (OPPORTUNITY/QUOTE/FOLLOWING/NEGOTIATION)
- `QuoteArticle` tiene precios desglosados con optional `extra_id` para costos de importación
- `QuoteTerm` es standalone (no requiere quote_id), referenciado por `Quote.terms_ids[]`

---

### 5.5 Agente: E-Commerce Domain (Customers + Orders + Carts + Payments + Auth)

**Cuándo activar**: Cambios en modelos de tienda online.

**Responsabilidades**: 11 modelos de e-commerce.

**Archivos**: `src/customers/`, `src/orders/`, `src/carts/`, `src/payments/`, `src/auth/`

**Consideraciones**:
- `Customer` ≠ `Client` (Customer = tienda B2C, Client = CRM B2B)
- Auth tokens usan SHA-256 hashing + TTL indexes para auto-expiry
- `Order` tiene embedded sub-schemas (items, shipping address) en vez de colecciones separadas
- `Cart` es 1:1 per customer (unique index)
- Payments integran con Stripe (`provider_payment_intent_id`, `provider_payment_method_id`)

---

### 5.6 Agente: SAP Integration

**Cuándo activar**: Cambios en sincronización SAP/Pipedrive.

**Responsabilidades**: `SyncLog` model.

**Archivo**: `src/sap/models/SyncLog.ts`

**Consideraciones**:
- Patrón polimórfico: `entity_type` + `entity_id` puede apuntar a cualquier entidad
- Sistema de reintentos: `retry_count`, `max_retries`, `next_retry_at`
- Almacena `request_payload` y `response_payload` como Mixed

---

## 6. Convenciones

### Naming

- **Archivos de modelo**: PascalCase plural (ej. `Clients.ts`, `ArticlePrices.ts`)
- **Modelo Mongoose**: PascalCase singular (ej. `"Client"`, `"ArticlePrice"`)
- **Colección MongoDB**: snake_case plural (ej. `"clients"`, `"article_prices"`)
- **Campos**: snake_case (ej. `created_at`, `client_id`, `sn_name`)
- **Tipos exportados**: PascalCase + "Type" suffix (ej. `ClientType`, `UserType`)
- **Enums**: PascalCase (ej. `UserRole`, `QuoteStatus`)

### Export Pattern

Cada dominio exporta:
```typescript
// Default export: Mongoose model
export { default as ModelName } from "./models/ModelFile"

// Named exports: TypeScript types
export type { ModelNameType } from "./models/ModelFile"

// Named exports: Enums (when applicable)
export { EnumName } from "./models/ModelFile"
```

### Index Strategy

- **Unique indexes**: `username`, `email`, `article_number`, `slug`, compound keys
- **Compound indexes**: Performance queries (ej. `article_id + price_list_id`)
- **Text indexes**: Full-text search en Article (`description`, `brand`, `model`)
- **TTL indexes**: Auto-expiry de tokens de auth (`expires_at`)
- **Sparse indexes**: Campos opcionales con unique (ej. `State.code`)

### Soft Delete

Entidades con borrado lógico:
- `Client`, `User`, `Article`, `Customer`, `CustomerPaymentMethod`, `OrderPayment`
- Campos: `deleted_at: Date`, `deleted_by: ObjectId → User`
- **No** usan TTL — son permanentes hasta purga manual

### Password Hashing

`User` y `Customer` hashean passwords automáticamente con `bcrypt(12)` en pre-save hook. Campo `password` tiene `select: false` (no se incluye en queries por defecto).

import mongoose, { Schema, model, Types } from "mongoose"

export enum OrderStatus {
	PENDING = "pending",
	CONFIRMED = "confirmed",
	SHIPPED = "shipped",
	CANCELLED = "cancelled",
	COMPLETED = "completed",
}

export enum OrderSapSyncStatus {
	PENDING = "PENDING",
	PROCESSING = "PROCESSING",
	SYNCED = "SYNCED",
	FAILED = "FAILED",
}

export enum PaymentMethod {
	CARD = "CARD",
	TRANSFER = "TRANSFER",
}

export enum PaymentStatus {
	UNPAID = "UNPAID",
	PENDING_TRANSFER = "PENDING_TRANSFER",
	PAID = "PAID",
	REFUNDED = "REFUNDED",
}

export interface OrderType {
	customer_id: Types.ObjectId
	items: Array<{
		article_id: Types.ObjectId
		quantity: number
		unit_price: number
		total: number
	}>
	status: OrderStatus
	tracking_number?: string
	payment_method: PaymentMethod
	payment_status: PaymentStatus
	expires_at?: Date
	shipping_address?: {
		full_name: string
		phone: string
		line1: string
		line2?: string
		city: string
		state: string
		postal_code: string
		country: string
	}
	delivery_type: "shipping" | "pickup"
	subtotal: number
	shipping_fee?: number | null
	shipping_state_id?: Types.ObjectId | null
	total: number
	notes?: string
	should_sync: boolean
	sap_sync_status: OrderSapSyncStatus
	sap_sync_attempts: number
	sap_last_sync_attempt_at?: Date | null
	sap_last_sync_error?: string | null
	sap_doc_entry?: number | null
	sap_doc_num?: number | null
	sap_synced_at?: Date | null
	created_at?: Date
	updated_at?: Date
}

const shippingAddressSchema = new Schema(
	{
		full_name: { type: String, required: true, trim: true },
		phone: { type: String, required: true, trim: true },
		line1: { type: String, required: true, trim: true },
		line2: { type: String, trim: true },
		city: { type: String, required: true, trim: true },
		state: { type: String, required: true, trim: true },
		postal_code: { type: String, required: true, trim: true },
		country: { type: String, required: true, trim: true, default: "MX" },
	},
	{ _id: false }
)

const orderItemSchema = new Schema(
	{
		article_id: { type: Schema.Types.ObjectId, ref: "Article", required: true },
		quantity: { type: Number, required: true, min: 1 },
		unit_price: { type: Number, required: true, min: 0 },
		total: { type: Number, required: true, min: 0 },
	},
	{ _id: false }
)

const orderSchema = new Schema<OrderType>(
	{
		customer_id: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
		items: {
			type: [orderItemSchema],
			required: true,
			default: [],
			validate: {
				validator: (items: Array<any>) => Array.isArray(items) && items.length > 0,
				message: "Order must contain at least one item.",
			},
		},

		status: {
			type: String,
			enum: Object.values(OrderStatus),
			default: OrderStatus.PENDING,
			required: true,
		},

		tracking_number: { type: String, trim: true },

		payment_method: {
			type: String,
			enum: Object.values(PaymentMethod),
			required: true,
		},

		payment_status: {
			type: String,
			enum: Object.values(PaymentStatus),
			default: PaymentStatus.UNPAID,
			required: true,
		},

		expires_at: { type: Date },

		shipping_address: { type: shippingAddressSchema, required: false },
		delivery_type: { type: String, enum: ['shipping', 'pickup'], required: true },
		subtotal: { type: Number, required: true, min: 0 },
		shipping_fee: { type: Number, min: 0, default: null },
		shipping_state_id: { type: Schema.Types.ObjectId, ref: "State", default: null },
		total: { type: Number, required: true, min: 0 },
		notes: { type: String, trim: true },
		should_sync: { type: Boolean, default: true },
		sap_sync_status: {
			type: String,
			enum: Object.values(OrderSapSyncStatus),
			default: OrderSapSyncStatus.PENDING,
			required: true,
		},
		sap_sync_attempts: { type: Number, default: 0, min: 0 },
		sap_last_sync_attempt_at: { type: Date, default: null },
		sap_last_sync_error: { type: String, default: null },
		sap_doc_entry: { type: Number, default: null },
		sap_doc_num: { type: Number, default: null },
		sap_synced_at: { type: Date, default: null },
	},
	{
		timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
	}
)

orderSchema.index(
	{ customer_id: 1, created_at: -1 },
	{ name: "orders_customer_created" }
)

orderSchema.index(
	{ expires_at: 1 },
	{ name: "orders_expires_at" }
)

orderSchema.index(
	{ "shipping_address.postal_code": 1, created_at: -1 },
	{ name: "orders_postal_created" }
)

orderSchema.index(
	{ should_sync: 1, sap_sync_status: 1 },
	{ name: "orders_should_sync_sap_status" }
)

export default mongoose.models.Order || model<OrderType>("Order", orderSchema, "orders")

import mongoose, { Schema, model } from "mongoose"

export enum OrderStatus {
	PENDING = "pending",
	CONFIRMED = "confirmed",
	SHIPPED = "shipped",
	CANCELLED = "cancelled",
	COMPLETED = "completed",
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

const orderItemSchema = new Schema(
	{
		article_id: { type: Schema.Types.ObjectId, ref: "Article", required: true },
		quantity: { type: Number, required: true, min: 1 },
		unit_price: { type: Number, required: true, min: 0 },
		total: { type: Number, required: true, min: 0 },
	},
	{ _id: false }
)

const orderSchema = new Schema(
	{
		customer_id: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
		items: { type: [orderItemSchema], required: true, default: [] },

		status: {
			type: String,
			enum: Object.values(OrderStatus),
			default: OrderStatus.PENDING,
			required: true,
		},

		tracking_number: { type: String },

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

		total: { type: Number, required: true, min: 0 },
		notes: { type: String },
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

export default mongoose.models.Order || model("Order", orderSchema, "orders")

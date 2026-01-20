import mongoose, { Schema, model } from "mongoose"

export enum OrderStatus {
	PENDING = "pending",
	CONFIRMED = "confirmed",
	SHIPPED = "shipped",
	CANCELLED = "cancelled",
	COMPLETED = "completed",
}

const orderItemSchema = new Schema(
	{
		article_id: { type: Schema.Types.ObjectId, ref: "Article", required: true },
		quantity: { type: Number, required: true },
		unit_price: { type: Number, required: true },
		total: { type: Number, required: true },
	},
	{ _id: false }
)

const orderSchema = new Schema({
	customer_id: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
	items: [orderItemSchema],
	status: {
		type: String,
		enum: Object.values(OrderStatus),
		default: OrderStatus.PENDING,
	},
	tracking_number: { type: String },
	total: { type: Number, required: true },
	notes: { type: String },
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date },
})

export default mongoose.models.Order || model("Order", orderSchema, "orders")

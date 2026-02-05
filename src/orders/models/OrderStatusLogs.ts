import mongoose, { Schema, model, Types } from "mongoose"
import { OrderStatus } from "./Orders"

export interface OrderStatusLogType {
	order_id: Types.ObjectId
	status: OrderStatus
	changed_by: Types.ObjectId
	changed_at?: Date
	note?: string
}

const orderStatusLogSchema = new Schema<OrderStatusLogType>(
	{
		order_id: {
			type: Schema.Types.ObjectId,
			ref: "Order",
			required: true,
		},
		status: {
			type: String,
			enum: Object.values(OrderStatus),
			required: true,
		},
		changed_by: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		changed_at: {
			type: Date,
			default: Date.now,
		},
		note: {
			type: String,
			trim: true,
		},
	},
	{ collection: "order_status_logs" }
)

orderStatusLogSchema.index(
	{ order_id: 1, changed_at: -1 },
	{ name: "order_status_logs_order_changed_at" }
)
orderStatusLogSchema.index(
	{ changed_by: 1, changed_at: -1 },
	{ name: "order_status_logs_changed_by_changed_at" }
)

export default
mongoose.models.OrderStatusLog ||
model<OrderStatusLogType>("OrderStatusLog", orderStatusLogSchema)

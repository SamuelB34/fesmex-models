import mongoose, { Schema, model, Types } from "mongoose"

export enum StockReservationStatus {
	ACTIVE = "active",
	RELEASED = "released",
	CONSUMED = "consumed",
}

export interface StockReservationType {
	order_id: Types.ObjectId
	article_id: Types.ObjectId
	warehouse_id: Types.ObjectId
	quantity: number
	expires_at: Date
	status: StockReservationStatus
	created_at?: Date
	updated_at?: Date
}

const stockReservationSchema = new Schema<StockReservationType>(
	{
		order_id: { type: Schema.Types.ObjectId, ref: "Order", required: true },
		article_id: { type: Schema.Types.ObjectId, ref: "Article", required: true },
		warehouse_id: { type: Schema.Types.ObjectId, ref: "Warehouse", required: true },
		quantity: { type: Number, required: true, min: 1 },
		expires_at: { type: Date, required: true },
		status: {
			type: String,
			enum: Object.values(StockReservationStatus),
			default: StockReservationStatus.ACTIVE,
			required: true,
		},
	},
	{
		timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
	}
)

stockReservationSchema.index(
	{ order_id: 1, article_id: 1, warehouse_id: 1 },
	{ name: "stock_reservations_order_article_warehouse" }
)

stockReservationSchema.index(
	{ status: 1, expires_at: 1 },
	{ name: "stock_reservations_status_expires" }
)

stockReservationSchema.index(
	{ article_id: 1, warehouse_id: 1, status: 1 },
	{ name: "stock_reservations_article_warehouse_status" }
)

export default mongoose.models.StockReservation || model<StockReservationType>("StockReservation", stockReservationSchema, "stock_reservations")

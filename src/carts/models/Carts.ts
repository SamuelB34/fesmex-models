import mongoose, { Schema, model, Types } from "mongoose"

export interface CartItem {
	article_id: Schema.Types.ObjectId
	quantity: number
	unit_price?: number
	line_subtotal?: number
	added_at?: Date
}

export interface CartType {
	customer_id: Schema.Types.ObjectId
	status: "ACTIVE" | "CHECKED_OUT" | "ABANDONED"
	currency: string
	price_list_id?: Schema.Types.ObjectId
	expires_at?: Date
	subtotal: number
	items: CartItem[]
	created_at?: Date
	updated_at?: Date
}

// Items se identifican por article_id, por eso no generamos _id
const cartItemSchema = new Schema<CartItem>(
	{
		article_id: { type: Types.ObjectId, ref: "Article", required: true },
		quantity: { type: Number, required: true, min: 1 },
		unit_price: { type: Number },
		line_subtotal: { type: Number },
		added_at: { type: Date, default: Date.now },
	},
	{ _id: false }
)

const cartSchema = new Schema<CartType>(
	{
		customer_id: {
			type: Types.ObjectId,
			ref: "Customer",
			required: true,
		},
		status: {
			type: String,
			enum: ["ACTIVE", "CHECKED_OUT", "ABANDONED"],
			default: "ACTIVE",
		},
		currency: { type: String, default: "MXN" },
		price_list_id: { type: Types.ObjectId, ref: "PriceList" },
		expires_at: { type: Date },
		subtotal: { type: Number, default: 0 },
		items: { type: [cartItemSchema], default: [] },
	},
	{
		timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
	}
)

// 1 carrito por customer
cartSchema.index({ customer_id: 1 }, { unique: true, name: "carts_customer_unique" })
// Orden/limpieza por actualización
cartSchema.index({ updated_at: -1 }, { name: "carts_updated_at" })

export default mongoose.models.Cart || model<CartType>("Cart", cartSchema, "carts")

import { Schema, model, models, Types } from "mongoose"

export interface CartItem {
	article_id: Schema.Types.ObjectId
	quantity: number
}

export interface CartType {
	customer_id: Schema.Types.ObjectId
	items: CartItem[]
	updated_at?: Date
}

const cartItemSchema = new Schema<CartItem>(
	{
		article_id: { type: Types.ObjectId, ref: "Article", required: true },
		quantity: { type: Number, required: true },
	},
	{ _id: false }
)

const cartSchema = new Schema<CartType>({
	customer_id: {
		type: Types.ObjectId,
		ref: "Customer",
		required: true,
		unique: true,
	},
	items: [cartItemSchema],
	updated_at: { type: Date, default: Date.now },
})

export default models.Cart || model<CartType>("Cart", cartSchema, "carts")

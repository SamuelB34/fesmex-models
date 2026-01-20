import { Schema, model, models } from "mongoose"

const priceListSchema = new Schema({
	number: { type: String, required: true, unique: true },
	name: { type: String, required: true },
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date },
})

export default models.PriceList || model("PriceList", priceListSchema, "price_lists")

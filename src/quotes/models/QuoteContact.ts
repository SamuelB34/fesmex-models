import { Schema, model, models } from "mongoose"

const quoteContactSchema = new Schema({
	quote_id: { type: Schema.Types.ObjectId, ref: "Quote", required: true },
	name: String,
	email: String,
	mobile: String,
	pipedrive_id: String,
	created_at: { type: Date, default: Date.now },
})

export default models.QuoteContact || model("QuoteContact", quoteContactSchema, "quote_contacts")

import { Schema, model, models } from "mongoose"

const quoteTermSchema = new Schema(
	{
		title: String,
		content: { type: String, required: true },
		category: String,
		is_active: { type: Boolean, default: true },
		created_by: String,
		updated_by: String,
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
)

export default models.QuoteTerm || model("QuoteTerm", quoteTermSchema, "quote_terms")

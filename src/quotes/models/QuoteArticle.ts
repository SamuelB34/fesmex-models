import mongoose, { Schema, model } from "mongoose"

const quoteArticleSchema = new Schema(
	{
		quote_id: { type: Schema.Types.ObjectId, ref: "Quote", required: true },
		article_id: { type: Schema.Types.ObjectId, ref: "Article" },
		article_number: { type: String },
		description: { type: String },
		delivery: { type: String },
		quantity: { type: Number },
		price: { type: Number },
		unit_price: { type: Number },
		original_price: { type: Number },
		total: { type: Number },
		utility: { type: Number },
		type: { type: String },
		extra_id: { type: Schema.Types.ObjectId, ref: "QuoteArticleExtra" },
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
)

export default mongoose.models.QuoteArticle || model("QuoteArticle", quoteArticleSchema, "quote_articles")

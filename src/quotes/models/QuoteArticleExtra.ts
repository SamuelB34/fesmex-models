import mongoose, { Schema, model } from "mongoose"

const quoteArticleExtraSchema = new Schema(
	{
		quote_article_id: {
			type: Schema.Types.ObjectId,
			ref: "QuoteArticle",
			required: true,
		},
		multiplier: Number,
		usa_freight: Number,
		usa_expenses: Number,
		duty: Number,
		mex_freight: Number,
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
)

export default mongoose.models.QuoteArticleExtra || model("QuoteArticleExtra", quoteArticleExtraSchema, "quote_article_extras")

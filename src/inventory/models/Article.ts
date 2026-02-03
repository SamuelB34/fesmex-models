import mongoose, { Schema, model, Types } from "mongoose"

const articleSchema = new Schema({
	article_number: { type: String, required: true, unique: true }, // SAP ItemCode
	description: { type: String, required: true },
	unit: { type: String, required: true },
	brand: { type: String },
	model: { type: String },
	group_id: { type: Types.ObjectId, ref: "ArticleGroup", required: true },
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date },
})

articleSchema.index(
	{ description: "text", brand: "text", model: "text" },
	{ name: "articles_text_search" }
)
articleSchema.index({ group_id: 1, updated_at: -1 }, { name: "articles_group_updated" })
articleSchema.index({ updated_at: -1 }, { name: "articles_updated" })

export default mongoose.models.Article || model("Article", articleSchema, "articles")

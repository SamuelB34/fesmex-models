import mongoose, { Schema, model, Types } from "mongoose"

const articleFileSchema = new Schema(
	{
		key: { type: String, required: true },
		url: { type: String, required: true },
		filename: { type: String, required: true },
		mime_type: { type: String, required: true },
		size: { type: Number, required: true },
		uploaded_at: { type: Date, default: Date.now },
		uploaded_by: { type: String, required: true },
	},
	{ _id: false }
)

const articleSchema = new Schema({
	article_number: { type: String, required: true, unique: true }, // SAP ItemCode
	description: { type: String, required: true },
	unit: { type: String, required: true },
	brand: { type: String },
	model: { type: String },
	group_id: { type: Types.ObjectId, ref: "ArticleGroup", required: true },
	category_id: { type: Types.ObjectId, ref: "Category", required: false, index: true },
	tags: { type: [Types.ObjectId], ref: "Tag", default: [], index: true },
	is_featured: { type: Boolean, default: false, index: true },
	featured_order: { type: Number, default: 0 },
	files: {
		images: { type: [articleFileSchema], required: false },
		datasheets: { type: [articleFileSchema], required: false },
	},
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date },
	deleted_at: { type: Date },
})

articleSchema.index(
	{ description: "text", brand: "text", model: "text" },
	{ name: "articles_text_search" }
)
articleSchema.index({ group_id: 1, updated_at: -1 }, { name: "articles_group_updated" })
articleSchema.index({ category_id: 1, updated_at: -1 }, { name: "articles_category_updated" })
articleSchema.index({ updated_at: -1 }, { name: "articles_updated" })
articleSchema.index(
	{ deleted_at: 1, updated_at: -1 },
	{ name: "articles_not_deleted_sort" }
)
articleSchema.index({ is_featured: 1, featured_order: 1 }, { name: "articles_featured_order" })

export default mongoose.models.Article || model("Article", articleSchema, "articles")

import { Schema, model, models, Types } from "mongoose"

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

export default models.Article || model("Article", articleSchema, "articles")

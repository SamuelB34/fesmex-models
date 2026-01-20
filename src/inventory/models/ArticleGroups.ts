import mongoose, { Schema, model } from "mongoose"

const articleGroupSchema = new Schema({
	name: { type: String, required: true },
	description: { type: String },
})

export default mongoose.models.ArticleGroup || model("ArticleGroup", articleGroupSchema, "article_groups")

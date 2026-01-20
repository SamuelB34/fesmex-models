import mongoose, { Schema, model } from "mongoose"

const articleClassSchema = new Schema({
	name: { type: String, required: true },
	description: { type: String },
})

export default mongoose.models.ArticleClass || model("ArticleClass", articleClassSchema, "article_classes")

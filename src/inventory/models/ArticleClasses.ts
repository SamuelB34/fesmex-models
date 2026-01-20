import { Schema, model, models } from "mongoose"

const articleClassSchema = new Schema({
	name: { type: String, required: true },
	description: { type: String },
})

export default models.ArticleClass || model("ArticleClass", articleClassSchema, "article_classes")

import { Schema, model, models } from "mongoose"

const articleGroupSchema = new Schema({
	name: { type: String, required: true },
	description: { type: String },
})

export default models.ArticleGroup || model("ArticleGroup", articleGroupSchema, "article_groups")

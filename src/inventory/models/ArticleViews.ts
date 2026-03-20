import mongoose, { Schema, model, type Model, type HydratedDocument, type Types } from "mongoose"

export interface ArticleViewType {
	article_id: Types.ObjectId
	visited_at: Date
}

export type ArticleViewDoc = HydratedDocument<ArticleViewType>
export type ArticleViewModel = Model<ArticleViewType>

const articleViewSchema = new Schema<ArticleViewType>(
	{
		article_id: { type: Schema.Types.ObjectId, ref: "Article", required: true },
		visited_at: { type: Date, default: Date.now },
	},
	{ collection: "article_views" }
)

const ArticleView: ArticleViewModel =
	(mongoose.models.ArticleView as ArticleViewModel) ||
	model<ArticleViewType>("ArticleView", articleViewSchema)

export default ArticleView
